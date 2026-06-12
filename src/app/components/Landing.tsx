import { Calendar, Bell, Trophy, Download, ChevronRight, Zap, Globe, Star } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { MatchCard } from './MatchCard';
import { HeroVideo } from './HeroVideo';
import { getLiveMatch, getMatchesByStatus } from '../data/matches';
import wordmarkImg from '../../imports/MatchPulse_Wordmark.png';
import symbolImg from '../../imports/MatchPulse_Symbol.png';

interface Props {
  onSignUp: () => void;
  onLogin: () => void;
}

const FEATURES = [
  {
    icon: Calendar,
    title: 'Calendar Sync',
    description: 'Export all 104 matches to Google, Apple, or Outlook Calendar in one click. Auto-sync with live updates.',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    icon: Star,
    title: 'Team Tracker',
    description: 'Pick your 3 favorite teams. Get a personalized dashboard that follows every kick, corner, and card.',
    color: 'text-[#F59E0B]',
    bg: 'bg-[#F59E0B]/10',
    border: 'border-[#F59E0B]/20',
  },
  {
    icon: Bell,
    title: 'Match Reminders',
    description: 'Never miss kick-off. Get reminders 1 hour and 15 minutes before every match — built into your calendar.',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Download a printable schedule of the entire tournament or just your team\'s matches.',
    color: 'text-[#8B5CF6]',
    bg: 'bg-[#8B5CF6]/10',
    border: 'border-[#8B5CF6]/20',
  },
  {
    icon: Trophy,
    title: 'Knockout Tracker',
    description: 'Track tournament progress from groups to the Final. See bracket updates as results come in.',
    color: 'text-[#16A34A]',
    bg: 'bg-[#16A34A]/10',
    border: 'border-[#16A34A]/20',
  },
  {
    icon: Globe,
    title: 'All 48 Teams',
    description: 'Complete FIFA World Cup 2026 data — 48 nations, 16 groups, 104 matches across USA, Canada & Mexico.',
    color: 'text-[#06B6D4]',
    bg: 'bg-[#06B6D4]/10',
    border: 'border-[#06B6D4]/20',
  },
];

const STATS = [
  { value: '48', label: 'Nations' },
  { value: '104', label: 'Matches' },
  { value: '16', label: 'Groups' },
  { value: '39', label: 'Days' },
];

// Project palette used to tint the floating decorations
const C_BLUE = '#1A56DB';
const C_RED = '#E53535';
const C_PURPLE = '#8B5CF6';

// Lots of soccer balls + trophies drifting across the hero, brand-colored,
// kept at low opacity so they read as ambient texture.
type Floater = {
  type: 'ball' | 'cup';
  top: string;
  left: string;
  size: number;
  color: string;
  opacity: number;
  anim: 'hero-drift' | 'hero-bob';
  duration: number;
  delay: number;
};

const FLOATERS: Floater[] = [
  { type: 'ball', top: '10%', left: '5%', size: 56, color: C_BLUE, opacity: 0.14, anim: 'hero-drift', duration: 19, delay: 0 },
  { type: 'cup', top: '18%', left: '90%', size: 48, color: C_RED, opacity: 0.13, anim: 'hero-bob', duration: 7, delay: 0.4 },
  { type: 'ball', top: '70%', left: '93%', size: 40, color: C_PURPLE, opacity: 0.12, anim: 'hero-drift', duration: 23, delay: 1.2 },
  { type: 'cup', top: '76%', left: '3%', size: 44, color: C_BLUE, opacity: 0.13, anim: 'hero-bob', duration: 8, delay: 0.9 },
  { type: 'ball', top: '42%', left: '48%', size: 34, color: C_RED, opacity: 0.08, anim: 'hero-drift', duration: 27, delay: 2 },
  { type: 'cup', top: '6%', left: '44%', size: 32, color: C_PURPLE, opacity: 0.1, anim: 'hero-bob', duration: 9, delay: 2.4 },
  { type: 'ball', top: '30%', left: '20%', size: 30, color: C_BLUE, opacity: 0.1, anim: 'hero-drift', duration: 21, delay: 0.7 },
  { type: 'ball', top: '85%', left: '34%', size: 38, color: C_RED, opacity: 0.1, anim: 'hero-drift', duration: 24, delay: 1.8 },
  { type: 'cup', top: '52%', left: '8%', size: 30, color: C_PURPLE, opacity: 0.1, anim: 'hero-bob', duration: 7.5, delay: 1.4 },
  { type: 'cup', top: '60%', left: '70%', size: 36, color: C_BLUE, opacity: 0.11, anim: 'hero-bob', duration: 8.5, delay: 0.3 },
  { type: 'ball', top: '15%', left: '70%', size: 28, color: C_PURPLE, opacity: 0.09, anim: 'hero-drift', duration: 25, delay: 2.6 },
  { type: 'cup', top: '38%', left: '82%', size: 30, color: C_RED, opacity: 0.1, anim: 'hero-bob', duration: 9.5, delay: 1.1 },
  { type: 'ball', top: '88%', left: '78%', size: 32, color: C_BLUE, opacity: 0.1, anim: 'hero-drift', duration: 20, delay: 0.6 },
  { type: 'ball', top: '4%', left: '24%', size: 26, color: C_RED, opacity: 0.08, anim: 'hero-drift', duration: 28, delay: 2.2 },
  { type: 'cup', top: '46%', left: '32%', size: 26, color: C_PURPLE, opacity: 0.08, anim: 'hero-bob', duration: 8, delay: 1.7 },
  { type: 'ball', top: '64%', left: '54%', size: 24, color: C_BLUE, opacity: 0.07, anim: 'hero-drift', duration: 26, delay: 3 },
];

function BallIcon({ size, color, opacity }: { size: number; color: string; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ opacity }} aria-hidden>
      <circle cx="32" cy="32" r="29" stroke={color} strokeWidth="3" />
      <path
        d="M32 14l9 6.5-3.4 10.6h-11.2L23 20.5 32 14z"
        fill={color}
        fillOpacity="0.55"
      />
      <path
        d="M32 14V5M41 20.5l8-3.5M37.6 31.1l6.6 6.4M26.4 31.1l-6.6 6.4M23 20.5l-8-3.5"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CupIcon({ size, color, opacity }: { size: number; color: string; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ opacity }} aria-hidden>
      <path
        d="M20 10h24v10a12 12 0 01-24 0V10z"
        fill={color}
        fillOpacity="0.5"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M20 14h-7v4a8 8 0 008 8M44 14h7v4a8 8 0 01-8 8" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M32 32v9M24 50h16M28 50c0-5 8-5 8 0" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Tournament start was June 11 — it's already underway! The Final is July 19.
const FINAL_DATE = '2026-07-19T20:00:00Z';

export function Landing({ onSignUp, onLogin }: Props) {
  const liveMatch = getLiveMatch();
  const upcomingToday = getMatchesByStatus('upcoming').slice(0, 2);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero — always dark "stadium night" so the video blend reads well */}
      <section className="dark relative pt-20 pb-24 px-4 overflow-hidden bg-background text-foreground">
        <style>{`
          @keyframes hero-orb-a {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(40px, 30px) scale(1.15); }
          }
          @keyframes hero-orb-b {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-50px, -20px) scale(1.2); }
          }
          @keyframes hero-grid-pan {
            from { background-position: 0 0; }
            to { background-position: 48px 48px; }
          }
          @keyframes hero-gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes hero-drift {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(24px, -32px) rotate(90deg); }
            50% { transform: translate(-16px, -56px) rotate(180deg); }
            75% { transform: translate(-30px, -24px) rotate(270deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
          }
          @keyframes hero-bob {
            0%, 100% { transform: translateY(0) rotate(-8deg); }
            50% { transform: translateY(-22px) rotate(8deg); }
          }
          @media (prefers-reduced-motion: reduce) {
            .hero-floater { animation: none !important; }
          }
        `}</style>

        {/* Animated background — panning grid + drifting glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(26,86,219,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(26,86,219,0.04) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              animation: 'hero-grid-pan 14s linear infinite',
            }}
          />
          <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[440px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(ellipse, #1A56DB 0%, transparent 70%)', animation: 'hero-orb-a 12s ease-in-out infinite' }}
          />
          <div className="absolute bottom-0 right-0 w-[460px] h-[460px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(ellipse, #E53535 0%, transparent 70%)', animation: 'hero-orb-b 15s ease-in-out infinite' }}
          />
          <div className="absolute top-1/3 right-1/4 w-[320px] h-[320px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(ellipse, #8B5CF6 0%, transparent 70%)', animation: 'hero-orb-a 18s ease-in-out infinite reverse' }}
          />

          {/* Floating soccer balls + World Cup trophies, brand-colored */}
          {FLOATERS.map((f, i) => (
            <span
              key={i}
              className="hero-floater absolute"
              style={{
                top: f.top,
                left: f.left,
                animation: `${f.anim} ${f.duration}s ease-in-out ${f.delay}s infinite`,
              }}
              aria-hidden
            >
              {f.type === 'ball' ? (
                <BallIcon size={f.size} color={f.color} opacity={f.opacity} />
              ) : (
                <CupIcon size={f.size} color={f.color} opacity={f.opacity} />
              )}
            </span>
          ))}
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Live badge */}
          {liveMatch && (
            <div data-aos="fade-down" className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-accent/30 bg-accent/10">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-semibold text-accent">
                LIVE NOW — See live match below ↓
              </span>
            </div>
          )}

          {!liveMatch && (
            <div data-aos="fade-down" className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                FIFA World Cup 2026 — In Progress
              </span>
            </div>
          )}

          {/* Animated, blended video — now the hero centerpiece.
              On mobile it rests at ~90% of the screen width. */}
          <div data-aos="zoom-in" data-aos-duration="900" className="mx-auto mb-8 md:mb-10 w-[90vw] sm:w-full sm:max-w-2xl">
            <HeroVideo />
          </div>

          <h1
            data-aos="fade-up"
            className="font-['Barlow_Condensed'] font-black uppercase tracking-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.0 }}
          >
            <span className="text-foreground">Never Miss A</span>
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #1A56DB, #8B5CF6, #E53535, #1A56DB)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'hero-gradient-shift 6s ease-in-out infinite',
              }}
            >
              World Cup Moment.
            </span>
          </h1>

          <p data-aos="fade-up" data-aos-delay="100" className="text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed" style={{ fontSize: '1.125rem' }}>
            Sync the entire FIFA World Cup 2026 schedule to your calendar. Track your favorite teams,
            get match reminders, and follow every game — from Group Stage to the Final.
          </p>

          <div data-aos="zoom-in" data-aos-delay="200" className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onSignUp}
              className="group flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_44px_rgba(26,86,219,0.55)]"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #1244b0)', boxShadow: '0 0 30px rgba(26,86,219,0.35)' }}
            >
              Create Free Account
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onLogin}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-foreground border border-border hover:border-primary/40 hover:bg-white/5 transition-all"
            >
              Sign In
            </button>
          </div>

          {/* Stats + countdown — full width below hero grid */}
          <div className="mt-16 text-center">
          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                data-aos="zoom-in"
                data-aos-delay={i * 100}
                className="flex flex-col items-center"
              >
                <span
                  className="font-['Barlow_Condensed'] font-black text-foreground"
                  style={{ fontSize: '2.5rem', lineHeight: 1 }}
                >
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Final countdown */}
          <div data-aos="zoom-in" className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Grand Final · July 19 · MetLife Stadium</span>
            <CountdownTimer targetDate={FINAL_DATE} size="lg" />
          </div>
          </div>
        </div>
      </section>

      {/* Live / Today's matches */}
      {(liveMatch || upcomingToday.length > 0) && (
        <section className="px-4 py-24 md:py-40 max-w-5xl mx-auto">
          <div data-aos="fade-up" className="flex items-center gap-3 mb-6">
            {liveMatch && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                LIVE
              </span>
            )}
            <h2
              className="font-['Barlow_Condensed'] font-bold uppercase tracking-wide text-foreground"
              style={{ fontSize: '1.5rem' }}
            >
              {liveMatch ? 'Live Match' : "Today's Matches"}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {liveMatch && (
              <div data-aos="fade-up" data-aos-delay="50">
                <MatchCard match={liveMatch} highlighted />
              </div>
            )}
            {upcomingToday.slice(0, liveMatch ? 1 : 2).map((m, i) => (
              <div key={m.id} data-aos="fade-up" data-aos-delay={(i + 1) * 100}>
                <MatchCard match={m} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="px-4 py-24 md:py-40 max-w-5xl mx-auto">
        <div data-aos="fade-up" className="text-center mb-12">
          <h2
            className="font-['Barlow_Condensed'] font-black uppercase tracking-tight text-foreground mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.1 }}
          >
            Everything A Fan Needs
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Built by fans, for fans. One platform to follow the biggest football tournament on Earth.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 100}
                className={`p-5 rounded-xl border ${f.border} ${f.bg} flex flex-col gap-3 hover:scale-[1.01] transition-transform`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${f.bg} border ${f.border}`}>
                  <Icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-foreground" style={{ fontFamily: 'DM Sans, sans-serif' }}>{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-4 py-24 md:py-40 max-w-5xl mx-auto">
        <div
          data-aos="zoom-in"
          className="dark relative overflow-hidden rounded-2xl p-8 md:p-12 text-center text-foreground"
          style={{ background: 'linear-gradient(135deg, #0A1A3F 0%, #0F1F3D 50%, #1A0A1A 100%)' }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `linear-gradient(rgba(26,86,219,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(26,86,219,0.06) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
          <div className="relative">
            <img src={symbolImg} alt="" className="w-16 h-16 mx-auto mb-4 object-contain opacity-90" />
            <h2
              className="font-['Barlow_Condensed'] font-black uppercase text-foreground mb-3"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', lineHeight: 1.1 }}
            >
              Ready to Follow the World Cup?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Free forever. Sync to any calendar. No app download required.
            </p>
            <button
              onClick={onSignUp}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #1244b0)', boxShadow: '0 0 30px rgba(26,86,219,0.4)' }}
            >
              Sync My Calendar — It's Free
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer data-aos="fade-up" className="border-t border-border px-4 py-16 text-center">
        <div className="flex justify-center mb-4">
          <img src={wordmarkImg} alt="MatchPulse" className="w-full max-w-xs sm:max-w-sm h-auto object-contain opacity-80" />
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 MatchPulse · FIFA World Cup 2026 Edition · Not affiliated with FIFA
        </p>
      </footer>
    </div>
  );
}
