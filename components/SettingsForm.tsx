
import React, { useState } from 'react';
import { GenerationConfig, PhotoStyle, AspectRatio, Quality } from '../types';
import { MONTHS, EXAMPLES } from '../constants';

interface SettingsFormProps {
  config: GenerationConfig;
  setConfig: React.Dispatch<React.SetStateAction<GenerationConfig>>;
  disabled: boolean;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ config, setConfig, disabled }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">📅 Selecionar Mês</label>
          <select 
            value={config.month}
            onChange={(e) => setConfig({ ...config, month: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
          >
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">🏷️ Texto na Imagem (Opcional)</label>
          <input 
            type="text"
            placeholder="Ex: 6 meses de amor"
            value={config.customText}
            onChange={(e) => setConfig({ ...config, customText: e.target.value })}
            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-600 mb-1">🎨 Estilo do Ensaio</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.values(PhotoStyle).map(style => (
            <button
              key={style}
              onClick={() => setConfig({ ...config, style })}
              className={`p-3 rounded-xl text-xs font-bold transition-all border ${
                config.style === style 
                ? 'bg-pink-100 border-pink-200 text-pink-600 shadow-sm' 
                : 'bg-white border-gray-100 text-gray-500 hover:border-pink-100'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-bold text-gray-600">💭 Descreva o Tema</label>
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
            {config.theme.length}/500
          </span>
        </div>
        <textarea 
          placeholder="✨ Ex: Vestido de fada em uma floresta mágica com flores gigantes..."
          maxLength={500}
          rows={3}
          value={config.theme}
          onChange={(e) => setConfig({ ...config, theme: e.target.value })}
          className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-pink-200 outline-none transition-all resize-none"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {EXAMPLES.slice(0, 3).map(ex => (
            <button 
              key={ex}
              onClick={() => setConfig({ ...config, theme: ex })}
              className="text-[10px] bg-blue-50 text-blue-500 px-2 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              + {ex.split(' ').slice(0, 3).join(' ')}...
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm font-bold text-gray-400 flex items-center gap-1 hover:text-pink-400 transition-colors"
        >
          {showAdvanced ? '🔼 Esconder Configurações Avançadas' : '🔽 Configurações Avançadas'}
        </button>

        {showAdvanced && (
          <div className="mt-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Qualidade</label>
              <div className="flex gap-2">
                {Object.values(Quality).map(q => (
                  <button
                    key={q}
                    onClick={() => setConfig({ ...config, quality: q })}
                    className={`flex-1 p-2 rounded-lg text-xs font-bold border transition-all ${
                      config.quality === q ? 'bg-white border-pink-400 text-pink-600 shadow-sm' : 'bg-transparent border-gray-200 text-gray-400'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Formato</label>
              <div className="flex gap-2">
                {Object.entries(AspectRatio).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setConfig({ ...config, aspectRatio: value })}
                    className={`flex-1 p-2 rounded-lg text-xs font-bold border transition-all ${
                      config.aspectRatio === value ? 'bg-white border-blue-400 text-blue-600 shadow-sm' : 'bg-transparent border-gray-200 text-gray-400'
                    }`}
                  >
                    {key === 'PORTRAIT' ? '📱' : key === 'LANDSCAPE' ? '🖥️' : '⬜'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Quantidade</label>
              <input 
                type="range"
                min="1"
                max="4"
                step="1"
                value={config.numImages}
                onChange={(e) => setConfig({ ...config, numImages: parseInt(e.target.value) })}
                className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-400"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-bold">
                <span>1 Foto</span>
                <span>4 Fotos</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsForm;
