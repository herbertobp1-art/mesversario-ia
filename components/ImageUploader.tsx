
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (base64: string) => void;
  currentImage: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, currentImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      
      {currentImage ? (
        <div className="relative group w-full aspect-video sm:aspect-[21/9] rounded-2xl overflow-hidden border-2 border-dashed border-pink-200">
          <img 
            src={currentImage} 
            alt="Referência" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-gray-800 px-4 py-2 rounded-full font-bold hover:bg-pink-50 transition-colors"
            >
              Alterar Foto
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-video sm:aspect-[21/9] rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/30 flex flex-col items-center justify-center gap-3 hover:bg-pink-50 transition-all group"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
            📸
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-700">Clique para enviar a foto</p>
            <p className="text-xs text-gray-400 px-4">JPG, PNG ou WebP (Máx 10MB)</p>
          </div>
        </button>
      )}
      
      <p className="mt-3 text-xs text-gray-400 flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Envie uma foto clara e frontal do seu bebê para melhores resultados.
      </p>
    </div>
  );
};

export default ImageUploader;
