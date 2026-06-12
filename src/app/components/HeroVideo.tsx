import { useEffect, useRef, useState } from 'react';

const VIDEO_SRC = '/videos/Say_the_word_FIFA_Cup_use.mp4';

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.play().catch(() => {});

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  // Feather the video edges so it dissolves into the page background
  const edgeMask =
    'radial-gradient(ellipse 75% 75% at 50% 50%, #000 50%, transparent 100%)';

  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:max-w-none">
      <style>{`
        @keyframes hv-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.012); }
        }
        @keyframes hv-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes hv-breathe {
          0%, 100% { opacity: 0.35; transform: scale(0.95); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
        @keyframes hv-pulse-ring {
          0% { transform: scale(0.85); opacity: 0.6; }
          100% { transform: scale(1.25); opacity: 0; }
        }
      `}</style>

      {/* Soft breathing glow behind — sells the "transparent / floating" look */}
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

      {/* Slowly rotating accent ring while playing */}
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

      {/* Expanding pulse rings while playing */}
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

      {/* The video itself — edge-masked + screen blend so the dark frame
          melts into the page and only the bright action shows through */}
      <div
        className="relative"
        style={{ animation: 'hv-float 7s ease-in-out infinite' }}
      >
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
          loop
          playsInline
          preload="auto"
          aria-label="FIFA World Cup 2026 promo"
        />

        {/* Color wash that ties the footage to the brand palette */}
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
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/90">
              Live Reel
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
