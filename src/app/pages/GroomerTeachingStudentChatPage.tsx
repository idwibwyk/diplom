import { Link, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { api } from '@/app/api/client';
import { useEntity } from '@/app/hooks';
import { getChatSocket } from '@/app/lib/chatSocket';

type UserRow = { id: number; name: string };
type MessageRow = { id: number; sender_id: number; recipient_id: number; message: string; created_at?: string; is_read?: boolean };

export function GroomerTeachingStudentChatPage() {
  const { user } = useAuth();
  const [search] = useSearchParams();
  const userIdParam = search.get('userId');
  const partnerUserId = userIdParam ? parseInt(userIdParam, 10) : NaN;

  const { item: partner } = useEntity<UserRow>('users', {
    id: Number.isFinite(partnerUserId) ? partnerUserId : null,
    fetchItemOnMount: Number.isFinite(partnerUserId),
    fetchListOnMount: false,
    enabled: Number.isFinite(partnerUserId),
  });

  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const loadMessages = useCallback(async () => {
    if (!Number.isFinite(partnerUserId) || !user) return;
    setLoadingMessages(true);
    const res = await api.get<{ success?: boolean; data?: MessageRow[] }>(`/conversations/with/${partnerUserId}`);
    setLoadingMessages(false);
    if ('error' in res) return;
    setMessages(Array.isArray(res.data?.data) ? res.data.data : []);
  }, [partnerUserId, user]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!user || !Number.isFinite(partnerUserId)) return;
    const token = localStorage.getItem('mars_groom_token');
    if (!token) return;
    const socket = getChatSocket(token);
    socket.emit('chat:join', { partnerUserId });
    const onMessage = (row: MessageRow) => {
      const mine = row.sender_id === user.id && row.recipient_id === partnerUserId;
      const incoming = row.sender_id === partnerUserId && row.recipient_id === user.id;
      if (!mine && !incoming) return;
      setMessages((prev) => (prev.some((m) => m.id === row.id) ? prev : [...prev, row]));
      if (incoming) socket.emit('chat:read', { partnerUserId });
    };
    const onPresence = (payload: { userId: number; online: boolean }) => {
      if (payload.userId === partnerUserId) setIsPartnerOnline(Boolean(payload.online));
    };
    const onTyping = (payload: { fromUserId: number; isTyping: boolean }) => {
      if (payload.fromUserId === partnerUserId) setIsPartnerTyping(Boolean(payload.isTyping));
    };
    const onRead = (payload: { readerUserId: number; partnerUserId: number; messageIds: number[] }) => {
      if (payload.readerUserId !== partnerUserId) return;
      setMessages((prev) => prev.map((m) => (payload.messageIds.includes(m.id) ? { ...m, is_read: true } : m)));
    };
    socket.on('chat:new', onMessage);
    socket.on('presence:update', onPresence);
    socket.on('chat:typing', onTyping);
    socket.on('chat:read', onRead);
    return () => {
      socket.emit('chat:leave', { partnerUserId });
      socket.off('chat:new', onMessage);
      socket.off('presence:update', onPresence);
      socket.off('chat:typing', onTyping);
      socket.off('chat:read', onRead);
    };
  }, [user, partnerUserId]);

  useEffect(() => {
    if (!user || !Number.isFinite(partnerUserId) || messages.length === 0) return;
    const token = localStorage.getItem('mars_groom_token');
    if (!token) return;
    const socket = getChatSocket(token);
    socket.emit('chat:read', { partnerUserId });
  }, [messages, user, partnerUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const canChat = useMemo(() => Boolean(user && Number.isFinite(partnerUserId) && partnerUserId !== user.id), [user, partnerUserId]);

  const send = async () => {
    if (!canChat || !text.trim() || sending) return;
    setSending(true);
    const token = localStorage.getItem('mars_groom_token');
    if (!token) {
      setSending(false);
      return;
    }
    const socket = getChatSocket(token);
    const payloadText = text.trim();
    socket.emit('chat:send', { partnerUserId, message: payloadText }, async (ack: { ok: boolean }) => {
      setSending(false);
      if (!ack?.ok) {
        const res = await api.post(`/conversations/with/${partnerUserId}`, { message: payloadText });
        if ('error' in res) return;
      }
      setText('');
    });
  };

  const onChangeText = (value: string) => {
    setText(value);
    const token = localStorage.getItem('mars_groom_token');
    if (!token || !Number.isFinite(partnerUserId)) return;
    const socket = getChatSocket(token);
    socket.emit('chat:typing', { partnerUserId, isTyping: true });
    if (typingTimeoutRef.current != null) window.clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      socket.emit('chat:typing', { partnerUserId, isTyping: false });
    }, 1200);
  };

  if (!user || !Number.isFinite(partnerUserId)) {
    return <div className="p-8">Некорректный пользователь для чата.</div>;
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col bg-gradient-to-b from-emerald-50/40 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="border-b border-[#40AB40]/20 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Link to="/dashboard-groomer/teaching" className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-[#40AB40]">
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Link>
        <div>
          <p className="font-semibold">{partner?.name ?? `Пользователь #${partnerUserId}`}</p>
          <p className="text-xs text-gray-500">{isPartnerTyping ? 'печатает…' : isPartnerOnline ? 'онлайн' : 'не в сети'}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-3xl mx-auto w-full">
        {loadingMessages ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#40AB40] animate-spin" /></div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-12">Пока нет сообщений. Напишите первым.</p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === user.id;
            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${mine ? 'bg-[#40AB40] text-white rounded-br-md' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-md'}`}>
                  <p className="whitespace-pre-wrap break-words">{m.message}</p>
                  {m.sender_id === user.id ? <p className="text-[10px] mt-1 opacity-80">{m.is_read ? 'прочитано' : 'доставлено'}</p> : null}
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 p-4 max-w-3xl mx-auto w-full">
        <div className="flex gap-2">
          <textarea value={text} onChange={(e) => onChangeText(e.target.value)} placeholder="Сообщение ученику…" rows={2} className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm" disabled={sending} />
          <button type="button" onClick={() => void send()} disabled={sending || !text.trim()} className="self-end shrink-0 h-11 w-11 rounded-xl bg-[#40AB40] text-white flex items-center justify-center disabled:opacity-40">
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
