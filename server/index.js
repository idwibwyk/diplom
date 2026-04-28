/**
 * Сервер API MARS GROOM — Express + универсальный CRUD с проверкой прав по ролям.
 * Запуск: node server/index.js или npm run server
 */
<<<<<<< Updated upstream
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { startRemindersWorker } from './services/reminders.js';
=======
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import db from './db/knex.js';
import routes from './routes/index.js';
import { JWT_SECRET } from './middleware/auth.js';
>>>>>>> Stashed changes

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const uploadsDir = path.join(projectRoot, 'uploads');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use('/uploads', express.static(uploadsDir));
app.use('/api', routes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'MARS GROOM API' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Ошибка сервера' });
});

<<<<<<< Updated upstream
app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}/api`);
  startRemindersWorker();
=======
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
});
const roomUsers = new Map();
function getRoomKey(a, b) {
  const x = Number(a);
  const y = Number(b);
  return x < y ? `chat:${x}:${y}` : `chat:${y}:${x}`;
}
function incRoomUser(room, userId) {
  const users = roomUsers.get(room) ?? new Map();
  users.set(userId, (users.get(userId) ?? 0) + 1);
  roomUsers.set(room, users);
}
function decRoomUser(room, userId) {
  const users = roomUsers.get(room);
  if (!users) return;
  const left = (users.get(userId) ?? 1) - 1;
  if (left <= 0) users.delete(userId);
  else users.set(userId, left);
  if (users.size === 0) roomUsers.delete(room);
}
function isUserInRoom(room, userId) {
  return (roomUsers.get(room)?.get(userId) ?? 0) > 0;
}

io.use((socket, next) => {
  try {
    const tokenRaw =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.toString().replace(/^Bearer\s+/i, '') ||
      null;
    if (!tokenRaw) return next(new Error('unauthorized'));
    const decoded = jwt.verify(tokenRaw, JWT_SECRET);
    socket.user = { id: decoded.id, role: decoded.role || 'client' };
    return next();
  } catch {
    return next(new Error('unauthorized'));
  }
});

io.on('connection', (socket) => {
  const me = socket.user?.id;
  if (!me) return;
  socket.join(`user:${me}`);

  socket.on('chat:join', ({ partnerUserId }) => {
    const partner = Number(partnerUserId);
    if (!partner) return;
    const room = getRoomKey(me, partner);
    const prevRoom = socket.data.currentRoom;
    if (prevRoom && prevRoom !== room) {
      socket.leave(prevRoom);
      decRoomUser(prevRoom, me);
    }
    socket.join(room);
    socket.data.currentRoom = room;
    socket.data.currentPartner = partner;
    incRoomUser(room, me);
    io.to(`user:${me}`).emit('presence:update', { userId: partner, online: isUserInRoom(room, partner) });
    io.to(`user:${partner}`).emit('presence:update', { userId: me, online: isUserInRoom(room, me) });
  });

  socket.on('chat:leave', ({ partnerUserId }) => {
    const partner = Number(partnerUserId);
    if (!partner) return;
    const room = getRoomKey(me, partner);
    socket.leave(room);
    decRoomUser(room, me);
    if (socket.data.currentRoom === room) {
      socket.data.currentRoom = null;
      socket.data.currentPartner = null;
    }
    io.to(`user:${me}`).emit('presence:update', { userId: partner, online: isUserInRoom(room, partner) });
    io.to(`user:${partner}`).emit('presence:update', { userId: me, online: isUserInRoom(room, me) });
  });

  socket.on('chat:send', async (payload, ack) => {
    try {
      const partner = Number(payload?.partnerUserId);
      const message = typeof payload?.message === 'string' ? payload.message.trim() : '';
      if (!partner || partner < 1 || !message) {
        if (typeof ack === 'function') ack({ ok: false, error: 'Некорректные данные сообщения' });
        return;
      }
      const inserted = await db('messages')
        .insert({
          sender_id: me,
          recipient_id: partner,
          message,
          is_read: false,
          type: 'chat',
          created_by: me,
        })
        .returning('*');
      const row = Array.isArray(inserted) ? inserted[0] : inserted;
      io.to(`user:${me}`).to(`user:${partner}`).emit('chat:new', row);
      if (typeof ack === 'function') ack({ ok: true, data: row });
    } catch (error) {
      if (typeof ack === 'function') ack({ ok: false, error: error.message || 'Ошибка отправки' });
    }
  });

  socket.on('chat:typing', (payload) => {
    const partner = Number(payload?.partnerUserId);
    const isTyping = Boolean(payload?.isTyping);
    if (!partner || partner < 1) return;
    const room = getRoomKey(me, partner);
    io.to(room).emit('chat:typing', { fromUserId: me, isTyping });
  });

  socket.on('chat:read', async (payload) => {
    try {
      const partner = Number(payload?.partnerUserId);
      if (!partner || partner < 1) return;
      const updated = await db('messages')
        .where({ sender_id: partner, recipient_id: me, is_read: false })
        .update({ is_read: true, read_at: db.raw('now()') })
        .returning(['id']);
      const ids = Array.isArray(updated) ? updated.map((r) => Number(r.id ?? r)) : [];
      io.to(`user:${me}`).to(`user:${partner}`).emit('chat:read', {
        readerUserId: me,
        partnerUserId: partner,
        messageIds: ids,
      });
    } catch {
      // ignore socket read errors
    }
  });

  socket.on('disconnect', () => {
    const partner = Number(socket.data.currentPartner);
    const room = socket.data.currentRoom;
    if (room && partner) {
      decRoomUser(room, me);
      io.to(`user:${partner}`).emit('presence:update', { userId: me, online: isUserInRoom(room, me) });
    }
  });
});

server.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}/api`);
>>>>>>> Stashed changes
});
