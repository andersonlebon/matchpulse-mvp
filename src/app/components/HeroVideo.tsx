import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';

const VIDEO_SRC = '/videos/Say_the_word_FIFA_Cup_use.mp4';

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(true);

  const [intro, setIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !prefersReducedMotion();
  });
  const [introTransform, setIntroTransform] = useState('none');

  useLayoutEffect(() => {
    if (!intro) return;
    const slot = videoRef.current;
    if (!slot) return;

    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const rect = slot.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const sx = rect.width / vw;
        const sy = rect.height / vh;
        setIntroTransform(`translate(${rect.left}px, ${rect.top}px) scale(${sx}, ${sy})`);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [intro]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => { setPlaying(true); setEnded(false); };
    const onPause = () => setPlaying(false);
    const onEnded = () => { setPlaying(false); setEnded(true); };
    const onVolume = () => setMuted(video.muted);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('volumechange', onVolume);

    if (!intro) {
      video.muted = true;
      video.play().catch(() => {});
    } else {
      video.muted = false;
      video.volume = 1;
      video.play()
        .then(() => setMuted(false))
        .catch(() => {
          video.muted = true;
          setMuted(true);
          video.play().catch(() => {});
        });
    }

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('volumechange', onVolume);
    };
  }, [intro]);

  const finishIntro = () => {
    setIntro(false);
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted) video.play().catch(() => {});
  };

  const replay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const edgeMask =
    'radial-gradient(ellipse 75% 75% at 50% 50%, #000 50%, transparent 100%)';

  return (
    <>
      {intro && (
        <div
          className="fixed inset-0 z-[100] bg-[#04091a] overflow-hidden pointer-events-none"
          style={{
            transformOrigin: '0 0',
            transform: introTransform,
            transition: 'transform 15s cubic-bezier(0.7, 0, 0.2, 1), border-radius 15s ease, opacity 0.4s ease',
            borderRadius: introTransform === 'none' ? 0 : 16,
            willChange: 'transform',
            opacity: introTransform === 'none' ? 0 : 1,
          }}
          onTransitionEnd={(e) => {
            if (e.propertyName === 'transform') finishIntro();
          }}
          aria-hidden
        >
          <div
            className="w-full h-full bg-[#04091a]"
            style={{
              backgroundImage: `url(${VIDEO_SRC})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(26,86,219,0.2), transparent 45%, rgba(229,53,53,0.18))' }}
          />
        </div>
      )}

      <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
        <style>{`
          @keyframes hv-float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-10px) scale(1.012); }
          }
          @keyframes hv-spin { to { transform: rotate(360deg); } }
          @keyframes hv-breathe {
            0%, 100% { opacity: 0.35; transform: scale(0.95); }
            50% { opacity: 0.7; transform: scale(1.08); }
          }
          @keyframes hv-pulse-ring {
            0% { transform: scale(0.85); opacity: 0.6; }
            100% { transform: scale(1.25); opacity: 0; }
          }
        `}</style>

        <div
          className="absolute -inset-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 40% 40%, rgba(26,86,219,0.35), transparent 60%), radial-gradient(ellipse at 65% 70%, rgba(229,53,53,0.25), transparent 60%)',
            animation: 'hv-breathe 6s ease-in-out infinite',
            filter: 'blur(10px)',
          }}
          aria-hidden
        />

        <div
          className={`absolute -inset-6 rounded-full pointer-events-none transition-opacity duration-700 ${
            playing ? 'opacity-40' : 'opacity-0'
          }`}
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, rgba(26,86,219,0.5) 90deg, transparent 180deg, rgba(229,53,53,0.5) 270deg, transparent 360deg)',
            animation: 'hv-spin 14s linear infinite',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
          }}
          aria-hidden
        />

        {playing && (
          <>
            <div
              className="absolute inset-6 rounded-full border border-primary/30 pointer-events-none"
              style={{ animation: 'hv-pulse-ring 3.2s ease-out infinite' }}
              aria-hidden
            />
            <div
              className="absolute inset-6 rounded-full border border-accent/30 pointer-events-none"
              style={{ animation: 'hv-pulse-ring 3.2s ease-out infinite', animationDelay: '1.6s' }}
              aria-hidden
            />
          </>
        )}

        <div className="relative" style={{ animation: 'hv-float 7s ease-in-out infinite' }}>
          <video
            ref={videoRef}
            className="relative z-10 w-full aspect-video object-cover"
            style={{
              mixBlendMode: 'screen',
              opacity: 0.92,
              maskImage: edgeMask,
              WebkitMaskImage: edgeMask,
            }}
            src={VIDEO_SRC}
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-label="FIFA World Cup 2026 promo"
          />

          <div
            className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
            style={{
              background:
                'linear-gradient(135deg, rgba(26,86,219,0.25), transparent 45%, rgba(229,53,53,0.2))',
              maskImage: edgeMask,
              WebkitMaskImage: edgeMask,
            }}
            aria-hidden
          />

          {playing && (
            <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/90">Live Reel</span>
            </div>
          )}

          {!playing && !intro && (
            <button
              type="button"
              onClick={replay}
              aria-label={ended ? 'Replay video' : 'Play video'}
              className="absolute inset-0 z-30 flex items-center justify-center group"
            >
              <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/35" />
              <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white/90 text-[#04091a] shadow-[0_0_40px_rgba(26,86,219,0.6)] transition-transform group-hover:scale-110">
                <Play className="w-7 h-7 ml-0.5 fill-current" />
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
            className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 text-white/90 hover:bg-black/60 transition-colors"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="text-[10px] font-semibold uppercase tracking-wider">
              {muted ? 'Tap for sound' : 'Sound on'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
