import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Send } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { api } from '@/app/api/client';
import { getChatSocket } from '@/app/lib/chatSocket';

type UserRow = { id: number; name: string; role: 'client' | 'groomer' | 'admin' };
type MessageRow = { id: number; sender_id: number; recipient_id: number; message: string; created_at?: string; is_read?: boolean };

export function StaffWorkChatsPage() {
  const { user } = useAuth();
  const { list: users } = useEntity<UserRow>('users', { fetchListOnMount: !!user, enabled: !!user, listParams: { limit: 500 } });
  const [partnerId, setPartnerId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [online, setOnline] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const staff = useMemo(
    () => users.filter((u) => (u.role === 'admin' || u.role === 'groomer') && u.id !== user?.id),
    [users, user?.id]
  );
  const partner = partnerId != null ? staff.find((u) => u.id === partnerId) : undefined;

  useEffect(() => {
    if (partnerId == null && staff.length > 0) setPartnerId(staff[0].id);
  }, [staff, partnerId]);

  useEffect(() => {
    if (!user || !partnerId) return;
    void (async () => {
      setLoading(true);
      const res = await api.get<{ success?: boolean; data?: MessageRow[] }>(`/conversations/with/${partnerId}`);
      setLoading(false);
      if ('error' in res) return;
      setMessages(Array.isArray(res.data?.data) ? res.data.data : []);
    })();
  }, [user, partnerId]);

  useEffect(() => {
    if (!user || !partnerId) return;
    const token = localStorage.getItem('mars_groom_token');
    if (!token) return;
    const socket = getChatSocket(token);
    socket.emit('chat:join', { partnerUserId: partnerId });
    const onNew = (row: MessageRow) => {
      const mine = row.sender_id === user.id && row.recipient_id === partnerId;
      const incoming = row.sender_id === partnerId && row.recipient_id === user.id;
      if (!mine && !incoming) return;
      setMessages((prev) => (prev.some((m) => m.id === row.id) ? prev : [...prev, row]));
      if (incoming) socket.emit('chat:read', { partnerUserId: partnerId });
    };
    const onPresence = (p: { userId: number; online: boolean }) => {
      if (p.userId === partnerId) setOnline(Boolean(p.online));
    };
    const onTyping = (p: { fromUserId: number; isTyping: boolean }) => {
      if (p.fromUserId === partnerId) setTyping(Boolean(p.isTyping));
    };
    const onRead = (p: { readerUserId: number; messageIds: number[] }) => {
      if (p.readerUserId !== partnerId) return;
      setMessages((prev) => prev.map((m) => (p.messageIds.includes(m.id) ? { ...m, is_read: true } : m)));
    };
    socket.on('chat:new', onNew);
    socket.on('presence:update', onPresence);
    socket.on('chat:typing', onTyping);
    socket.on('chat:read', onRead);
    return () => {
      socket.emit('chat:leave', { partnerUserId: partnerId });
      socket.off('chat:new', onNew);
      socket.off('presence:update', onPresence);
      socket.off('chat:typing', onTyping);
      socket.off('chat:read', onRead);
    };
  }, [user, partnerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!partnerId || !user || !text.trim()) return;
    const token = localStorage.getItem('mars_groom_token');
    if (!token) return;
    const socket = getChatSocket(token);
    const payload = text.trim();
    socket.emit('chat:send', { partnerUserId: partnerId, message: payload }, async (ack: { ok: boolean }) => {
      if (!ack?.ok) await api.post(`/conversations/with/${partnerId}`, { message: payload });
      setText('');
    });
  };

  const onChangeText = (value: string) => {
    setText(value);
    if (!partnerId) return;
    const token = localStorage.getItem('mars_groom_token');
    if (!token) return;
    const socket = getChatSocket(token);
    socket.emit('chat:typing', { partnerUserId: partnerId, isTyping: true });
    if (typingTimeoutRef.current != null) window.clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => socket.emit('chat:typing', { partnerUserId: partnerId, isTyping: false }), 1200);
  };

  if (!user || (user.role !== 'admin' && user.role !== 'groomer')) return <div className="p-8">Доступ только для сотрудников.</div>;

  return (
    <div className="p-6 h-[calc(100vh-7rem)]">
      <div className="grid grid-cols-[280px_1fr] gap-4 h-full">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 overflow-y-auto">
          <h2 className="font-bold mb-3">Рабочие чаты</h2>
          <div className="space-y-1">
            {staff.map((u) => (
              <button key={u.id} type="button" onClick={() => setPartnerId(u.id)} className={`w-full text-left px-3 py-2 rounded-lg ${partnerId === u.id ? 'bg-[#40AB40]/15 text-[#2d8a2d]' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                <span className="font-medium">{u.name}</span>
                <span className="ml-2 text-xs text-gray-500">{u.role}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold">{partner?.name ?? 'Выберите сотрудника'}</p>
            <p className="text-xs text-gray-500">{typing ? 'печатает…' : online ? 'онлайн (в этом чате)' : 'не в сети'}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? <div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#40AB40]" /></div> : null}
            {messages.map((m) => {
              const mine = m.sender_id === user.id;
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? 'bg-[#40AB40] text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    {m.message}
                    {mine ? <p className="text-[10px] mt-1 opacity-80">{m.is_read ? 'прочитано' : 'доставлено'}</p> : null}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <textarea value={text} onChange={(e) => onChangeText(e.target.value)} rows={2} className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm" placeholder="Сообщение..." />
            <button type="button" onClick={send} className="h-11 w-11 rounded-lg bg-[#40AB40] text-white flex items-center justify-center">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <Link to={user.role === 'admin' ? '/dashboard-admin' : '/dashboard-groomer'} className="text-sm text-gray-500 mt-2 inline-block">Назад</Link>
    </div>
  );
}
