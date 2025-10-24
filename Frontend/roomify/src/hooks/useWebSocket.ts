import { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  type: 'join' | 'chat' | 'leave' | 'userJoined' | 'userLeft' | 'error';
  payload: {
    roomId?: string;
    userId?: string;
    userName?: string;
    message?: string;
    timestamp?: string;
    messageId?: string;
  };
}

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
  messageType: 'chat' | 'system';
}

export const useWebSocket = (url: string, roomId: string, userName: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const reconnectTimeoutRef = useRef<number | null>(null);
  const userIdRef = useRef<string>(Date.now().toString());

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const addSystemMessage = useCallback((text: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'System',
      timestamp: new Date(),
      isOwn: false,
      messageType: 'system'
    };
    addMessage(systemMessage);
  }, [addMessage]);

  const connectWebSocket = useCallback(() => {
    // Don't connect if userName is empty
    if (!userName || userName.trim() === '') {
      console.log('Username not provided, skipping WebSocket connection');
      return null;
    }

    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
        setError(null);
        setSocket(ws);
        
        // Join the room
        const joinMessage: Message = {
          type: 'join',
          payload: {
            roomId,
            userId: userIdRef.current,
            userName
          }
        };
        ws.send(JSON.stringify(joinMessage));
      };

      ws.onmessage = (event) => {
        try {
          const message: Message = JSON.parse(event.data);
          console.log('Received message:', message);

          switch (message.type) {
            case 'join':
              addSystemMessage(`Connected to room ${roomId}`);
              break;
            
            case 'chat':
              if (message.payload.userName && message.payload.message) {
                const chatMessage: ChatMessage = {
                  id: message.payload.messageId || Date.now().toString(),
                  text: message.payload.message,
                  sender: message.payload.userName,
                  timestamp: message.payload.timestamp ? new Date(message.payload.timestamp) : new Date(),
                  isOwn: message.payload.userId === userIdRef.current,
                  messageType: 'chat'
                };
                addMessage(chatMessage);
              }
              break;
            
            case 'userJoined':
            case 'userLeft':
              if (message.payload.message) {
                addSystemMessage(message.payload.message);
              }
              break;
            
            case 'error':
              setError(message.payload.message || 'An error occurred');
              break;
          }
        } catch (err) {
          console.error('Error parsing message:', err);
          setError('Error parsing server message');
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        setSocket(null);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log('Attempting to reconnect...');
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error');
        setIsConnected(false);
      };

      return ws;
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError('Failed to connect to server');
      return null;
    }
  }, [url, roomId, userName, addMessage, addSystemMessage]);

  const sendMessage = useCallback((message: string) => {
    if (socket && isConnected && message.trim()) {
      const chatMessage: Message = {
        type: 'chat',
        payload: {
          message: message.trim()
        }
      };
      socket.send(JSON.stringify(chatMessage));
      return true;
    }
    return false;
  }, [socket, isConnected]);

  const disconnect = useCallback(() => {
    if (socket) {
      const leaveMessage: Message = {
        type: 'leave',
        payload: {
          userId: userIdRef.current
        }
      };
      socket.send(JSON.stringify(leaveMessage));
      socket.close();
    }
  }, [socket]);

  useEffect(() => {
    // Only attempt connection if userName is provided
    if (userName && userName.trim() !== '') {
      connectWebSocket();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userName]); // Connect when userName changes

  return {
    isConnected,
    messages,
    error,
    sendMessage,
    disconnect,
    reconnect: connectWebSocket
  };
};