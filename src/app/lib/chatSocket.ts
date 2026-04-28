import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;
let socketToken: string | null = null;

function getSocketBaseUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  return apiUrl.replace(/\/api\/?$/, '');
}

export function getChatSocket(token: string): Socket {
  const baseUrl = getSocketBaseUrl();
  if (socket && socket.connected && socketToken === token) return socket;
  if (socket && socketToken !== token) {
    socket.disconnect();
    socket = null;
  }
  socketToken = token;
  socket = io(baseUrl, {
    transports: ['websocket'],
    auth: { token },
  });
  return socket;
}

export function disconnectChatSocket() {
  if (socket) socket.disconnect();
  socket = null;
  socketToken = null;
}
