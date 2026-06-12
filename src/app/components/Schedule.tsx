import { useState, useMemo } from 'react';
import { Search, Download, Calendar, Filter, ChevronDown } from 'lucide-react';
import { MatchCard } from './MatchCard';
import { MATCHES, getMatchesByGroup, getGroupStageMatches, getKnockoutMatches, Match } from '../data/matches';
import { getTeam, getGroupTeams, GROUPS } from '../data/teams';
import { downloadICS } from '../utils/icsGenerator';
import { format } from 'date-fns';

type View = 'groups' | 'knockout' | 'all';

interface Props {
  favTeams: string[];
  onExportMatch: (match: Match) => void;
}

const GROUP_KEYS = Object.keys(GROUPS);

function GroupCard({ group, favTeams }: { group: string; favTeams: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const teams = getGroupTeams(group);
  const matches = getMatchesByGroup(group);
  const completedMatches = matches.filter(m => m.status === 'completed');

  // Standings
  const standings = teams.map(t => {
    const played = completedMatches.filter(m => m.homeTeam === t.code || m.awayTeam === t.code);
    let pts = 0, gf = 0, ga = 0, w = 0, d = 0, l = 0;
    played.forEach(m => {
      const isHome = m.homeTeam === t.code;
      const tG = isHome ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
      const oG = isHome ? (m.awayScore ?? 0) : (m.homeScore ?? 0);
      gf += tG; ga += oG;
      if (tG > oG) { pts += 3; w++; }
      else if (tG === oG) { pts += 1; d++; }
      else l++;
    });
    return { ...t, pts, gf, ga, gd: gf - ga, played: played.length, w, d, l };
  }).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);

  const isFavGroup = teams.some(t => favTeams.includes(t.code));

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${isFavGroup ? 'border-primary/30' : 'border-border'}`}>
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-['Barlow_Condensed'] font-black uppercase"
            style={{
              fontSize: '1.1rem',
              background: isFavGroup ? 'linear-gradient(135deg, #1A56DB, #E53535)' : undefined,
              WebkitBackgroundClip: isFavGroup ? 'text' : undefined,
              WebkitTextFillColor: isFavGroup ? 'transparent' : undefined,
              color: isFavGroup ? undefined : '#7A90B8',
            }}
          >
            Group {group}
          </span>
          <div className="flex items-center gap-0.5">
            {teams.map(t => (
              <span key={t.code} className="text-lg">{t.flag}</span>
            ))}
          </div>
          {isFavGroup && (
            <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded">Your Group</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Standings table */}
      <div className="border-t border-border bg-card px-4 py-3">
        <div className="grid gap-1">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto] gap-x-3 text-muted-foreground uppercase tracking-wider px-1 mb-1" style={{ fontSize: '0.6rem' }}>
            <span>Team</span>
            <span>P</span>
            <span>W</span>
            <span>D</span>
            <span>L</span>
            <span>GD</span>
            <span>Pts</span>
          </div>
          {standings.map((t, i) => (
            <div
              key={t.code}
              className={`grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto] gap-x-3 items-center px-1 py-1 rounded text-xs ${
                i < 2 ? 'text-foreground' : 'text-muted-foreground'
              } ${favTeams.includes(t.code) ? 'bg-primary/5' : ''}`}
            >
              <span className="flex items-center gap-1.5 min-w-0">
                <span>{t.flag}</span>
                <span className="truncate font-medium">{t.name}</span>
                {i < 2 && <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] shrink-0 opacity-80" />}
              </span>
              <span className="font-['JetBrains_Mono'] text-center text-xs">{t.played}</span>
              <span className="font-['JetBrains_Mono'] text-center text-xs">{t.w}</span>
              <span className="font-['JetBrains_Mono'] text-center text-xs">{t.d}</span>
              <span className="font-['JetBrains_Mono'] text-center text-xs">{t.l}</span>
              <span className="font-['JetBrains_Mono'] text-center text-xs">{t.gd > 0 ? '+' : ''}{t.gd}</span>
              <span className="font-['JetBrains_Mono'] font-bold text-center text-xs text-foreground">{t.pts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Matches */}
      {expanded && (
        <div className="border-t border-border bg-background/50 p-3 flex flex-col gap-2">
          {matches.map(m => (
            <MatchCard key={m.id} match={m} compact highlighted={favTeams.includes(m.homeTeam) || favTeams.includes(m.awayTeam)} />
          ))}
          <button
            onClick={() => downloadICS(matches.filter(m => m.status !== 'completed'), `group-${group}.ics`)}
            className="w-full py-2 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors mt-1 flex items-center justify-center gap-2"
          >
            <Download className="w-3 h-3" />
            Export Group {group} to Calendar
          </button>
        </div>
      )}
    </div>
  );
}

const KNOCKOUT_STAGES = ['Round of 32', 'Round of 16', 'Quarter-Final', 'Semi-Final', 'Third Place', 'Final'];

function KnockoutView({ favTeams }: { favTeams: string[] }) {
  return (
    <div className="flex flex-col gap-8">
      {KNOCKOUT_STAGES.map(stage => {
        const stageMatches = MATCHES.filter(m => m.stage === stage);
        if (stageMatches.length === 0) return null;
        return (
          <div key={stage}>
            <div className="flex items-center gap-3 mb-4">
              <h3
                className="font-['Barlow_Condensed'] font-bold uppercase text-foreground"
                style={{ fontSize: '1.25rem' }}
              >
                {stage}
              </h3>
              <span className="text-xs text-muted-foreground border border-border px-2 py-0.5 rounded">
                {stageMatches[0] && format(new Date(stageMatches[0].datetime), 'MMM d')}
                {stageMatches.length > 1 && ` – ${format(new Date(stageMatches[stageMatches.length - 1].datetime), 'MMM d')}`}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {stageMatches.map(m => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Schedule({ favTeams, onExportMatch }: Props) {
  const [view, setView] = useState<View>('groups');
  const [search, setSearch] = useState('');
  const [showFavOnly, setShowFavOnly] = useState(false);

  const allMatches = useMemo(() => {
    let list = view === 'all' ? MATCHES
      : view === 'groups' ? getGroupStageMatches()
      : getKnockoutMatches();

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        getTeam(m.homeTeam).name.toLowerCase().includes(q) ||
        getTeam(m.awayTeam).name.toLowerCase().includes(q) ||
        m.venue.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.stage.toLowerCase().includes(q)
      );
    }

    if (showFavOnly) {
      list = list.filter(m => favTeams.includes(m.homeTeam) || favTeams.includes(m.awayTeam));
    }

    return list;
  }, [view, search, showFavOnly, favTeams]);

  const groupedByDate = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of allMatches) {
      const day = m.datetime.slice(0, 10);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(m);
    }
    return map;
  }, [allMatches]);

  const exportable = allMatches.filter(m => m.status === 'upcoming' && m.homeTeam !== 'TBD');

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1
              className="font-['Barlow_Condensed'] font-black uppercase text-foreground"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.1 }}
            >
              World Cup 2026 Schedule
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              48 teams · 104 matches · June 11 – July 19 · USA, Canada & Mexico
            </p>
          </div>
          <button
            onClick={() => downloadICS(exportable, 'wc2026-schedule.ics')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shrink-0 transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #1A56DB, #1244b0)', color: '#fff', boxShadow: '0 0 20px rgba(26,86,219,0.25)' }}
          >
            <Download className="w-4 h-4" />
            Export All to Calendar
          </button>
        </div>

        {/* View tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary mb-5 w-fit">
          {(['groups', 'knockout', 'all'] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                view === v
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {v === 'all' ? 'All Matches' : v === 'groups' ? 'Group Stage' : 'Knockout'}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search team, venue, city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all text-sm"
            />
          </div>
          {favTeams.length > 0 && (
            <button
              onClick={() => setShowFavOnly(!showFavOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                showFavOnly
                  ? 'bg-primary/15 text-primary border-primary/30'
                  : 'border-border text-muted-foreground hover:border-white/20 hover:text-foreground'
              }`}
            >
              <Filter className="w-4 h-4" />
              My Teams Only
            </button>
          )}
        </div>

        {/* Content */}
        {view === 'groups' && !search && !showFavOnly ? (
          <div className="grid md:grid-cols-2 gap-4">
            {GROUP_KEYS.map(g => (
              <GroupCard key={g} group={g} favTeams={favTeams} />
            ))}
          </div>
        ) : view === 'knockout' && !search && !showFavOnly ? (
          <KnockoutView favTeams={favTeams} />
        ) : (
          <div className="flex flex-col gap-6">
            {allMatches.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground border border-border rounded-xl">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No matches found</p>
              </div>
            ) : (
              Array.from(groupedByDate.entries()).map(([day, dayMatches]) => (
                <div key={day}>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-semibold text-muted-foreground text-sm">
                      {format(new Date(day + 'T12:00:00Z'), 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                      {dayMatches.length} match{dayMatches.length !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {dayMatches.map(m => (
                      <MatchCard
                        key={m.id}
                        match={m}
                        highlighted={favTeams.includes(m.homeTeam) || favTeams.includes(m.awayTeam)}
                        onExport={onExportMatch}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
