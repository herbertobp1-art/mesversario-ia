
import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
      <div className="relative">
        <div className="w-32 h-32 border-8 border-pink-100 border-t-pink-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl">
          🍼
        </div>
      </div>
      <h2 className="mt-8 text-2xl font-bold text-gray-800 animate-pulse">
        {message}
      </h2>
      <p className="mt-2 text-gray-400 max-w-xs">
        Estamos trabalhando nos detalhes para que seu bebê fique perfeito em cada cenário.
      </p>
      
      <div className="mt-12 flex gap-2">
        <div className="w-2 h-2 bg-pink-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
