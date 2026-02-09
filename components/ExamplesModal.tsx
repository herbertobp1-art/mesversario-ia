
import React from 'react';

interface ExamplesModalProps {
  onClose: () => void;
  onSelect: (theme: string) => void;
}

const CATEGORIES = [
  {
    title: "Fantasia",
    items: [
      { text: "Vestido de princesa em um castelo de nuvens", icon: "👑" },
      { text: "Pequeno astronauta flutuando entre planetas coloridos", icon: "🚀" },
      { text: "Fantasia de leãozinho em uma savana ensolarada", icon: "🦁" },
      { text: "Super-herói com capa voando sobre uma cidade de brinquedo", icon: "🦸" }
    ]
  },
  {
    title: "Temas Clássicos",
    items: [
      { text: "Pequeno chef com chapéu de mestre e massa de pizza", icon: "👨‍🍳" },
      { text: "Piloto de avião vintage com óculos e cachecol", icon: "🛩️" },
      { text: "Marinheiro em um barquinho de papel no mar azul", icon: "⛵" },
      { text: "Jardineiro cuidando de flores gigantes e coloridas", icon: "🌻" }
    ]
  },
  {
    title: "Datas Especiais",
    items: [
      { text: "Tema de Natal com gorro de Papai Noel e renas", icon: "🎄" },
      { text: "Páscoa com orelhinhas de coelho e ovos gigantes", icon: "🐰" },
      { text: "Pequeno cupido com asas e arco de flores", icon: "💘" },
      { text: "Festa de um ano com bolo e muitos balões", icon: "🎂" }
    ]
  }
];

const ExamplesModal: React.FC<ExamplesModalProps> = ({ onClose, onSelect }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-popIn">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-yellow-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">💡 Inspirações Mágicas</h2>
            <p className="text-xs text-gray-500">Toque em uma ideia para usá-la como tema</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <div key={cat.title}>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">{cat.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cat.items.map((item) => (
                  <button
                    key={item.text}
                    onClick={() => onSelect(item.text)}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-pink-50 hover:border-pink-100 border border-transparent transition-all text-left group"
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform">{item.icon}</span>
                    <span className="text-sm font-medium text-gray-700 leading-snug">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 italic">"Use sua imaginação! Você pode descrever qualquer coisa que desejar."</p>
        </div>
      </div>
    </div>
  );
};

export default ExamplesModal;
