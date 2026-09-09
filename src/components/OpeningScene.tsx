import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { GAME, OPENING_VIDEO } from '../config/media';
import { type ChoiceHotspot } from '../config/sceneCard1';
import InteractiveFlipCard from './InteractiveFlipCard';
import StartButton from './StartButton';
import './OpeningScene.css';

type Phase = 'idle' | 'playing' | 'ended' | 'card';

type OpeningSceneProps = {
  onChoice?: (choice: ChoiceHotspot) => void;
};

function configureVideoForIOS(video: HTMLVideoElement) {
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', 'true');
  video.setAttribute('x-webkit-airplay', 'deny');
  video.playsInline = true;
}

export default function OpeningScene({ onChoice }: OpeningSceneProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastFrameRef = useRef(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [showUnmuteHint, setShowUnmuteHint] = useState(false);

  const freezeLastFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    if (video.duration && Number.isFinite(video.duration)) {
      const t = Math.max(0, video.duration - 0.04);
      video.currentTime = t;
      lastFrameRef.current = t;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    configureVideoForIOS(video);
  }, []);

  useEffect(() => {
    if (phase !== 'ended' && phase !== 'card') return;
    const video = videoRef.current;
    if (!video) return;

    const restore = () => {
      video.pause();
      if (lastFrameRef.current > 0) {
        video.currentTime = lastFrameRef.current;
      }
    };

    video.addEventListener('loadeddata', restore);
    if (video.readyState >= 2) restore();

    return () => video.removeEventListener('loadeddata', restore);
  }, [phase]);

  const handleStart = async () => {
    const video = videoRef.current;
    if (!video || phase !== 'idle') return;

    configureVideoForIOS(video);

    // Su iOS, se il video non ha iniziato il download (readyState 0), forziamo load()
    if (video.readyState === 0) {
      video.load();
    }

    setPhase('playing');

    // Tentativo 1: Avvio con audio
    video.muted = false;
    try {
      await video.play();
      setIsMuted(false);
      setShowUnmuteHint(false);
    } catch {
      // Fallback iOS Safari: se l'audio è bloccato (es. Silent switch su iPhone o autoplay policy),
      // avviamo muto (ha il 100% di successo su iOS) e mostriamo il pulsante per attivare l'audio
      try {
        video.muted = true;
        await video.play();
        setIsMuted(true);
        setShowUnmuteHint(true);
      } catch (err) {
        console.error('Impossibile avviare il video:', err);
        setPhase('idle');
      }
    }
  };

  const handleToggleMute = (e: MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      setShowUnmuteHint(false);
    }
  };

  const handleEnded = () => {
    freezeLastFrame();
    setPhase('ended');
    setShowUnmuteHint(false);
  };

  const handleRevealCard = () => {
    if (phase === 'ended') setPhase('card');
  };

  const isFlat = phase === 'idle' || phase === 'playing';

  return (
    <section className="opening" aria-label={`${GAME.title} — ${GAME.subtitle}`}>
      <div className="opening__frame">
        {/* Pulsante rapido per attivare audio se Safari iOS ha forzato il muto */}
        {phase === 'playing' && showUnmuteHint && (
          <button
            type="button"
            className="opening__audio-btn"
            onClick={handleToggleMute}
            aria-label="Tocca per attivare l'audio"
          >
            🔊 Attiva audio
          </button>
        )}

        <div className={`entry-flip ${phase === 'ended' || phase === 'card' ? 'entry-flip--active' : ''}`}>
          <div
            className={[
              'entry-flip__inner',
              phase === 'card' ? 'entry-flip__inner--flipped' : '',
              isFlat ? 'entry-flip__inner--flat' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="entry-flip__face entry-flip__face--front">
              <video
                ref={videoRef}
                className="opening__video"
                src={OPENING_VIDEO.src}
                poster={OPENING_VIDEO.poster}
                playsInline
                webkit-playsinline="true"
                x-webkit-airplay="deny"
                preload="auto"
                muted={isMuted}
                controls={false}
                controlsList="nodownload noplaybackrate noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
                onContextMenu={(e: MouseEvent) => e.preventDefault()}
                onEnded={handleEnded}
              >
                <source src={OPENING_VIDEO.src} type="video/mp4" />
              </video>

              {phase === 'idle' && (
                <div className="opening__overlay opening__overlay--idle">
                  <div className="opening__actions opening__actions--solo">
                    <StartButton onClick={handleStart} />
                  </div>
                </div>
              )}

              {phase === 'ended' && (
                <button
                  type="button"
                  className="opening__tap-layer"
                  onClick={handleRevealCard}
                  aria-label="Tocca per continuare l'avventura"
                >
                  <span className="opening__continue-hint">Tocca per continuare</span>
                </button>
              )}
            </div>

            <div className="entry-flip__face entry-flip__face--back">
              <InteractiveFlipCard onChoice={onChoice} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
