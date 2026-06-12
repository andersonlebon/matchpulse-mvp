import { X, Download, MapPin, Calendar } from 'lucide-react';
import { Match } from '../data/matches';
import { Team } from '../data/teams';
import { MatchCard } from './MatchCard';
import { downloadICS } from '../utils/icsGenerator';
import { format } from 'date-fns';

interface StandingRow {
  code: string;
  name: string;
  flag: string;
  played: number;
  w: number;
  d: number;
  l: number;
  gd: number;
  pts: number;
}

interface Props {
  group: string;
  teams: Team[];
  matches: Match[];
  standings: StandingRow[];
  favTeams: string[];
  onClose: () => void;
  onMatchClick: (match: Match) => void;
}

export function GroupDetailModal({
  group, teams, matches, standings, favTeams, onClose, onMatchClick,
}: Props) {
  const upcoming = matches.filter(m => m.status !== 'completed');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl">
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #1A56DB, #E53535)' }} />

        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-border bg-card/95 backdrop-blur-sm">
          <div>
            <h2 className="font-['Barlow_Condensed'] font-black uppercase text-foreground text-2xl">
              Group {group}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {teams.length} teams · {matches.length} matches
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-6">
          {/* Teams */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Squads</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {teams.map(t => (
                <div
                  key={t.code}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    favTeams.includes(t.code) ? 'border-primary/40 bg-primary/5' : 'border-border bg-background/50'
                  }`}
                >
                  <span className="text-3xl">{t.flag}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.code} · {t.confederation}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Standings */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Standings</h3>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto] gap-x-3 text-muted-foreground uppercase tracking-wider px-4 py-2 bg-secondary text-[0.6rem]">
                <span>Team</span><span>P</span><span>W</span><span>D</span><span>L</span><span>GD</span><span>Pts</span>
              </div>
              {standings.map((t, i) => (
                <div
                  key={t.code}
                  className={`grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto] gap-x-3 items-center px-4 py-2.5 text-xs border-t border-border ${
                    favTeams.includes(t.code) ? 'bg-primary/5' : ''
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span>{t.flag}</span>
                    <span className="font-medium truncate">{t.name}</span>
                    {i < 2 && <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0" />}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-center">{t.played}</span>
                  <span className="font-['JetBrains_Mono'] text-center">{t.w}</span>
                  <span className="font-['JetBrains_Mono'] text-center">{t.d}</span>
                  <span className="font-['JetBrains_Mono'] text-center">{t.l}</span>
                  <span className="font-['JetBrains_Mono'] text-center">{t.gd > 0 ? '+' : ''}{t.gd}</span>
                  <span className="font-['JetBrains_Mono'] font-bold text-center">{t.pts}</span>
                </div>
              ))}
            </div>
          </section>

          {/* All matches */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              All Matches
            </h3>
            <div className="flex flex-col gap-2">
              {matches.map(m => (
                <button key={m.id} type="button" onClick={() => onMatchClick(m)} className="text-left">
                  <MatchCard
                    match={m}
                    compact
                    highlighted={favTeams.includes(m.homeTeam) || favTeams.includes(m.awayTeam)}
                  />
                </button>
              ))}
            </div>
          </section>

          {upcoming.length > 0 && (
            <button
              onClick={() => downloadICS(upcoming, `group-${group}.ics`)}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90"
            >
              <Download className="w-4 h-4" />
              Export Group {group} Calendar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
