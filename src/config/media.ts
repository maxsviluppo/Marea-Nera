/**
 * Media del libro avventura.
 * In produzione sostituisci gli URL locali con link CDN (Cloudflare R2, Bunny, S3…).
 */
export const GAME = {
  title: 'Marea Nera',
  subtitle: 'Il patto di Tortuga',
} as const;

export const OPENING_VIDEO = {
  src: '/media/opening.mp4',
  poster: '/media/opening-poster.png',
} as const;

export const SCENE_1_VIDEO = {
  id: 'scene-1-esamina',
  title: 'Capitolo 1 — Esamina',
  subtitle: 'La lettera sigillata e la lama d’argento',
  src: '/media/video1.mp4',
  poster: '/media/retrocard.jpg',
} as const;

export const SCENE_2_VIDEO = {
  id: 'scene-2-video',
  title: 'Capitolo 2 — La Scelta',
  src: '/media/video2.mp4',
  cardImage: '/media/card2.png',
} as const;

