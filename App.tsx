
import React, { useState, useCallback, useRef } from 'react';
import { 
  Baby, 
  Sparkles, 
  ChevronRight, 
  Download, 
  RefreshCw, 
  History, 
  Image as ImageIcon,
  Heart,
  Camera,
  Layers,
  CheckCircle2,
  X,
  Maximize2,
  Wand2,
  Upload,
  Trash2,
  Search,
  AlertCircle,
  Video,
  PlayCircle,
  ExternalLink,
  ShieldCheck,
  Lock,
  Clock,
  CircleAlert
} from 'lucide-react';
import { GeneratorFormData, Gender, PhotoStyle, GeneratedImage } from './types';
import { GeminiService } from './services/geminiService';
import { POPULAR_THEMES, COLOR_OPTIONS, STYLE_DESCRIPTIONS } from './constants';

const WAITING_MESSAGES = [
  "Preparando as luzes mágicas...",
  "Capturando os melhores ângulos...",
  "Eternizando esse sorrisinho...",
  "Quase pronto para o show!",
  "Dando o brilho final no vídeo..."
];

const App: React.FC = () => {
  const [formData, setFormData] = useState<GeneratorFormData>({
    babyName: '',
    ageInMonths: 1,
    theme: '',
    gender: Gender.NEUTRAL,
    colorPalette: '',
    style: PhotoStyle.COZY
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [waitingMessageIdx, setWaitingMessageIdx] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const geminiService = new GeminiService();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'ageInMonths' ? parseInt(value) : value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem é muito grande. Escolha uma foto de até 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserPhoto(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleApiError = async (err: any) => {
    console.error("Gemini Error Handler:", err);
    let msg = err.message || "Ocorreu um erro inesperado.";

    // Quota Error (429)
    if (msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
      msg = "Limite de uso da API atingido. Aguarde cerca de 1 minuto ou verifique o saldo da sua chave no Google AI Studio.";
    } 
    // Key Issues
    else if (msg.includes("Requested entity was not found")) {
      msg = "Chave de API expirada ou inválida. Vamos selecionar novamente.";
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }
    // Content Refusal (Safety filters)
    else if (msg.length > 50) { 
       msg = "A IA recusou gerar esta imagem por políticas de segurança. Tente um tema mais simples ou remova a foto de referência.";
    }

    setError(msg);
  };

  const generateImage = async () => {
    if (!formData.theme) {
      setError("Por favor, escolha ou digite um tema para o mêsversário.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedVideoUrl(null);
    try {
      const result = await geminiService.generateMilestoneImage(formData, userPhoto || undefined);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: result.url,
        prompt: result.prompt,
        timestamp: Date.now()
      };
      setGeneratedImage(newImage);
      setHistory(prev => [newImage, ...prev]);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async () => {
    if (!generatedImage || !editPrompt) return;
    
    setIsEditing(true);
    setError(null);
    try {
      const newUrl = await geminiService.editImage(generatedImage.url, editPrompt);
      const updatedImage = { ...generatedImage, url: newUrl, timestamp: Date.now() };
      setGeneratedImage(updatedImage);
      setEditPrompt('');
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setIsEditing(false);
    }
  };

  const handleAnimate = async () => {
    if (!generatedImage) return;

    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }

    setIsAnimating(true);
    setError(null);
    setGeneratedVideoUrl(null);

    const msgInterval = setInterval(() => {
      setWaitingMessageIdx(prev => (prev + 1) % WAITING_MESSAGES.length);
    }, 8000);

    try {
      const videoUrl = await geminiService.generateVideo(
        generatedImage.url, 
        `Animate carefully.`,
        '9:16'
      );
      setGeneratedVideoUrl(videoUrl);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setIsAnimating(false);
      clearInterval(msgInterval);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage.url;
    link.download = `mesversario-${formData.babyName || 'bebe'}-${formData.ageInMonths}-meses.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadVideo = () => {
    if (!generatedVideoUrl) return;
    const link = document.createElement('a');
    link.href = generatedVideoUrl;
    link.download = `mesversario-animado.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen baby-gradient pb-20">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-pink-100 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-pink-400 p-2 rounded-xl text-white shadow-sm">
            <Baby size={24} />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Mêsversário IA</h1>
        </div>
        <button 
          onClick={() => { setGeneratedImage(null); setGeneratedVideoUrl(null); setError(null); }}
          className="text-pink-500 hover:bg-pink-50 p-2 rounded-full transition-colors"
        >
          <History size={20} />
        </button>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-8">
        {!generatedImage ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">Crie memórias mágicas</h2>
              <p className="text-gray-500 text-sm">Transforme cada mês em uma foto ou vídeo único.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-pink-50 p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Upload size={14} className="text-purple-500" /> Foto do seu bebê
                  </label>
                  {userPhoto && (
                    <span className="flex items-center gap-1 text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">
                      <ShieldCheck size={10} /> Consistência Ativa
                    </span>
                  )}
                </div>
                
                {!userPhoto ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-100 bg-purple-50/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 transition-colors group"
                  >
                    <div className="bg-white p-3 rounded-full text-purple-400 group-hover:scale-110 transition-transform shadow-sm mb-2">
                      <Camera size={24} />
                    </div>
                    <p className="text-sm text-purple-600 font-medium">Clique para escolher a foto</p>
                    <p className="text-xs text-purple-400 mt-1 italic">Dica: Use fotos bem iluminadas do rosto</p>
                  </div>
                ) : (
                  <div className="relative inline-block w-full">
                    <img 
                      src={userPhoto} 
                      alt="Sua foto" 
                      className="w-full h-48 object-cover rounded-2xl border-4 border-white shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/10 rounded-2xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 p-2 rounded-full text-green-600 flex items-center gap-2 text-xs font-bold shadow-sm">
                        <Lock size={14} /> Subject Consistency
                      </div>
                    </div>
                    <button 
                      onClick={() => setUserPhoto(null)}
                      className="absolute top-2 right-2 bg-white/90 text-red-500 p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Heart size={14} className="text-pink-400" /> Nome do Bebê
                  </label>
                  <input 
                    name="babyName"
                    value={formData.babyName}
                    onChange={handleInputChange}
                    placeholder="Ex: Alice"
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-200 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <Sparkles size={14} className="text-yellow-400" /> Idade (Meses)
                  </label>
                  <input 
                    type="number"
                    min="1"
                    max="12"
                    name="ageInMonths"
                    value={formData.ageInMonths}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-200 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <Layers size={14} className="text-blue-400" /> Tema Escolhido
                </label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    placeholder="Ursinho, Realeza, Jardim..."
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:bg-white focus:border-pink-200 outline-none shadow-sm transition-all"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_THEMES.map(theme => (
                    <button
                      key={theme}
                      onClick={() => setFormData(prev => ({ ...prev, theme }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        formData.theme === theme 
                        ? 'bg-pink-500 text-white shadow-md scale-105' 
                        : 'bg-white text-gray-600 border border-gray-100 hover:bg-pink-50'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Estilo</label>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.values(PhotoStyle).map(style => (
                      <button
                        key={style}
                        onClick={() => setFormData(prev => ({ ...prev, style }))}
                        className={`text-left p-3 rounded-xl border-2 transition-all ${
                          formData.style === style 
                          ? 'border-pink-500 bg-pink-50 shadow-sm' 
                          : 'border-transparent bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-bold text-sm text-gray-800">{style}</div>
                        <div className="text-[10px] text-gray-500 leading-tight">{STYLE_DESCRIPTIONS[style]}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-700">Paleta</label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map(color => (
                      <button
                        key={color.name}
                        title={color.name}
                        onClick={() => setFormData(prev => ({ ...prev, colorPalette: color.name }))}
                        className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-125 ${color.class} ${
                          formData.colorPalette === color.name ? 'ring-2 ring-pink-500 shadow-md scale-110' : 'border-transparent shadow-sm'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs flex gap-3 items-start border border-red-100 animate-in fade-in slide-in-from-top-2">
                  <CircleAlert size={18} className="shrink-0" />
                  <div className="space-y-1">
                     <p className="font-bold">Aviso:</p>
                     <p className="leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              <button 
                onClick={generateImage}
                disabled={isGenerating}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                {isGenerating ? 'Processando Imagem...' : 'Gerar Mêsversário Mágico'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between">
              <button onClick={() => { setGeneratedImage(null); setGeneratedVideoUrl(null); setError(null); }} className="text-gray-500 flex items-center gap-1 text-sm font-medium hover:text-pink-500 transition-colors">
                <ChevronRight size={18} className="rotate-180" /> Novo
              </button>
              <div className="flex gap-2">
                <button onClick={() => setShowFullImage(true)} className="bg-white text-gray-700 p-2 rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
                  <Maximize2 size={20} />
                </button>
                <button onClick={downloadImage} className="bg-pink-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 hover:bg-pink-600 transition-colors">
                  <Download size={18} /> Baixar
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-3 rounded-[2.5rem] shadow-2xl border border-pink-50 overflow-hidden min-h-[300px] flex items-center justify-center">
                {generatedVideoUrl ? (
                  <video 
                    src={generatedVideoUrl} 
                    controls 
                    autoPlay 
                    loop 
                    className="w-full rounded-[2rem] shadow-inner"
                  />
                ) : (
                  <img src={generatedImage.url} alt="Mêsversário" className="w-full aspect-square object-cover rounded-[2rem]" />
                )}
                
                {(isEditing || isAnimating) && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2.5rem] text-center p-6">
                    <RefreshCw className="animate-spin text-pink-500 mb-4" size={48} />
                    <p className="font-bold text-pink-600 text-lg px-4">
                      {isAnimating ? WAITING_MESSAGES[waitingMessageIdx] : 'Ajustando detalhes finais...'}
                    </p>
                    <div className="mt-4 flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-pink-100 shadow-sm">
                       <ShieldCheck className="text-green-500" size={14} />
                       <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Refining Scene</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                  <Wand2 size={18} className="text-purple-500" />
                  Ajuste Inteligente
                </div>
                {!generatedVideoUrl && (
                  <button 
                    onClick={handleAnimate}
                    disabled={isAnimating || isEditing}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100"
                  >
                    <Video size={14} /> Animando (Veo)
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <input 
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="Ex: 'Trocar cor do laço' ou 'Filtro vintage'"
                  className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
                />
                <button 
                  onClick={handleEdit}
                  disabled={isEditing || isAnimating || !editPrompt}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-200 text-white px-4 rounded-xl font-bold text-sm transition-all"
                >
                  {isEditing ? <RefreshCw className="animate-spin" size={18} /> : 'Ok'}
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-[10px] flex gap-2 items-center border border-red-100">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              {generatedVideoUrl && (
                <button 
                  onClick={downloadVideo}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg"
                >
                  <Download size={18} /> Baixar Vídeo Animado
                </button>
              )}
            </div>

            <button 
              onClick={generateImage}
              disabled={isGenerating || isAnimating || isEditing}
              className="w-full bg-white border-2 border-pink-200 text-pink-600 font-bold py-4 rounded-2xl hover:bg-pink-50 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw size={20} className={isGenerating ? 'animate-spin' : ''} />
              Tentar outra variação
            </button>
          </div>
        )}
      </main>

      {showFullImage && generatedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-pointer" onClick={() => setShowFullImage(false)}>
          <button className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors"><X size={32} /></button>
          {generatedVideoUrl ? (
            <video src={generatedVideoUrl} controls autoPlay loop className="max-w-full max-h-full rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} />
          ) : (
            <img src={generatedImage.url} alt="Full Screen" className="max-w-full max-h-full rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()} />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
