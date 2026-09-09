import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { SCENE_1_VIDEO, SCENE_2_VIDEO } from '../config/media';
import { type ChoiceHotspot } from '../config/sceneCard1';
import InteractiveCard2 from './InteractiveCard2';
import { GameAudioOnIcon, GameAudioOffIcon, GameSkipIcon } from './GameIcons';
import './SceneVideoPage.css';

type Phase = 'video1_playing' | 'video1_ended' | 'video2_playing' | 'card2';

type SceneVideoPageProps = {
  onBack: () => void;
  onChoiceCard2?: (choice: ChoiceHotspot) => void;
};

function configureVideoForIOS(video: HTMLVideoElement) {
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', 'true');
  video.setAttribute('x-webkit-airplay', 'deny');
  video.playsInline = true;
}

export default function SceneVideoPage({ onBack, onChoiceCard2 }: SceneVideoPageProps) {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const lastFrame1Ref = useRef(0);

  const [phase, setPhase] = useState<Phase>('video1_playing');
  const [isMuted, setIsMuted] = useState(false);

  // Inizializzazione video1 al montaggio
  useEffect(() => {
    const v1 = video1Ref.current;
    if (!v1) return;

    configureVideoForIOS(v1);

    const startV1 = async () => {
      try {
        v1.muted = false;
        await v1.play();
        setIsMuted(false);
      } catch {
        // Fallback Safari iOS (es. Silent switch attivo)
        try {
          v1.muted = true;
          await v1.play();
          setIsMuted(true);
        } catch (err) {
          console.warn('Avvio video1 in attesa di tocco utente:', err);
        }
      }
    };

    void startV1();
  }, []);

  // Pre-configurazione video2
  useEffect(() => {
    const v2 = video2Ref.current;
    if (!v2) return;
    configureVideoForIOS(v2);
  }, []);

  // Fine video1 -> freeze ultimo fotogramma e mostra 'Premi per continuare'
  const handleVideo1Ended = () => {
    const v1 = video1Ref.current;
    if (v1 && v1.duration && Number.isFinite(v1.duration)) {
      const t = Math.max(0, v1.duration - 0.04);
      v1.pause();
      v1.currentTime = t;
      lastFrame1Ref.current = t;
    }
    setPhase('video1_ended');
  };

  // Pressione della card -> avvia video2.mp4
  const handleStartVideo2 = async () => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (v1) v1.pause();
    if (!v2) return;

    configureVideoForIOS(v2);
    setPhase('video2_playing');

    v2.currentTime = 0;
    v2.muted = isMuted;

    try {
      await v2.play();
    } catch {
      try {
        v2.muted = true;
        await v2.play();
        setIsMuted(true);
      } catch (err) {
        console.error('Errore avvio video2:', err);
      }
    }
  };

  // Fine video2 -> flip card e mostra card2.jpg (e stoppa/nasconde video)
  const handleVideo2Ended = () => {
    const v1 = video1Ref.current;
    const v2 = video2Ref.current;
    if (v1) v1.pause();
    if (v2) v2.pause();
    setPhase('card2');
  };

  // Toggle audio circolare in basso a sinistra (icona di gioco SVG)
  const handleToggleAudio = (e: MouseEvent) => {
    e.stopPropagation();
    const activeVideo = phase === 'video2_playing' ? video2Ref.current : video1Ref.current;
    if (!activeVideo) return;

    const nextMuted = !activeVideo.muted;
    activeVideo.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Salta video circolare in basso a destra (icona di gioco SVG)
  const handleSkipCurrent = (e: MouseEvent) => {
    e.stopPropagation();
    if (phase === 'video1_playing') {
      handleVideo1Ended();
    } else if (phase === 'video2_playing') {
      handleVideo2Ended();
    }
  };

  const isFlipped = phase === 'card2';
  const isVideoActive = phase === 'video1_playing' || phase === 'video2_playing';

  return (
    <section className="scene-page" aria-label="Marea Nera — Scena del Libro">
      <div className="scene-page__frame">
        {/* Top Header */}
        <header className="scene-page__header">
          <button
            type="button"
            className="scene-page__back-btn"
            onClick={onBack}
            aria-label="Torna al libro principale"
          >
            ← Libro
          </button>
        </header>

        {/* Icone circolari semi-trasparenti: Audio (basso a sx) e Skip (basso a dx) con SVG di gioco */}
        {isVideoActive && (
          <>
            <button
              type="button"
              className="video-circle-btn video-circle-btn--audio"
              onClick={handleToggleAudio}
              aria-label={isMuted ? 'Attiva audio' : 'Disattiva audio'}
            >
              {isMuted ? <GameAudioOffIcon /> : <GameAudioOnIcon />}
            </button>

            <button
              type="button"
              className="video-circle-btn video-circle-btn--skip"
              onClick={handleSkipCurrent}
              aria-label="Salta filmato"
            >
              <GameSkipIcon />
            </button>
          </>
        )}

        {/* 3D Flip tra i Video (Fronte) e Card 2 (Retro) */}
        <div className="scene-flip">
          <div className={`scene-flip__inner ${isFlipped ? 'scene-flip__inner--flipped' : ''}`}>
            {/* Fronte: Video 1 e Video 2. Su iOS viene nascosto completamente quando isFlipped è true per evitare il bug del video specchiato */}
            <div
              className="scene-flip__face scene-flip__face--front"
              style={isFlipped ? { display: 'none', visibility: 'hidden', opacity: 0, pointerEvents: 'none' } : undefined}
            >
              <div className="scene-page__video-container">
                {/* Video 1 */}
                <video
                  ref={video1Ref}
                  className={`scene-page__video ${phase === 'video2_playing' ? 'scene-page__video--hidden' : ''}`}
                  src={SCENE_1_VIDEO.src}
                  poster={SCENE_1_VIDEO.poster}
                  playsInline
                  webkit-playsinline="true"
                  x-webkit-airplay="deny"
                  preload="auto"
                  muted={isMuted}
                  controls={false}
                  controlsList="nodownload noplaybackrate noremoteplayback"
                  disablePictureInPicture
                  disableRemotePlayback
                  onEnded={handleVideo1Ended}
                >
                  <source src={SCENE_1_VIDEO.src} type="video/mp4" />
                </video>

                {/* Video 2 */}
                <video
                  ref={video2Ref}
                  className={`scene-page__video ${phase !== 'video2_playing' ? 'scene-page__video--hidden' : ''}`}
                  src={SCENE_2_VIDEO.src}
                  playsInline
                  webkit-playsinline="true"
                  x-webkit-airplay="deny"
                  preload="auto"
                  muted={isMuted}
                  controls={false}
                  controlsList="nodownload noplaybackrate noremoteplayback"
                  disablePictureInPicture
                  disableRemotePlayback
                  onEnded={handleVideo2Ended}
                >
                  <source src={SCENE_2_VIDEO.src} type="video/mp4" />
                </video>
              </div>

              {/* Scritta 'Premi per continuare' uniforme per tutto il gioco */}
              {phase === 'video1_ended' && (
                <button
                  type="button"
                  className="continue-tap-layer"
                  onClick={handleStartVideo2}
                  aria-label="Premi per continuare"
                >
                  <span className="continue-hint">Premi per continuare</span>
                </button>
              )}
            </div>

            {/* Retro: Card 2 (card2.jpg) con lo stesso metodo di Card 1 */}
            <div className="scene-flip__face scene-flip__face--back">
              <InteractiveCard2 onChoice={onChoiceCard2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
