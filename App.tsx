import React, { useState, useRef } from 'react';
import {
  Baby,
  Sparkles,
  ChevronRight,
  Download,
  RefreshCw,
  History,
  Camera,
  Layers,
  Heart,
  Trash2,
  Search,
  AlertCircle,
  Maximize2,
  X,
  CircleAlert
} from 'lucide-react';

import { GeneratorFormData, Gender, PhotoStyle, GeneratedImage } from './types';
import { gerarImagemHuggingFace } from './services/huggingfaceService';
import { POPULAR_THEMES, COLOR_OPTIONS, STYLE_DESCRIPTIONS } from './constants';

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ageInMonths' ? Number(value) : value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem é muito grande. Máx. 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setUserPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const generateImage = async () => {
    if (!formData.theme) {
      setError("Escolha um tema para o mêsversário.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const prompt = `
      Foto profissional de mêsversário de bebê.
      Nome: ${formData.babyName || "bebê"}
      Idade: ${formData.ageInMonths} meses
      Tema: ${formData.theme}
      Estilo: ${formData.style}
      Paleta de cores: ${formData.colorPalette || "tons suaves"}
      Iluminação suave, fundo delicado, alta qualidade, fotografia realista.
      `;

      const result = await gerarImagemHuggingFace(prompt);

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: result.image,
        prompt,
        timestamp: Date.now()
      };

      setGeneratedImage(newImage);
      setHistory(prev => [newImage, ...prev]);

    } catch (err) {
      console.error(err);
      setError("Erro ao gerar imagem com a IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage.url;
    link.download = `mesversario-${formData.ageInMonths}-meses.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen baby-gradient pb-20">
      <header className="bg-white sticky top-0 z-40 border-b px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-pink-400 p-2 rounded-xl text-white">
            <Baby size={24} />
          </div>
          <h1 className="font-bold text-xl">Mêsversário IA</h1>
        </div>
        <button
          onClick={() => setGeneratedImage(null)}
          className="text-pink-500 p-2 rounded-full hover:bg-pink-50"
        >
          <History size={20} />
        </button>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-8">
        {!generatedImage ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold">Crie memórias mágicas</h2>
              <p className="text-gray-500 text-sm">Fotos de mêsversário com IA</p>
            </div>

            <div className="bg-white rounded-3xl shadow p-6 space-y-6">

              {/* Upload */}
              <div>
                {!userPhoto ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-dashed border-2 p-6 rounded-xl text-center cursor-pointer"
                  >
                    <Camera size={32} className="mx-auto text-pink-400" />
                    <p className="text-sm mt-2">Clique para escolher a foto</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img src={userPhoto} className="rounded-xl w-full h-48 object-cover" />
                    <button
                      onClick={() => setUserPhoto(null)}
                      className="absolute top-2 right-2 bg-white p-2 rounded-full text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} hidden />
              </div>

              {/* Inputs */}
              <input
                name="babyName"
                value={formData.babyName}
                onChange={handleInputChange}
                placeholder="Nome do bebê"
                className="w-full p-3 bg-gray-50 rounded-xl"
              />

              <input
                type="number"
                name="ageInMonths"
                min={1}
                max={12}
                value={formData.ageInMonths}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-50 rounded-xl"
              />

              <div className="relative">
                <Search className="absolute left-4 top-4 text-gray-400" />
                <input
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  placeholder="Tema do mêsversário"
                  className="w-full pl-12 p-4 bg-gray-50 rounded-xl"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {POPULAR_THEMES.map(theme => (
                  <button
                    key={theme}
                    onClick={() => setFormData(prev => ({ ...prev, theme }))}
                    className="px-3 py-1 bg-pink-50 rounded-full text-xs"
                  >
                    {theme}
                  </button>
                ))}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl flex gap-2">
                  <CircleAlert size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                onClick={generateImage}
                disabled={isGenerating}
                className="w-full bg-pink-500 text-white py-4 rounded-xl font-bold flex justify-center gap-2"
              >
                {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                Gerar imagem
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button onClick={() => setGeneratedImage(null)} className="flex items-center gap-1 text-sm">
              <ChevronRight className="rotate-180" /> Novo
            </button>

            <div className="bg-white p-3 rounded-3xl shadow">
              <img
                src={generatedImage.url}
                className="rounded-2xl w-full cursor-pointer"
                onClick={() => setShowFullImage(true)}
              />
            </div>

            <button
              onClick={downloadImage}
              className="w-full bg-pink-500 text-white py-3 rounded-xl flex justify-center gap-2"
            >
              <Download /> Baixar imagem
            </button>
          </div>
        )}
      </main>

      {showFullImage && generatedImage && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <button
            className="absolute top-6 right-6 text-white"
            onClick={() => setShowFullImage(false)}
          >
            <X size={32} />
          </button>
          <img src={generatedImage.url} className="max-w-full max-h-full rounded-xl" />
        </div>
      )}
    </div>
  );
};

export default App;
