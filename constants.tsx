
import React from 'react';
import { Baby, Star, Camera, Palette, Heart, Sparkles } from 'lucide-react';
import { PhotoStyle } from './types';

export const POPULAR_THEMES = [
  'Safari Baby',
  'Ursinho Pooh',
  'Stitch',
  'Princesa Disney',
  'Pequeno Príncipe',
  'Dinossauro Baby',
  'Balões e Nuvens',
  'Astronauta',
  'Mickey/Minnie',
  'Jardim Encantado',
  'Fundo do Mar',
  'Super Heróis Baby'
];

export const STYLE_DESCRIPTIONS: Record<PhotoStyle, string> = {
  [PhotoStyle.STUDIO]: 'Iluminação profissional, fundo infinito, alta nitidez.',
  [PhotoStyle.MINIMALIST]: 'Poucos elementos, foco total no bebê, cores sóbrias.',
  [PhotoStyle.COZY]: 'Texturas macias, luz natural, ambiente doméstico acolhedor.',
  [PhotoStyle.LUXURY]: 'Detalhes dourados, tecidos finos, elegância clássica.'
};

export const COLOR_OPTIONS = [
  { name: 'Azul Bebê', class: 'bg-blue-100' },
  { name: 'Rosa Pastel', class: 'bg-pink-100' },
  { name: 'Amarelo Suave', class: 'bg-yellow-100' },
  { name: 'Verde Água', class: 'bg-emerald-100' },
  { name: 'Bege/Creme', class: 'bg-orange-50' },
  { name: 'Cinza Moderno', class: 'bg-gray-100' },
  { name: 'Multicolorido', class: 'bg-gradient-to-r from-pink-200 via-blue-200 to-yellow-200' }
];
