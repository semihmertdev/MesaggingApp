import { useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef();

  useEffect(() => {
    // Socket.IO bağlantısını başlat
    socketRef.current = io(SOCKET_SERVER_URL);

    // Component unmount olduğunda bağlantıyı kapat
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const joinRoom = useCallback((roomId) => {
    if (socketRef.current) {
      socketRef.current.emit('join_room', roomId);
    }
  }, []);

  const sendMessage = useCallback((messageData) => {
    if (socketRef.current) {
      socketRef.current.emit('send_message', messageData);
    }
  }, []);

  const subscribeToMessages = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on('receive_message', (data) => {
        callback(data);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('receive_message');
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    joinRoom,
    sendMessage,
    subscribeToMessages,
  };
}; 