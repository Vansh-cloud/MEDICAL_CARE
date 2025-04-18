import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeChat = (userId: string) => {
  socket = io('your-socket-server-url', {
    auth: {
      userId
    }
  });
  
  socket.on('connect', () => {
    console.log('Connected to chat server');
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from chat server');
  });
  
  return socket;
};

export const sendMessage = (recipientId: string, message: string) => {
  if (!socket) {
    throw new Error('Chat not initialized');
  }
  
  socket.emit('send_message', {
    recipientId,
    message,
    timestamp: new Date().toISOString()
  });
};

export const onReceiveMessage = (callback: (message: any) => void) => {
  if (!socket) {
    throw new Error('Chat not initialized');
  }
  
  socket.on('receive_message', callback);
};

export const disconnectChat = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};