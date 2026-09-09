import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { SCENE_1_VIDEO, SCENE_2_VIDEO } from '../config/media';
import { type ChoiceHotspot } from '../config/sceneCard1';
import InteractiveCard2 from './InteractiveCard2';
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
  const [showAudioBadge, setShowAudioBadge] = useState(false);

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
        setShowAudioBadge(false);
      } catch {
        // Fallback Safari iOS (es. Silent switch attivo)
        try {
          v1.muted = true;
          await v1.play();
          setIsMuted(true);
          setShowAudioBadge(true);
        } catch (err) {
          console.warn('Avvio video1 in attesa di tap:', err);
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

  // Fine video1 -> freeze ultimo fotogramma e mostra "Premi per continuare"
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
        setShowAudioBadge(true);
      } catch (err) {
        console.error('Errore avvio video2:', err);
      }
    }
  };

  // Fine video2 -> flip card e mostra card2.png
  const handleVideo2Ended = () => {
    setPhase('card2');
    setShowAudioBadge(false);
  };

  // Toggle audio
  const handleToggleAudio = (e: MouseEvent) => {
    e.stopPropagation();
    const activeVideo = phase === 'video2_playing' ? video2Ref.current : video1Ref.current;
    if (!activeVideo) return;

    const nextMuted = !activeVideo.muted;
    activeVideo.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      setShowAudioBadge(false);
    }
  };

  // Salta al termine del video corrente (opzionale per comodità)
  const handleSkipCurrent = () => {
    if (phase === 'video1_playing') {
      handleVideo1Ended();
    } else if (phase === 'video2_playing') {
      handleVideo2Ended();
    }
  };

  const isFlipped = phase === 'card2';

  return (
    <section className="scene-page" aria-label="Marea Nera — Scena 1 ed Evoluzione">
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
          <span className="scene-page__badge">
            {phase === 'card2' ? 'Decisioni Cruciali' : 'Capitolo 1'}
          </span>
        </header>

        {/* Audio badge iOS se il video è mutato */}
        {showAudioBadge && (phase === 'video1_playing' || phase === 'video2_playing') && (
          <button
            type="button"
            className="scene-page__audio-btn"
            onClick={handleToggleAudio}
            aria-label="Tocca per attivare l'audio"
          >
            🔊 Tocca per attivare audio
          </button>
        )}

        {/* 3D Flip tra i Video (Fronte) e Card 2 (Retro) */}
        <div className="scene-flip">
          <div className={`scene-flip__inner ${isFlipped ? 'scene-flip__inner--flipped' : ''}`}>
            {/* Fronte: Video 1 e Video 2 */}
            <div className="scene-flip__face scene-flip__face--front">
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

              {/* Pulsante 'Premi per continuare' quando video1 è terminato */}
              {phase === 'video1_ended' && (
                <button
                  type="button"
                  className="scene-page__tap-layer"
                  onClick={handleStartVideo2}
                  aria-label="Premi per continuare al secondo video"
                >
                  <span className="scene-page__continue-hint">Premi per continuare</span>
                </button>
              )}

              {/* Controlli minimi durante la riproduzione dei video */}
              {(phase === 'video1_playing' || phase === 'video2_playing') && (
                <div className="scene-page__mini-controls">
                  <span className="scene-page__time-hint" style={{ color: 'rgba(240,216,120,0.85)', fontSize: '0.85rem' }}>
                    {phase === 'video1_playing' ? 'Scena 1' : 'Scena 2'}
                  </span>
                  <button
                    type="button"
                    className="scene-page__skip-btn"
                    onClick={handleSkipCurrent}
                    aria-label="Salta video"
                  >
                    Salta ⏭
                  </button>
                </div>
              )}
            </div>

            {/* Retro: Card 2 con le 4 aree interattive */}
            <div className="scene-flip__face scene-flip__face--back">
              <InteractiveCard2 onChoice={onChoiceCard2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
