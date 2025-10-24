import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  
  const handleCreateRoom = () => {
    navigate('/newchat');
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      navigate(`/room/${roomCode.trim()}`);
    }
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
            <h2 className="font-bold text-5xl mb-2 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome
            </h2>
            <h3 className="text-white font-semibold text-2xl mb-4">
              to <span className="text-purple-400">Roomify</span>
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Connect instantly in private rooms with seamless communication
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-4 mb-6">
            <button onClick={handleCreateRoom} className="w-full bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer">
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Room
              </span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-400">or</span>
              </div>
            </div>
          </div>

          {/* Join room section */}
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter Room Code"
                className="w-full bg-white/5 border border-gray-600 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 16H9v4H5v-4H3a2 2 0 01-2-2v-4a2 2 0 012-2h2.586l4.707-4.707A6 6 0 0115 7z" />
                </svg>
              </div>
            </div>

            <button 
              type="submit"
              disabled={!roomCode.trim()}
              className="w-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed border border-gray-600 hover:border-gray-500 disabled:border-gray-700 text-white disabled:text-gray-500 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none backdrop-blur-sm cursor-pointer"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Join Room
              </span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Secure • Fast • Reliable
          </p>
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
