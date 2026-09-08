import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { GAME, OPENING_VIDEO } from '../config/media';
import InteractiveFlipCard from './InteractiveFlipCard';
import StartButton from './StartButton';
import './OpeningScene.css';

type Phase = 'idle' | 'playing' | 'ended' | 'card';

function configureVideoForIOS(video: HTMLVideoElement) {
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', 'true');
  video.setAttribute('x-webkit-airplay', 'deny');
  video.playsInline = true;
}

export default function OpeningScene() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastFrameRef = useRef(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [ready, setReady] = useState(false);

  const primeFirstFrame = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    configureVideoForIOS(video);
    video.pause();

    // Su iOS il primo fotogramma spesso resta nero senza un play() muto
    const wasMuted = video.muted;
    video.muted = true;

    try {
      video.currentTime = 0;
      await video.play();
      video.pause();
      video.currentTime = 0;
    } catch {
      video.currentTime = 0;
    } finally {
      video.muted = wasMuted;
      setReady(true);
    }
  }, []);

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

    const onLoaded = () => {
      void primeFirstFrame();
    };

    video.addEventListener('loadeddata', onLoaded);
    if (video.readyState >= 2) void primeFirstFrame();

    return () => video.removeEventListener('loadeddata', onLoaded);
  }, [primeFirstFrame]);

  useEffect(() => {
    if (phase !== 'ended' && phase !== 'card') return;
    const video = videoRef.current;
    if (!video) return;

    const restore = () => {
      video.pause();
      video.currentTime = lastFrameRef.current;
    };

    video.addEventListener('loadeddata', restore);
    if (video.readyState >= 2) restore();

    return () => video.removeEventListener('loadeddata', restore);
  }, [phase]);

  const handleStart = async () => {
    const video = videoRef.current;
    if (!video || phase !== 'idle') return;

    setPhase('playing');
    configureVideoForIOS(video);
    video.currentTime = 0;
    video.muted = false;

    try {
      await video.play();
    } catch {
      try {
        video.muted = true;
        await video.play();
        video.muted = false;
      } catch {
        setPhase('idle');
      }
    }
  };

  const handleEnded = () => {
    freezeLastFrame();
    setPhase('ended');
  };

  const handleRevealCard = () => {
    if (phase === 'ended') setPhase('card');
  };

  const isFlat = phase === 'idle' || phase === 'playing';

  return (
    <section className="opening" aria-label={`${GAME.title} — ${GAME.subtitle}`}>
      <div className="opening__frame">
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
                playsInline
                preload="auto"
                muted={false}
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
                    <StartButton onClick={handleStart} disabled={!ready} />
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
              <InteractiveFlipCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
