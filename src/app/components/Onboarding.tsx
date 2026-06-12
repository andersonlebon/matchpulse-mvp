import { useState } from 'react';
import { Check, ChevronRight, Search, Star } from 'lucide-react';
import { Team } from '../data/teams';
import { useFootball } from '../context/FootballContext';
import logoImg from '../../imports/ChatGPT_Image_Jun_11__2026__09_04_24_PM.png';

interface Props {
  onComplete: (teamCodes: string[]) => void;
}

const CONFEDERATIONS = ['All', 'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'];

export function Onboarding({ onComplete }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [confFilter, setConfFilter] = useState('All');
  const { teams } = useFootball();
  const allTeams = Object.values(teams).sort((a, b) => a.name.localeCompare(b.name));

  const filtered = allTeams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase());
    const matchesConf = confFilter === 'All' || t.confederation === confFilter;
    return matchesSearch && matchesConf;
  });

  function toggleTeam(code: string) {
    setSelected(prev => {
      if (prev.includes(code)) return prev.filter(c => c !== code);
      if (prev.length >= 3) return [...prev.slice(1), code]; // rotate
      return [...prev, code];
    });
  }

  function getRank(code: string) {
    const idx = selected.indexOf(code);
    return idx === -1 ? null : idx + 1;
  }

  const primaryTeam = selected[0] ? allTeams.find(t => t.code === selected[0]) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <img src={logoImg} alt="MatchPulse" className="h-7 w-auto object-contain" />
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <div className="flex items-center gap-1">
                {selected.map((code, i) => {
                  const t = allTeams.find(x => x.code === code);
                  return (
                    <div key={code} className="relative">
                      <span className="text-xl">{t?.flag}</span>
                      {i === 0 && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center">
                          <Star className="w-2 h-2 text-white fill-white" />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <span className="text-sm text-muted-foreground">
              {selected.length}/3
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1
            className="font-['Barlow_Condensed'] font-black uppercase text-foreground mb-2"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1 }}
          >
            Pick Your Teams
          </h1>
          <p className="text-muted-foreground">
            Select up to 3 teams. Your first pick becomes your{' '}
            <span className="text-primary font-semibold">primary team</span> — matches highlighted on your dashboard.
          </p>
        </div>

        {/* Selected preview */}
        {selected.length > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-border bg-card flex flex-wrap gap-3">
            {selected.map((code, i) => {
              const t = allTeams.find(x => x.code === code)!;
              return (
                <div key={code} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border">
                  <span className="text-2xl">{t.flag}</span>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-foreground">{t.name}</span>
                      {i === 0 && <Star className="w-3 h-3 text-primary fill-primary" />}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {i === 0 ? 'Primary' : `Pick ${i + 1}`}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleTeam(code)}
                    className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all text-sm"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {CONFEDERATIONS.map(c => (
              <button
                key={c}
                onClick={() => setConfFilter(c)}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  confFilter === c
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'text-muted-foreground border border-border hover:border-white/20 hover:text-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-10">
          {filtered.map(team => {
            const rank = getRank(team.code);
            const isSelected = rank !== null;
            return (
              <button
                key={team.code}
                onClick={() => toggleTeam(team.code)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-border bg-card hover:border-white/20 hover:bg-white/[0.03]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    {rank === 1 ? (
                      <Star className="w-3 h-3 text-white fill-white" />
                    ) : (
                      <span className="text-white text-xs font-bold">{rank}</span>
                    )}
                  </div>
                )}
                <span className="text-3xl">{team.flag}</span>
                <span className="text-xs font-semibold text-foreground text-center leading-tight">{team.name}</span>
                <span className="text-xs text-muted-foreground">Group {team.group}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky footer CTA */}
      <div className="sticky bottom-0 border-t border-border bg-card/95 backdrop-blur-sm px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {selected.length === 0
              ? 'Select at least 1 team to continue'
              : selected.length < 3
              ? `${3 - selected.length} more pick${3 - selected.length !== 1 ? 's' : ''} available`
              : 'All 3 picks selected'}
          </p>
          <button
            onClick={() => onComplete(selected)}
            disabled={selected.length === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #1A56DB, #1244b0)', boxShadow: selected.length > 0 ? '0 0 20px rgba(26,86,219,0.3)' : 'none' }}
          >
            Continue to Dashboard
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
