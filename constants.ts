
import { PhotoStyle } from './types';

export const MONTHS = Array.from({ length: 12 }, (_, i) => `Mês ${i + 1}`);

export const EXAMPLES = [
  "vestido de super-herói com capa azul",
  "pastorzinho com ovelha de pelúcia em um campo verde",
  "astronauta explorando o espaço com estrelas ao fundo",
  "pequeno chef de cozinha com chapéu e colher de pau",
  "fada encantada com asas brilhantes na floresta",
  "piloto de avião antigo com óculos e cachecol"
];

export const STYLE_PROMPTS: Record<PhotoStyle, string> = {
  [PhotoStyle.STUDIO]: "Neutral background, soft professional studio lighting, minimalist setup.",
  [PhotoStyle.COSTUME]: "Elaborate character costume, vibrant colors, cinematic lighting.",
  [PhotoStyle.RELIGIOUS]: "Biblical setting, warm golden lighting, peaceful atmosphere, ancient textures.",
  [PhotoStyle.PARTY]: "Birthday party decoration, balloons, confetti, festive bright colors.",
  [PhotoStyle.NATURE]: "Outdoor natural setting, sunny day, soft bokeh background, greenery.",
  [PhotoStyle.FREE]: ""
};

export const LOADING_MESSAGES = [
  "✨ Criando mágica...",
  "📸 Preparando o estúdio...",
  "🎨 Aplicando o tema...",
  "🍼 Deixando tudo fofo...",
  "⭐ Quase pronto!",
  "💎 Lapidando detalhes..."
];
