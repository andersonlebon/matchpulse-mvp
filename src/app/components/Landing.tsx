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

// Tournament start was June 11 — it's already underway! The Final is July 19.
const FINAL_DATE = '2026-07-19T20:00:00Z';

export function Landing({ onSignUp, onLogin }: Props) {
  const liveMatch = getLiveMatch();
  const upcomingToday = getMatchesByStatus('upcoming').slice(0, 2);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden">
        <style>{`
          @keyframes hero-rise {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
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
          @keyframes hero-stat-pop {
            from { opacity: 0; transform: translateY(12px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .hero-rise { opacity: 0; animation: hero-rise 0.7s cubic-bezier(.21,.6,.35,1) forwards; }
          @media (prefers-reduced-motion: reduce) {
            .hero-rise { opacity: 1; animation: none; }
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
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Left — animated, blended video */}
            <div className="hero-rise" style={{ animationDelay: '0.1s' }}>
              <HeroVideo />
            </div>

            {/* Right — copy & CTAs */}
            <div className="text-center lg:text-left">
          {/* Live badge */}
          {liveMatch && (
            <div className="hero-rise inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-accent/30 bg-accent/10">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-semibold text-accent">
                LIVE NOW — See live match below ↓
              </span>
            </div>
          )}

          {!liveMatch && (
            <div className="hero-rise inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                FIFA World Cup 2026 — In Progress
              </span>
            </div>
          )}

          {/* Brand wordmark — transparent PNG, no black plate */}
          <div className="hero-rise flex justify-center lg:justify-start mb-6 md:mb-8 px-2 lg:px-0" style={{ animationDelay: '0.15s' }}>
            <img
              src={wordmarkImg}
              alt="MatchPulse"
              className="w-full max-w-sm sm:max-w-md md:max-w-lg h-auto object-contain"
            />
          </div>

          <h1
            className="hero-rise font-['Barlow_Condensed'] font-black uppercase tracking-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 1.0, animationDelay: '0.25s' }}
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

          <p className="hero-rise text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed" style={{ fontSize: '1.125rem', animationDelay: '0.35s' }}>
            Sync the entire FIFA World Cup 2026 schedule to your calendar. Track your favorite teams,
            get match reminders, and follow every game — from Group Stage to the Final.
          </p>

          <div className="hero-rise flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-10 lg:mb-0" style={{ animationDelay: '0.45s' }}>
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
            </div>
          </div>

          {/* Stats + countdown — full width below hero grid */}
          <div className="mt-16 text-center">
          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="flex flex-col items-center"
                style={{ opacity: 0, animation: `hero-stat-pop 0.6s ease-out forwards`, animationDelay: `${0.55 + i * 0.1}s` }}
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
          <div className="hero-rise inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-colors" style={{ animationDelay: '0.95s' }}>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Grand Final · July 19 · MetLife Stadium</span>
            <CountdownTimer targetDate={FINAL_DATE} size="lg" />
          </div>
          </div>
        </div>
      </section>

      {/* Live / Today's matches */}
      {(liveMatch || upcomingToday.length > 0) && (
        <section className="px-4 pb-16 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
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
            {liveMatch && <MatchCard match={liveMatch} highlighted />}
            {upcomingToday.slice(0, liveMatch ? 1 : 2).map(m => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="px-4 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
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
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
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
      <section className="px-4 pb-20 max-w-5xl mx-auto">
        <div
          className="relative overflow-hidden rounded-2xl p-8 md:p-12 text-center"
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
      <footer className="border-t border-border px-4 py-8 text-center">
        <div className="flex justify-center mb-4">
          <img src={symbolImg} alt="MatchPulse" className="h-10 w-auto object-contain opacity-70" />
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 MatchPulse · FIFA World Cup 2026 Edition · Not affiliated with FIFA
        </p>
      </footer>
    </div>
  );
}
