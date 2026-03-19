import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let currentToken: string | null = null;

export function getSocket(): Socket {
  const token = typeof window !== 'undefined' ? localStorage.getItem('streaksy_token') : null;

  // If token changed, disconnect old socket
  if (socket && currentToken !== token) {
    socket.disconnect();
    socket = null;
  }

  if (!socket) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const baseUrl = apiUrl.replace('/api', '');
    socket = io(baseUrl, {
      auth: { token },
      autoConnect: false,
    });
    currentToken = token;
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
