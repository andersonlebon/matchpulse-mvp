import { useState } from 'react';
import { Calendar, Download, Trophy, Clock, MapPin, ChevronRight, Zap, Star } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { MatchCard } from './MatchCard';
import {
  MATCHES, getLiveMatch, getNextMatch, getTodayMatches,
  getMatchesByTeam, getMatchesByStatus, Match
} from '../data/matches';
import { getTeam, GROUPS } from '../data/teams';
import { downloadICS } from '../utils/icsGenerator';
import { format } from 'date-fns';

interface Props {
  user: { name: string; email: string };
  favTeams: string[];
  onNavigate: (page: 'schedule' | 'export') => void;
}

function GroupStandingsPreview({ group }: { group: string }) {
  const teams = (GROUPS[group] ?? []).map(code => getTeam(code));
  const groupMatches = MATCHES.filter(m => m.stage === `Group ${group}` && m.status === 'completed');

  // Build simple standings
  const standings = teams.map(t => {
    const played = groupMatches.filter(m => m.homeTeam === t.code || m.awayTeam === t.code);
    let pts = 0, gf = 0, ga = 0;
    played.forEach(m => {
      const isHome = m.homeTeam === t.code;
      const tGoals = isHome ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
      const oGoals = isHome ? (m.awayScore ?? 0) : (m.homeScore ?? 0);
      gf += tGoals; ga += oGoals;
      if (tGoals > oGoals) pts += 3;
      else if (tGoals === oGoals) pts += 1;
    });
    return { ...t, pts, gf, ga, gd: gf - ga, played: played.length };
  }).sort((a, b) => b.pts - a.pts || b.gd - a.gd);

  return (
    <div className="text-xs">
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-2 text-muted-foreground uppercase tracking-wider mb-1 px-1" style={{ fontSize: '0.65rem' }}>
        <span>Team</span>
        <span>P</span>
        <span>GD</span>
        <span>GF</span>
        <span>Pts</span>
      </div>
      {standings.map((t, i) => (
        <div key={t.code} className={`grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-2 items-center px-1 py-0.5 rounded ${i < 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
          <span className="flex items-center gap-1.5 min-w-0">
            <span>{t.flag}</span>
            <span className="truncate font-medium">{t.name}</span>
            {i < 2 && <span className="w-1 h-1 rounded-full bg-[#16A34A] shrink-0" />}
          </span>
          <span className="font-['JetBrains_Mono'] text-center">{t.played}</span>
          <span className="font-['JetBrains_Mono'] text-center">{t.gd > 0 ? '+' : ''}{t.gd}</span>
          <span className="font-['JetBrains_Mono'] text-center">{t.gf}</span>
          <span className="font-['JetBrains_Mono'] font-bold text-center text-foreground">{t.pts}</span>
        </div>
      ))}
    </div>
  );
}

export function Dashboard({ user, favTeams, onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'myteams' | 'today'>('overview');
  const liveMatch = getLiveMatch();
  const nextFavMatch = getNextMatch(favTeams);
  const nextAnyMatch = getNextMatch();
  const todayMatches = getTodayMatches();
  const completedMatches = getMatchesByStatus('completed');
  const upcomingMatches = getMatchesByStatus('upcoming');

  const favMatchesByTeam = favTeams.map(code => ({
    team: getTeam(code),
    matches: getMatchesByTeam(code).slice(0, 3),
  }));

  // Get the favTeam groups for standings preview
  const favGroups = [...new Set(favTeams.map(c => getTeam(c).group))];

  const firstName = user.name.split(' ')[0];
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Greeting */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1
              className="font-['Barlow_Condensed'] font-black uppercase text-foreground"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.1 }}
            >
              {greeting}, {firstName}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              FIFA World Cup 2026 · Day 2 of 39 · Group Stage
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onNavigate('export')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Export Calendar</span>
            </button>
          </div>
        </div>

        {/* LIVE MATCH BANNER */}
        {liveMatch && (
          <div className="mb-6 relative overflow-hidden rounded-2xl border border-accent/30 p-5"
            style={{ background: 'linear-gradient(135deg, rgba(229,53,53,0.08) 0%, rgba(229,53,53,0.04) 100%)' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #E53535, transparent)' }} />
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-accent">Live Match</span>
              <span className="font-['JetBrains_Mono'] text-xs text-accent bg-accent/10 px-2 py-0.5 rounded">
                {liveMatch.liveMinute}'
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex flex-col items-center gap-1">
                <span className="text-4xl">{getTeam(liveMatch.homeTeam).flag}</span>
                <span className="text-sm font-semibold text-foreground">{getTeam(liveMatch.homeTeam).name}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span
                  className="font-['JetBrains_Mono'] font-black text-foreground"
                  style={{ fontSize: '2.5rem', lineHeight: 1 }}
                >
                  {liveMatch.homeScore} – {liveMatch.awayScore}
                </span>
                <span className="text-xs text-muted-foreground">{liveMatch.stage} · {liveMatch.venue}</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1">
                <span className="text-4xl">{getTeam(liveMatch.awayTeam).flag}</span>
                <span className="text-sm font-semibold text-foreground">{getTeam(liveMatch.awayTeam).name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Key metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Matches Played', value: completedMatches.length, icon: Trophy, color: 'text-[#16A34A]' },
            { label: 'Upcoming Today', value: todayMatches.filter(m => m.status === 'upcoming').length, icon: Clock, color: 'text-primary' },
            { label: 'My Teams', value: favTeams.length, icon: Star, color: 'text-[#F59E0B]' },
            { label: 'Days Remaining', value: 37, icon: Calendar, color: 'text-accent' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="font-['JetBrains_Mono'] font-bold text-foreground text-xl leading-none">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left col (2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Next match countdown */}
            {nextFavMatch && (
              <div
                className="rounded-2xl border border-primary/20 p-6 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(26,86,219,0.08) 0%, rgba(26,86,219,0.04) 100%)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #1A56DB, transparent)' }} />
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Your Next Match</span>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <span className="text-4xl">{getTeam(nextFavMatch.homeTeam).flag}</span>
                      <span className="text-muted-foreground font-semibold">vs</span>
                      <span className="text-4xl">{getTeam(nextFavMatch.awayTeam).flag}</span>
                    </div>
                    <p className="font-semibold text-foreground">
                      {getTeam(nextFavMatch.homeTeam).name} vs {getTeam(nextFavMatch.awayTeam).name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-1">
                      <MapPin className="w-3 h-3" />
                      {nextFavMatch.venue}, {nextFavMatch.city}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(nextFavMatch.datetime), 'EEE, MMM d · HH:mm')} UTC
                    </p>
                  </div>
                  <div className="shrink-0">
                    <CountdownTimer targetDate={nextFavMatch.datetime} label="Kick-off in" size="md" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${getTeam(nextFavMatch.homeTeam).name} vs ${getTeam(nextFavMatch.awayTeam).name}`)}&dates=${new Date(nextFavMatch.datetime).toISOString().replace(/[-:]/g,'').split('.')[0]}Z/${new Date(new Date(nextFavMatch.datetime).getTime()+7200000).toISOString().replace(/[-:]/g,'').split('.')[0]}Z&location=${encodeURIComponent(nextFavMatch.venue)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center py-2 rounded-lg text-xs font-semibold bg-primary/15 text-primary border border-primary/25 hover:bg-primary/25 transition-colors"
                  >
                    + Google Calendar
                  </a>
                  <button
                    onClick={() => downloadICS([nextFavMatch], 'next-match.ics')}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-white/5 text-foreground border border-border hover:bg-white/10 transition-colors"
                  >
                    ↓ Download ICS
                  </button>
                </div>
              </div>
            )}

            {/* Today's Matches */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="font-['Barlow_Condensed'] font-bold uppercase text-foreground"
                  style={{ fontSize: '1.25rem' }}
                >
                  Today's Matches
                </h2>
                <button
                  onClick={() => onNavigate('schedule')}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  Full schedule <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {todayMatches.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-sm border border-border rounded-xl">
                    No matches today
                  </div>
                ) : (
                  todayMatches.map(m => (
                    <MatchCard key={m.id} match={m} highlighted={favTeams.includes(m.homeTeam) || favTeams.includes(m.awayTeam)} />
                  ))
                )}
              </div>
            </div>

            {/* Upcoming matches */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2
                  className="font-['Barlow_Condensed'] font-bold uppercase text-foreground"
                  style={{ fontSize: '1.25rem' }}
                >
                  Up Next
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                {upcomingMatches.slice(0, 4).map(m => (
                  <MatchCard key={m.id} match={m} compact highlighted={favTeams.includes(m.homeTeam) || favTeams.includes(m.awayTeam)} />
                ))}
              </div>
            </div>
          </div>

          {/* Right col (1/3) */}
          <div className="flex flex-col gap-6">

            {/* My Teams */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <Star className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="font-semibold text-foreground text-sm">My Teams</h3>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {favTeams.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No teams selected</p>
                ) : (
                  favTeams.map((code, i) => {
                    const t = getTeam(code);
                    const nextMatch = getMatchesByTeam(code).find(m => m.status === 'upcoming');
                    return (
                      <div key={code} className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <span className="text-2xl">{t.flag}</span>
                          {i === 0 && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center">
                              <Star className="w-2 h-2 text-white fill-white" />
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Group {t.group} · {t.confederation}
                          </p>
                          {nextMatch && (
                            <p className="text-xs text-primary mt-0.5">
                              Next: {format(new Date(nextMatch.datetime), 'MMM d')}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={() => downloadICS(
                    favTeams.flatMap(code => getMatchesByTeam(code)),
                    'my-teams-matches.ics'
                  )}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  ↓ Export My Teams' Matches
                </button>
              </div>
            </div>

            {/* Group Standings for fav teams */}
            {favGroups.slice(0, 2).map(group => (
              <div key={group} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground text-sm">Group {group} Standings</h3>
                  <span className="text-xs text-muted-foreground">● = Qualified</span>
                </div>
                <div className="p-4">
                  <GroupStandingsPreview group={group} />
                </div>
              </div>
            ))}

            {/* Quick export */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-foreground text-sm">Quick Export</h3>
              </div>
              <div className="p-4 flex flex-col gap-2">
                <button
                  onClick={() => downloadICS(MATCHES.filter(m => !m.homeTeam.startsWith('TBD')), 'wc2026-all.ics')}
                  className="flex items-center gap-2 w-full py-2.5 px-3 rounded-lg text-xs font-semibold border border-border hover:bg-white/5 text-foreground transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-muted-foreground" />
                  All Group Stage Matches
                </button>
                <button
                  onClick={() => downloadICS(MATCHES.filter(m => !m.stage.startsWith('Group') && !m.homeTeam.startsWith('TBD')), 'wc2026-knockout.ics')}
                  className="flex items-center gap-2 w-full py-2.5 px-3 rounded-lg text-xs font-semibold border border-border hover:bg-white/5 text-foreground transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-muted-foreground" />
                  Knockout Round Matches
                </button>
                <button
                  onClick={() => onNavigate('export')}
                  className="flex items-center gap-2 w-full py-2.5 px-3 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Open Export Center
                  <ChevronRight className="w-3 h-3 ml-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
