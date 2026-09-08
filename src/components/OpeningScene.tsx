import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { GAME, OPENING_VIDEO } from '../config/media';
import InteractiveFlipCard from './InteractiveFlipCard';
import StartButton from './StartButton';
import './OpeningScene.css';

type Phase = 'idle' | 'playing' | 'ended' | 'card';

export default function OpeningScene() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastFrameRef = useRef(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [ready, setReady] = useState(false);

  const primeFirstFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.pause();
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

    const onLoaded = () => {
      primeFirstFrame();
      setReady(true);
    };

    video.addEventListener('loadeddata', onLoaded);
    if (video.readyState >= 2) onLoaded();

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
    video.currentTime = 0;

    try {
      await video.play();
    } catch {
      setPhase('idle');
    }
  };

  const handleEnded = () => {
    freezeLastFrame();
    setPhase('ended');
  };

  const handleRevealCard = () => {
    if (phase === 'ended') setPhase('card');
  };

  const videoProps = {
    ref: videoRef,
    className: 'opening__video',
    src: OPENING_VIDEO.src,
    poster: OPENING_VIDEO.poster,
    playsInline: true,
    preload: 'auto' as const,
    muted: false,
    controls: false,
    controlsList: 'nodownload noplaybackrate noremoteplayback',
    disablePictureInPicture: true,
    disableRemotePlayback: true,
    onContextMenu: (e: MouseEvent) => e.preventDefault(),
    onEnded: handleEnded,
  };

  return (
    <section className="opening" aria-label={`${GAME.title} — ${GAME.subtitle}`}>
      <div className="opening__frame">
        {phase === 'idle' || phase === 'playing' ? (
          <>
            <video {...videoProps} />
            {phase === 'idle' && (
              <div className="opening__overlay opening__overlay--idle">
                <div className="opening__actions opening__actions--solo">
                  <StartButton onClick={handleStart} disabled={!ready} />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="entry-flip">
            <div className={`entry-flip__inner ${phase === 'card' ? 'entry-flip__inner--flipped' : ''}`}>
              <div className="entry-flip__face entry-flip__face--front">
                <video {...videoProps} />
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
        )}
      </div>
    </section>
  );
}
