
import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { GeminiService } from '../services/geminiService';

interface ResultGalleryProps {
  images: GeneratedImage[];
  onToggleFavorite: (id: string) => void;
  onRegenerate: (prompt: string) => void;
  baseImage: string | null;
}

const ResultGallery: React.FC<ResultGalleryProps> = ({ images, onToggleFavorite, onRegenerate, baseImage }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleDownload = async (url: string, id: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `baby-studio-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    images.forEach((img, index) => {
      setTimeout(() => {
        handleDownload(img.url, img.id);
      }, index * 500);
    });
  };

  const handleAnimate = async (image: GeneratedImage) => {
    if (!window.confirm("Deseja gerar um vídeo curto desta foto? (Requer chave Veo selecionada no painel)")) return;
    
    const hasKey = await (window as any).aistudio?.hasSelectedApiKey?.();
    if (!hasKey) {
      await (window as any).aistudio?.openSelectKey?.();
    }

    setLoadingAction(`video-${image.id}`);
    try {
      const base64 = image.url.split(',')[1];
      const url = await GeminiService.generateVideo(base64, image.prompt, "9:16");
      setVideoUrl(url);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        alert("Sua chave de API não tem permissão para o modelo de vídeo (Veo). Use uma chave vinculada a um projeto com faturamento.");
        await (window as any).aistudio?.openSelectKey?.();
      } else {
        alert("Falha ao gerar o vídeo. Tente novamente em alguns minutos.");
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const handleShare = async (img: GeneratedImage) => {
    try {
      const response = await fetch(img.url);
      const blob = await response.blob();
      const file = new File([blob], 'mesversario.png', { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Olha que fofura!',
          text: 'Criei essa foto de mesversário no BabyStudio AI!',
        });
      } else {
        alert("Compartilhamento não suportado neste navegador. Baixe a imagem para compartilhar.");
      }
    } catch (err) {
      console.error("Erro ao compartilhar:", err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center px-2">
        <p className="text-sm text-gray-400 font-medium">{images.length} fotos criadas</p>
        <button 
          onClick={handleDownloadAll}
          className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
        >
          📁 Baixar Todas
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {images.map((img) => (
          <div key={img.id} className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col">
            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
              <img 
                src={img.url} 
                alt="Gerada" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <button 
                  onClick={() => onToggleFavorite(img.id)}
                  className={`p-3 rounded-full shadow-lg transition-all hover:scale-110 active:scale-90 ${img.isFavorite ? 'bg-pink-400 text-white' : 'bg-white/90 backdrop-blur-md text-gray-400'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={img.isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button 
                  onClick={() => handleShare(img)}
                  className="bg-white/90 backdrop-blur-md text-gray-600 p-3 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6a3 3 0 100-2.684m0 2.684l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-wrap gap-2 items-center">
                <button 
                  onClick={() => handleDownload(img.url, img.id)}
                  className="bg-white text-gray-800 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 hover:bg-pink-50 transition-colors shadow-lg"
                >
                  ⬇️ Baixar
                </button>
                <button 
                  onClick={() => handleAnimate(img)}
                  disabled={!!loadingAction}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
                    loadingAction === `video-${img.id}` 
                      ? 'bg-blue-400 text-white cursor-wait' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {loadingAction === `video-${img.id}` ? (
                    <><svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Criando...</>
                  ) : '🎬 Animado'}
                </button>
                <button 
                  onClick={() => onRegenerate(img.prompt)}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-2xl text-xs font-bold hover:bg-white/20 transition-colors"
                >
                  🔄 Regerar
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-gray-50 bg-white">
              <p className="text-sm text-gray-700 font-medium leading-relaxed italic">"{img.prompt}"</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                  {new Date(img.timestamp).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                </span>
                <div className="flex -space-x-1">
                  <div className="w-5 h-5 rounded-full bg-pink-100 border border-white flex items-center justify-center text-[8px]">✨</div>
                  <div className="w-5 h-5 rounded-full bg-blue-100 border border-white flex items-center justify-center text-[8px]">📸</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {videoUrl && (
        <div className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          <div className="max-w-md w-full bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col relative animate-popIn">
            <button 
              onClick={() => setVideoUrl(null)} 
              className="absolute top-6 right-6 z-10 bg-black/10 hover:bg-black/20 p-2 rounded-full text-gray-800 transition-colors backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-[9/16] bg-black relative flex items-center justify-center">
              <video src={videoUrl} controls autoPlay loop className="max-h-full max-w-full" />
            </div>
            <div className="p-8 text-center bg-white border-t border-gray-50">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Momento Vivo 🌟</h3>
              <p className="text-xs text-gray-400 mb-6 px-4">O vídeo está pronto para ser guardado no seu celular ou computador.</p>
              <a 
                href={videoUrl} 
                download="mesversario-magico.mp4"
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-3xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
              >
                <span>💾 Salvar Vídeo</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultGallery;
