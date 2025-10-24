import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useNavigate } from 'react-router-dom';

export default function NewChat() {
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showRoomCode, setShowRoomCode] = useState(false);
  const navigate = useNavigate();

  // Handle navigation back to default page
  const handleBackToHome = () => {
    navigate('/');
  };

  // Generate a random room code
  function generateRoomCode(length = 7) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // Handle creating a new room
  const handleCreateRoom = () => {
    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);
    setShowRoomCode(true);
  };

  // Handle entering the created room
  const handleEnterRoom = () => {
    if (roomCode) {
      navigate(`/room/${roomCode}`);
    }
  };

  // Handle copying room code
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header with logo */}
      <div className="absolute top-0 w-full">
        <div className="flex justify-between items-center p-6">
          <h1 className="text-white text-3xl font-bold tracking-wide">
            <span className="text-blue-400">Room</span>
            <span className="text-purple-400">ify</span>
          </h1>
          <div className="flex space-x-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping animation-delay-1000"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-2000"></div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-md w-full mx-4">
        {/* Welcome card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Welcome text */}
          <div className="text-center mb-8">
            <h2 className="font-bold text-4xl mb-2 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {showRoomCode ? 'Room Created!' : 'Create a New Room'}
            </h2>
            <p className="text-gray-300 text-sm">
              {showRoomCode ? 'Share this code with your friends' : 'Generate a unique room code to start chatting'}
            </p>
          </div>

          {!showRoomCode ? (
            // Create room section
            <div className="space-y-6">
              {/* Create new room button */}
              <button 
                onClick={handleCreateRoom}
                className="w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Generate a room code
                </span>
              </button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Click the button above to generate a unique room code for your chat session
                </p>
              </div>
            </div>
          ) : (
            // Room code display section
            <div className="space-y-6">
              {/* Room code display */}
              <div className="bg-white/5 border border-gray-600 rounded-xl p-6 text-center">
                <p className="text-gray-300 text-sm mb-2">Room Code</p>
                <div className="text-3xl font-mono font-bold tracking-wider mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {roomCode}
                </div>
                
                {/* Copy button */}
                <CopyToClipboard text={roomCode} onCopy={handleCopy}>
                  <button className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                </CopyToClipboard>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleEnterRoom}
                  className="w-full bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Enter Room
                  </span>
                </button>
                
                <button 
                  onClick={() => setShowRoomCode(false)}
                  className="w-full bg-white/10 hover:bg-white/20 border border-gray-600 hover:border-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm cursor-pointer"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Another Room
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Secure • Fast • Reliable
          </p>
        </div>

        {/* Back to Home button */}
        <div className="text-center mt-6">
          <button 
            onClick={handleBackToHome}
            className="inline-flex items-center px-6 py-2 bg-gray-600/30 hover:bg-gray-600/50 border border-gray-500/50 text-gray-300 hover:text-white rounded-lg transition-all duration-300 backdrop-blur-sm cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping animation-delay-3000"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-5000"></div>
      </div>
    </div>
  );
}