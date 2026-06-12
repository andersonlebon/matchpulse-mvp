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
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const collapsedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [muted, setMuted] = useState(true);

  const [intro, setIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !prefersReducedMotion();
  });
  const [ready, setReady] = useState(false);
  const [introTransform, setIntroTransform] = useState('none');

  // Wait until the intro video is buffered enough to play through before
  // revealing/animating it — avoids "audio plays but no picture yet".
  useEffect(() => {
    if (!intro) return;
    const iv = introVideoRef.current;
    if (!iv) return;

    let done = false;
    const markReady = () => {
      if (!done) {
        done = true;
        setReady(true);
      }
    };

    iv.addEventListener('canplaythrough', markReady);
    iv.addEventListener('error', markReady); // proceed instead of hanging
    iv.load();
    // Safety net so we never get stuck on a slow/failed download
    const fallback = window.setTimeout(markReady, 15000);

    return () => {
      window.clearTimeout(fallback);
      iv.removeEventListener('canplaythrough', markReady);
      iv.removeEventListener('error', markReady);
    };
  }, [intro]);

  // Shrink the fullscreen video down into its hero slot. The resting size
  // always fits the screen (≈90% width on mobile, the hero box on desktop).
  const collapseIntoHero = () => {
    if (collapsedRef.current) return;
    collapsedRef.current = true;
    const slot = videoRef.current;
    if (!slot) {
      finishIntro();
      return;
    }
    const rect = slot.getBoundingClientRect();
    const sx = rect.width / window.innerWidth;
    const sy = rect.height / window.innerHeight;
    setIntroTransform(`translate(${rect.left}px, ${rect.top}px) scale(${sx}, ${sy})`);
  };

  // Once buffered: play fullscreen for the whole clip, then collapse when the
  // video finishes (not during playback).
  useLayoutEffect(() => {
    if (!intro || !ready) return;
    const iv = introVideoRef.current;
    if (!iv) return;

    iv.muted = false;
    iv.volume = 1;
    iv.play()
      .then(() => setMuted(false))
      .catch(() => {
        iv.muted = true;
        setMuted(true);
        iv.play().catch(() => {});
      });

    const onEnded = () => collapseIntoHero();
    iv.addEventListener('ended', onEnded);

    // Safety net: collapse even if 'ended' never fires (e.g. playback blocked)
    const durMs = (Number.isFinite(iv.duration) && iv.duration > 0 ? iv.duration : 20) * 1000;
    const fallback = window.setTimeout(collapseIntoHero, durMs + 6000);

    return () => {
      iv.removeEventListener('ended', onEnded);
      window.clearTimeout(fallback);
    };
  }, [intro, ready]);

  // Inline hero video — wired up once the intro has handed off.
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
      video.play().catch(() => {});
    }

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('volumechange', onVolume);
    };
  }, [intro]);

  // Unmute on the very first user interaction anywhere on the page (landing
  // only — this component is only rendered there). Browsers require a gesture
  // before audio can play, so this makes sound "just work" without aiming.
  useEffect(() => {
    let used = false;
    const unmute = () => {
      if (used) return;
      used = true;
      const target = intro && introVideoRef.current ? introVideoRef.current : videoRef.current;
      if (target) {
        target.muted = false;
        target.volume = 1;
        target.play().then(() => setMuted(false)).catch(() => {});
      }
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener('pointerdown', unmute);
      window.removeEventListener('keydown', unmute);
      window.removeEventListener('touchstart', unmute);
    };
    window.addEventListener('pointerdown', unmute);
    window.addEventListener('keydown', unmute);
    window.addEventListener('touchstart', unmute);
    return cleanup;
  }, [intro]);

  const finishIntro = () => {
    const iv = introVideoRef.current;
    const video = videoRef.current;
    if (video) {
      if (iv && iv.ended) {
        // Played through fullscreen — rest on the last frame, offer replay
        video.muted = iv.muted;
        if (Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = video.duration;
        }
        setPlaying(false);
        setEnded(true);
      } else if (iv) {
        // Handoff mid-playback (fallback path): continue seamlessly
        video.currentTime = iv.currentTime;
        video.muted = iv.muted;
        video.play().catch(() => {});
      }
    }
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
          className="fixed inset-0 z-[100] bg-[#04091a] overflow-hidden"
          style={{
            transformOrigin: '0 0',
            transform: introTransform,
            transition: 'transform 1.4s cubic-bezier(0.7, 0, 0.2, 1), border-radius 1.4s ease',
            borderRadius: introTransform === 'none' ? 0 : 16,
            willChange: 'transform',
          }}
          onTransitionEnd={(e) => {
            if (e.propertyName === 'transform') finishIntro();
          }}
          onClick={() => {
            const iv = introVideoRef.current;
            if (!iv) return;
            iv.muted = false;
            iv.volume = 1;
            iv.play().then(() => setMuted(false)).catch(() => {});
          }}
        >
          <video
            ref={introVideoRef}
            className="w-full h-full object-cover"
            src={VIDEO_SRC}
            playsInline
            preload="auto"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(26,86,219,0.2), transparent 45%, rgba(229,53,53,0.18))' }}
          />

          {/* Loading state — bouncing World Cup ball until the video buffers */}
          {!ready && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-7 bg-[#04091a]">
              <div className="relative flex h-24 w-20 items-end justify-center">
                <div style={{ animation: 'hv-ball-bounce 0.85s cubic-bezier(0.5,0.05,0.5,0.95) infinite', transformOrigin: 'bottom center' }}>
                  <svg width="56" height="56" viewBox="0 0 64 64" style={{ animation: 'hv-spin 1s linear infinite', filter: 'drop-shadow(0 0 12px rgba(26,86,219,0.45))' }} aria-hidden>
                    <circle cx="32" cy="32" r="29" fill="#FFFFFF" stroke="#0A1528" strokeWidth="2" />
                    <polygon points="32,20 41,27 37.5,38 26.5,38 23,27" fill="#0A1528" />
                    <path
                      d="M32 20V8 M41 27L52 22 M37.5 38L45 49 M26.5 38L19 49 M23 27L12 22"
                      stroke="#0A1528"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path d="M32 8l-8-4M32 8l8-4M52 22l1-9M12 22l-1-9M45 49l9 1M19 49l-9 1" stroke="#0A1528" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div
                  className="absolute bottom-0 h-2 w-12 rounded-[50%] bg-[#1A56DB]"
                  style={{ animation: 'hv-ball-shadow 0.85s cubic-bezier(0.5,0.05,0.5,0.95) infinite', filter: 'blur(3px)' }}
                  aria-hidden
                />
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-white/70">Loading the World Cup…</span>
            </div>
          )}

          {/* Sound hint if the browser blocked autoplay audio */}
          {ready && muted && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 text-white/90 pointer-events-none">
              <VolumeX className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Tap for sound</span>
            </div>
          )}
        </div>
      )}

      <div className="relative w-full mx-auto lg:mx-0">
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
          @keyframes hv-ball-bounce {
            0%   { transform: translateY(-46px) scaleY(1.05) scaleX(0.96); }
            55%  { transform: translateY(0) scaleY(0.86) scaleX(1.12); }
            70%  { transform: translateY(-10px) scaleY(1.02) scaleX(0.99); }
            100% { transform: translateY(-46px) scaleY(1.05) scaleX(0.96); }
          }
          @keyframes hv-ball-shadow {
            0%, 100% { transform: scaleX(0.55); opacity: 0.18; }
            55%      { transform: scaleX(1); opacity: 0.45; }
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
              opacity: intro ? 0 : 0.92,
              transition: 'opacity 0.4s ease',
              maskImage: edgeMask,
              WebkitMaskImage: edgeMask,
            }}
            src={VIDEO_SRC}
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
