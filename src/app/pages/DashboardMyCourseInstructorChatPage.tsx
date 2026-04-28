import { Link, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useEntity } from '@/app/hooks';
import { api } from '@/app/api/client';
import { getChatSocket } from '@/app/lib/chatSocket';

type MasterRow = { id: number; full_name: string; user_id: number | null; image: string | null };
type MessageRow = {
  id: number;
  sender_id: number;
  recipient_id: number;
  message: string;
  is_read?: boolean;
  created_at?: string;
};

export function DashboardMyCourseInstructorChatPage() {
  const { user } = useAuth();
  const [search] = useSearchParams();
  const masterIdParam = search.get('masterId');
  const masterId = masterIdParam ? parseInt(masterIdParam, 10) : NaN;

  const { item: master, loadingItem, loadingItemError } = useEntity<MasterRow>('masters', {
    id: Number.isFinite(masterId) ? masterId : null,
    fetchItemOnMount: Number.isFinite(masterId),
    fetchListOnMount: false,
    enabled: Number.isFinite(masterId),
  });

  const partnerUserId = master?.user_id ?? null;
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [isPartnerOnline, setIsPartnerOnline] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const loadMessages = useCallback(async () => {
    if (!partnerUserId || !user) return;
    setLoadingMessages(true);
    const res = await api.get<{ success?: boolean; data?: MessageRow[] }>(`/conversations/with/${partnerUserId}`);
    setLoadingMessages(false);
    if ('error' in res) {
      setMessages([]);
      return;
    }
    const body = res.data as { success?: boolean; data?: MessageRow[] };
    setMessages(Array.isArray(body?.data) ? body.data : []);
  }, [partnerUserId, user]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!user || !partnerUserId) return;
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
    if (!user || !partnerUserId || messages.length === 0) return;
    const token = localStorage.getItem('mars_groom_token');
    if (!token) return;
    const socket = getChatSocket(token);
    socket.emit('chat:read', { partnerUserId });
  }, [messages, user, partnerUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const canChat = useMemo(() => Boolean(user && partnerUserId && partnerUserId !== user.id), [user, partnerUserId]);

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
    if (!token || !partnerUserId) return;
    const socket = getChatSocket(token);
    socket.emit('chat:typing', { partnerUserId, isTyping: true });
    if (typingTimeoutRef.current != null) window.clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      socket.emit('chat:typing', { partnerUserId, isTyping: false });
    }, 1200);
  };

  if (!user) {
    return (
      <div className="p-8">
        <Link to="/dashboard/my-courses" className="text-[#40AB40]">
          Мои курсы
        </Link>
      </div>
    );
  }

  if (!Number.isFinite(masterId)) {
    return (
      <div className="p-8 max-w-lg">
        <p className="text-gray-600 mb-4">Укажите мастера в ссылке.</p>
        <Link to="/dashboard/my-courses" className="text-[#40AB40] inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Link>
      </div>
    );
  }

  if (loadingItem && !master) {
    return (
      <div className="p-16 flex justify-center">
        <Loader2 className="w-10 h-10 text-[#40AB40] animate-spin" />
      </div>
    );
  }

  if (loadingItemError || !master) {
    return (
      <div className="p-8">
        <p className="text-gray-600 mb-4">Мастер не найден.</p>
        <Link to="/dashboard/my-courses" className="text-[#40AB40]">
          Мои курсы
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col bg-gradient-to-b from-emerald-50/40 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="border-b border-[#40AB40]/20 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Link
          to="/dashboard/my-courses"
          className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-[#40AB40]"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-2 min-w-0">
          {master.image ? (
            <img src={master.image} alt="" className="h-9 w-9 rounded-full object-cover border border-[#40AB40]/30" />
          ) : (
            <span className="h-9 w-9 rounded-full bg-[#40AB40]/20 flex items-center justify-center text-xs font-bold text-[#40AB40]">
              {master.full_name.slice(0, 1)}
            </span>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white truncate">{master.full_name}</p>
            <p className="text-xs text-gray-500">{isPartnerTyping ? 'печатает…' : isPartnerOnline ? 'онлайн' : 'не в сети'}</p>
          </div>
        </div>
      </div>

      {!partnerUserId ? (
        <div className="p-6 text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 m-4 rounded-xl">
          Для этого преподавателя не привязан пользователь в системе — напишите через администратора салона.
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-3xl mx-auto w-full">
            {loadingMessages ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#40AB40] animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-12">Пока нет сообщений. Напишите первым.</p>
            ) : (
              messages.map((m) => {
                const mine = m.sender_id === user.id;
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        mine
                          ? 'bg-[#40AB40] text-white rounded-br-md'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.message}</p>
                      <div className={`text-[10px] mt-1 flex items-center gap-2 ${mine ? 'text-white/80' : 'text-gray-400'}`}>
                        {m.created_at ? new Date(m.created_at).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' }) : ''}
                        {mine ? <span>{m.is_read ? 'прочитано' : 'доставлено'}</span> : null}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 p-4 max-w-3xl mx-auto w-full">
            <div className="flex gap-2">
              <textarea
                value={text}
                onChange={(e) => onChangeText(e.target.value)}
                placeholder="Сообщение преподавателю…"
                rows={2}
                className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#40AB40] focus:border-transparent"
                disabled={sending}
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={sending || !text.trim()}
                className="self-end shrink-0 h-11 w-11 rounded-xl bg-[#40AB40] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#359635]"
                aria-label="Отправить"
              >
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
