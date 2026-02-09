
import React from 'react';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] max-w-md w-full p-8 shadow-2xl animate-popIn">
        <div className="text-center">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✨
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Seja bem-vindo ao BabyStudio!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Crie fotos profissionais de mesversário em segundos. Mantemos o rostinho do seu bebê e transformamos tudo ao redor!
          </p>
          
          <ul className="text-left space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <span className="bg-blue-100 text-blue-500 w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
              <p className="text-sm text-gray-600">Envie uma foto clara e bem iluminada do bebê.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-pink-100 text-pink-500 w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
              <p className="text-sm text-gray-600">Escolha o mês e descreva o tema desejado.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-yellow-100 text-yellow-500 w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
              <p className="text-sm text-gray-600">Gere e baixe fotos inesquecíveis.</p>
            </li>
          </ul>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-pink-400 to-blue-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-pink-200 transition-all"
          >
            Começar a Criar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
