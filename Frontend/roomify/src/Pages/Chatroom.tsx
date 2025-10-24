
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebSocket } from '../hooks/useWebSocket';

interface ChatroomProps {
  roomId?: string;
  userName?: string;
}

export default function Chatroom({ roomId: propRoomId, userName: propUserName }: ChatroomProps) {
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState(propUserName || '');
  const roomId = propRoomId || urlRoomId || 'general';
  const [isUserNameSet, setIsUserNameSet] = useState(!!propUserName);
  const [tempUserName, setTempUserName] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userNameInputRef = useRef<HTMLInputElement>(null);

  // WebSocket connection - only connect when username is set
  const { isConnected, messages, error, sendMessage, reconnect } = useWebSocket(
    'ws://localhost:8080',
    roomId,
    userName
  );

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus management
  useEffect(() => {
    if (!isUserNameSet && userNameInputRef.current) {
      userNameInputRef.current.focus();
    } else if (isUserNameSet && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isUserNameSet]);

  // Handle username submission
  const handleUserNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUserName.trim()) {
      setUserName(tempUserName.trim());
      setIsUserNameSet(true);
    }
  };

  // Focus username input on mount if username not set
  useEffect(() => {
    if (!isUserNameSet && userNameInputRef.current) {
      userNameInputRef.current.focus();
    } else if (isUserNameSet && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isUserNameSet]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !isConnected) return;

    const success = sendMessage(inputMessage);
    if (success) {
      setInputMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy room ID:', err);
    }
  };

  const toggleConnection = () => {
    if (isConnected) {
      // Disconnect functionality could be added here
      console.log('Disconnect requested');
    } else {
      reconnect();
    }
  };

  // If username is not set, show username prompt
  if (!isUserNameSet) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Join Room: {roomId}</h2>
          <form onSubmit={handleUserNameSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Enter your name
              </label>
              <input
                ref={userNameInputRef}
                id="username"
                type="text"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                placeholder="Your display name..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!tempUserName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
            >
              Join Chat
            </button>
          </form>
          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <h1 className="text-xl font-semibold">Room: {roomId}</h1>
          <button
            onClick={copyRoomId}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded"
            title="Copy Room ID"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleConnection}
            className="flex items-center space-x-2 hover:bg-gray-700 px-2 py-1 rounded transition-colors"
            title={isConnected ? 'Disconnect' : 'Connect'}
          >
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="bg-red-600 text-white p-3 rounded-lg text-center">
            <p className="text-sm">Connection Error: {error}</p>
            <button 
              onClick={reconnect}
              className="mt-2 bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-xs"
            >
              Retry Connection
            </button>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.messageType === 'system' 
                ? 'justify-center' 
                : message.isOwn 
                ? 'justify-end' 
                : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.messageType === 'system'
                  ? 'bg-yellow-600 text-white rounded-bl-none mx-auto'
                  : message.isOwn
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-white rounded-bl-none'
              }`}
            >
              {!message.isOwn && message.messageType !== 'system' && (
                <div className="text-xs text-gray-300 mb-1 font-medium">
                  {message.sender}
                </div>
              )}
              <div className="text-sm">{message.text}</div>
              <div className={`text-xs mt-1 ${
                message.isOwn ? 'text-blue-200' : 'text-gray-400'
              }`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form 
        onSubmit={handleSendMessage}
        className="bg-gray-800 border-t border-gray-700 p-4"
      >
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || !isConnected}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
          <span>Press Enter to send</span>
          <span>{userName}</span>
        </div>
      </form>
    </div>
  );
}