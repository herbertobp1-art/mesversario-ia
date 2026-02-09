
export enum Gender {
  MALE = 'Masculino',
  FEMALE = 'Feminino',
  NEUTRAL = 'Neutro'
}

export enum PhotoStyle {
  STUDIO = 'Estúdio Fotográfico',
  MINIMALIST = 'Minimalista',
  COZY = 'Aconchegante',
  LUXURY = 'Luxo Delicado'
}

export interface GeneratorFormData {
  babyName: string;
  ageInMonths: number;
  theme: string;
  gender: Gender;
  colorPalette: string;
  style: PhotoStyle;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
  id: string;
}
