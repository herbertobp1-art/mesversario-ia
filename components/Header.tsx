
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-pink-50 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-2xl">
          👶
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
            BabyStudio AI
          </h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Mesversários Mágicos
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => window.location.reload()}
        className="text-gray-400 hover:text-pink-400 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </header>
  );
};

export default Header;
