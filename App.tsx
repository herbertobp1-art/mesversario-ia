
import React, { useState, useEffect } from 'react';
import { 
  PhotoStyle, 
  Quality, 
  AspectRatio, 
  GeneratedImage, 
  GenerationConfig 
} from './types';
import { MONTHS, EXAMPLES, LOADING_MESSAGES } from './constants';
import { GeminiService } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import SettingsForm from './components/SettingsForm';
import ResultGallery from './components/ResultGallery';
import LoadingOverlay from './components/LoadingOverlay';
import Tutorial from './components/Tutorial';
import ExamplesModal from './components/ExamplesModal';

const App: React.FC = () => {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generationCount, setGenerationCount] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState<GenerationConfig>({
    theme: '',
    month: MONTHS[0],
    customText: '',
    style: PhotoStyle.STUDIO,
    numImages: 1,
    quality: Quality.STANDARD,
    aspectRatio: AspectRatio.SQUARE
  });

  useEffect(() => {
    const savedImages = localStorage.getItem('mesversario_history');
    if (savedImages) {
      setGeneratedImages(JSON.parse(savedImages));
    }
    const tutorialSeen = localStorage.getItem('mesversario_tutorial_seen');
    if (tutorialSeen) {
      setShowTutorial(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mesversario_history', JSON.stringify(generatedImages.slice(0, 10)));
  }, [generatedImages]);

  const handleGenerate = async () => {
    if (!baseImage) return;
    if (generationCount >= 10) {
      setError("Você atingiu o limite de 10 gerações por sessão. Recarregue a página para continuar.");
      return;
    }

    // High Quality check for API Key as per Veo/Imagen rules
    if (config.quality === Quality.HIGH) {
      const hasKey = await (window as any).aistudio?.hasSelectedApiKey?.();
      if (!hasKey) {
        await (window as any).aistudio?.openSelectKey?.();
        // Proceeding assuming success as per race condition rules
      }
    }

    setLoading(true);
    setError(null);
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIndex]);
    }, 3000);

    try {
      const base64Data = baseImage.split(',')[1];
      
      // Optional: Validation
      const validation = await GeminiService.validateBabyPhoto(base64Data);
      if (!validation.isBaby) {
        setError("A foto enviada não parece ser de um bebê. Por favor, envie uma foto mais clara.");
        setLoading(false);
        clearInterval(interval);
        return;
      }

      const urls = await GeminiService.generatePhotos(base64Data, config);
      
      const newImages: GeneratedImage[] = urls.map(url => ({
        id: Math.random().toString(36).substr(2, 9),
        url,
        timestamp: Date.now(),
        prompt: config.theme || config.style,
        isFavorite: false
      }));

      setGeneratedImages(prev => [...newImages, ...prev]);
      setGenerationCount(prev => prev + 1);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
         setError("Erro na chave de API. Por favor, selecione uma chave de um projeto com faturamento ativo.");
         await (window as any).aistudio?.openSelectKey?.();
      } else {
         setError("Ops! Algo deu errado ao gerar suas fotos. Tente usar um tema mais simples ou verifique sua conexão.");
      }
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setGeneratedImages(prev => prev.map(img => 
      img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
    ));
  };

  const handleRegenerate = (prompt: string) => {
    setConfig(prev => ({ ...prev, theme: prompt }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-pink-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <button 
              onClick={() => setShowExamples(true)}
              className="bg-yellow-100 text-yellow-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-yellow-200 transition-colors flex items-center gap-1 shadow-sm"
            >
              💡 Ver Exemplos
            </button>
          </div>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="text-pink-400">📷</span> 1. Foto de Referência
            </h2>
            <ImageUploader 
              onImageUpload={setBaseImage} 
              currentImage={baseImage}
            />
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-blue-400">✨</span> 2. Estúdio e Tema
            </h2>
            <SettingsForm 
              config={config} 
              setConfig={setConfig} 
              disabled={loading}
            />
          </section>

          <div className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100 animate-fadeIn">
                <p className="font-medium">{error}</p>
                <button 
                  onClick={handleGenerate}
                  className="mt-2 text-sm font-bold underline hover:text-red-800"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!baseImage || loading || generationCount >= 10}
              className={`w-full py-5 rounded-2xl text-xl font-bold shadow-lg transition-all transform hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3 ${
                !baseImage || loading || generationCount >= 10
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-400 to-blue-400 text-white hover:shadow-pink-200'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {loadingMsg}
                </>
              ) : (
                <>🎨 Gerar Fotos de Mesversário</>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 font-medium">
              Gerações nesta sessão: <span className={generationCount >= 8 ? 'text-red-400' : 'text-blue-400'}>{generationCount}/10</span>
            </p>
          </div>
        </div>

        {generatedImages.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-2">
              Sua Galeria Mágica <span className="text-2xl">🎠</span>
            </h2>
            <ResultGallery 
              images={generatedImages} 
              onToggleFavorite={handleToggleFavorite}
              onRegenerate={handleRegenerate}
              baseImage={baseImage}
            />
          </section>
        )}

        <section className="mt-20 border-t border-gray-100 pt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Dúvidas Frequentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
              <h3 className="font-bold text-pink-500 mb-2">Como ter o melhor resultado?</h3>
              <p className="text-sm text-gray-500">Use fotos do bebê de frente, com boa iluminação e sem chupeta ou objetos cobrindo o rosto.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
              <h3 className="font-bold text-blue-500 mb-2">As fotos são reais?</h3>
              <p className="text-sm text-gray-500">Não, são criações de Inteligência Artificial que preservam os traços do seu bebê em cenários digitais.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
              <h3 className="font-bold text-yellow-500 mb-2">Privacidade e Segurança</h3>
              <p className="text-sm text-gray-500">Não armazenamos suas fotos. Todo o processamento é feito para gerar a imagem e descartado em seguida.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
              <h3 className="font-bold text-green-500 mb-2">Posso usar comercialmente?</h3>
              <p className="text-sm text-gray-500">Este app é para uso pessoal e recordação familiar. Lembre-se do uso ético de imagens geradas por IA.</p>
            </div>
          </div>
        </section>
      </main>

      {loading && <LoadingOverlay message={loadingMsg} />}
      {showTutorial && <Tutorial onClose={() => { setShowTutorial(false); localStorage.setItem('mesversario_tutorial_seen', 'true'); }} />}
      {showExamples && <ExamplesModal onClose={() => setShowExamples(false)} onSelect={(t) => { setConfig({...config, theme: t}); setShowExamples(false); }} />}

      <footer className="mt-16 text-center text-gray-400 pb-12 px-4 border-t border-gray-50 pt-8">
        <p className="font-medium">© 2024 Gerador de Mesversário IA</p>
        <p className="text-xs mt-2 max-w-lg mx-auto leading-relaxed">
          Desenvolvido para criar memórias inesquecíveis. Tecnologia Imagen 3 & Veo do Google. 
          Certifique-se de ter permissão para usar as fotos enviadas.
        </p>
      </footer>
    </div>
  );
};

export default App;
