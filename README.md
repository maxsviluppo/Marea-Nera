# Marea Nera — Il patto di Tortuga

Libro avventura interattivo **9:16** per smartphone.

## Stack

**Vite + React + TypeScript** — ideale per media fullscreen, PWA e deploy statico.

## Avvio

```bash
npm install
npm run dev
```

Apri [http://localhost:3300](http://localhost:3300)

## Video

Il video di apertura va in `public/media/opening.mp4`.

Per copiarlo dalla cartella originale:

```powershell
Copy-Item "C:\Users\Max\Downloads\Video libro Marea Nera\Marea_nera_Generiamo_copertin.mp4" "public\media\opening.mp4"
```

## Cloud vs locale

| Fase | Consiglio |
|------|-----------|
| **Sviluppo** | File in `public/media/` |
| **Produzione** | CDN (Cloudflare R2, Bunny, S3) — aggiorna `src/config/media.ts` con URL assoluti |

I video pesanti non vanno in git: usa `.gitignore` e link cloud in prod.

## Flusso attuale

1. Schermata copertina — primo fotogramma del video a pieno schermo
2. Pulsante **Inizio** 3D (font piratesco)
3. Riproduzione video senza controlli nativi
4. Stop sull’ultimo fotogramma — punto di partenza del gioco
