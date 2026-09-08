/**
 * Media del libro avventura.
 * In produzione sostituisci gli URL locali con link CDN (Cloudflare R2, Bunny, S3…).
 */
export const GAME = {
  title: 'Marea Nera',
  subtitle: 'Il patto di Tortuga',
} as const;

export const OPENING_VIDEO = {
  /** File locale in public/media — sostituire con URL cloud in prod se preferito */
  src: '/media/opening.mp4',
  /** Opzionale: poster statico; se assente si usa il primo fotogramma del video */
  poster: undefined as string | undefined,
} as const;
