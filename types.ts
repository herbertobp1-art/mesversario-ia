
export enum PhotoStyle {
  STUDIO = 'Estúdio Profissional',
  COSTUME = 'Fantasia de Personagem',
  RELIGIOUS = 'Tema Bíblico/Religioso',
  PARTY = 'Festa Infantil',
  NATURE = 'Natureza/Ar Livre',
  FREE = 'Livre'
}

export enum Quality {
  STANDARD = 'Padrão',
  HIGH = 'Alta (4K)'
}

export enum AspectRatio {
  PORTRAIT = '9:16',
  LANDSCAPE = '16:9',
  SQUARE = '1:1'
}

export interface GeneratedImage {
  id: string;
  url: string;
  timestamp: number;
  prompt: string;
  isFavorite: boolean;
}

export interface GenerationConfig {
  theme: string;
  month: string;
  customText?: string;
  style: PhotoStyle;
  numImages: number;
  quality: Quality;
  aspectRatio: AspectRatio;
}
