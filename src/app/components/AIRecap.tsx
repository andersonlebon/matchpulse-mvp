import { useState } from 'react';
import { Sparkles, ChevronRight, Star, TrendingUp, User, BarChart2, Loader2 } from 'lucide-react';
import { getMatchesByStatus } from '../data/matches';
import { getTeam } from '../data/teams';
import { getRecap, getAllRecaps, MatchRecap } from '../data/recaps';
import { format } from 'date-fns';
import { useFootball } from '../context/FootballContext';
import { useAiRecap } from '../../hooks/useAiRecap';

interface Props {
  favTeams: string[];
}

const EVENT_ICONS: Record<string, string> = {
  goal: '⚽',
  yellow: '🟨',
  red: '🟥',
  sub: '🔄',
  var: '📺',
  penalty: '⚽ (P)',
};

function StatBar({ label, home, away, homeVal, awayVal }: {
  label: string;
  home: number | string;
  away: number | string;
  homeVal: number;
  awayVal: number;
}) {
  const total = homeVal + awayVal || 1;
  const homePct = (homeVal / total) * 100;

  return (
    <div className="flex flex-col gap-1.5 mb-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-['JetBrains_Mono'] font-bold text-foreground">{home}</span>
        <span className="text-muted-foreground text-center">{label}</span>
        <span className="font-['JetBrains_Mono'] font-bold text-foreground">{away}</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden flex">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${homePct}%` }} />
        <div className="h-full bg-accent rounded-full flex-1" />
      </div>
    </div>
  );
}

function RecapCard({ recap, matchId, favTeams, onOpen }: {
  recap: MatchRecap;
  matchId: string;
  favTeams: string[];
  onOpen: () => void;
}) {
  const { matches, getTeam: getTeamLive } = useFootball();
  const match = matches.find(m => m.id === matchId);
  if (!match) return null;
  const home = getTeamLive(match.homeTeam);
  const away = getTeamLive(match.awayTeam);
  const isFav = favTeams.includes(match.homeTeam) || favTeams.includes(match.awayTeam);

  return (
    <button
      onClick={onOpen}
      className={`w-full text-left rounded-xl border overflow-hidden transition-all hover:border-primary/40 hover:scale-[1.01] group ${isFav ? 'border-primary/25' : 'border-border'}`}
    >
      <div className="bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">AI Recap</span>
          <span className="ml-auto text-xs text-muted-foreground">{match.stage}</span>
        </div>

        {/* Teams + score */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl">{home.flag}</span>
            <span className="text-sm font-semibold text-foreground truncate">{home.name}</span>
          </div>
          <div className="shrink-0 text-center">
            <span className="font-['JetBrains_Mono'] font-black text-foreground text-xl">
              {match.homeScore} – {match.awayScore}
            </span>
            <p className="text-xs text-muted-foreground">FT</p>
          </div>
          <div className="flex items-center gap-2 min-w-0 justify-end">
            <span className="text-sm font-semibold text-foreground truncate">{away.name}</span>
            <span className="text-2xl">{away.flag}</span>
          </div>
        </div>

        <p className="text-sm font-semibold text-foreground mb-1 leading-snug line-clamp-2">{recap.headline}</p>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{recap.summary.slice(0, 120)}...</p>

        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5">
            <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
            <span className="text-xs text-foreground font-semibold">{recap.mvp.name}</span>
            <span className="text-xs text-muted-foreground">MVP {recap.mvp.rating}/10</span>
          </div>
          <span className="ml-auto text-xs text-primary font-semibold group-hover:gap-2 flex items-center gap-1">
            Full Recap <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </button>
  );
}

function FullRecap({ recap, matchId, onClose }: { recap: MatchRecap; matchId: string; onClose: () => void }) {
  const [tab, setTab] = useState<'summary' | 'stats' | 'events' | 'ai'>('summary');
  const { matches, getTeam: getTeamLive } = useFootball();
  const aiRecap = useAiRecap();
  const [liveInsight, setLiveInsight] = useState<string | null>(null);
  const match = matches.find(m => m.id === matchId);
  if (!match) return null;
  const home = getTeamLive(match.homeTeam);
  const away = getTeamLive(match.awayTeam);

  async function generateLiveInsight() {
    const summary = `${home.name} ${match.homeScore}–${match.awayScore} ${away.name}. Stage: ${match.stage}. Venue: ${match.venue}. Headline: ${recap.headline}`;
    const result = await aiRecap.mutateAsync({ matchSummary: summary });
    setLiveInsight(result.content);
  }

  const tabs = [
    { id: 'summary' as const, label: 'Summary' },
    { id: 'stats' as const, label: 'Stats' },
    { id: 'events' as const, label: 'Timeline' },
    { id: 'ai' as const, label: 'AI Insight' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      {/* Header */}
      <div
        className="sticky top-0 z-10 border-b border-border px-4 py-3"
        style={{ background: 'rgba(4, 9, 26, 0.95)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-semibold">
            ← Back to Recaps
          </button>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">AI Recap</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
        {/* Match header */}
        <div
          className="rounded-2xl overflow-hidden mb-6 p-6"
          style={{ background: 'linear-gradient(135deg, #0A1528, #0F1F3D)' }}
        >
          <div className="text-center mb-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{match.stage} · {match.venue}</span>
            <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(match.datetime), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-5xl">{home.flag}</span>
              <p className="font-semibold text-foreground text-center">{home.name}</p>
              <div className="flex items-center gap-1">
                {[...Array(Math.round(recap.homeRating))].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
                ))}
              </div>
              <span className="font-['JetBrains_Mono'] text-xs text-muted-foreground">{recap.homeRating}/10</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="font-['JetBrains_Mono'] font-black text-foreground" style={{ fontSize: '3rem', lineHeight: 1 }}>
                {match.homeScore}–{match.awayScore}
              </span>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">Full Time</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-5xl">{away.flag}</span>
              <p className="font-semibold text-foreground text-center">{away.name}</p>
              <div className="flex items-center gap-1">
                {[...Array(Math.round(recap.awayRating))].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent" />
                ))}
              </div>
              <span className="font-['JetBrains_Mono'] text-xs text-muted-foreground">{recap.awayRating}/10</span>
            </div>
          </div>

          {/* Fan sentiment */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-2">Fan Prediction Split</p>
            <div className="flex rounded-full overflow-hidden h-3">
              <div className="bg-primary transition-all" style={{ width: `${recap.fanSentiment.home}%` }} title={`${home.name} ${recap.fanSentiment.home}%`} />
              <div className="bg-muted" style={{ width: `${recap.fanSentiment.draw}%` }} title={`Draw ${recap.fanSentiment.draw}%`} />
              <div className="bg-accent" style={{ width: `${recap.fanSentiment.away}%` }} title={`${away.name} ${recap.fanSentiment.away}%`} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{home.flag} {recap.fanSentiment.home}%</span>
              <span>Draw {recap.fanSentiment.draw}%</span>
              <span>{recap.fanSentiment.away}% {away.flag}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-secondary mb-6 w-fit">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t.id === 'ai' ? <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" />{t.label}</span> : t.label}
            </button>
          ))}
        </div>

        {/* Summary tab */}
        {tab === 'summary' && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="font-['Barlow_Condensed'] font-black uppercase text-foreground mb-3" style={{ fontSize: '1.25rem' }}>
                {recap.headline}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">{recap.summary}</p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Key Moments
              </h3>
              <div className="flex flex-col gap-2">
                {recap.keyMoments.map((moment, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                    <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground">{moment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* MVP */}
            <div className="p-4 rounded-xl border border-[#F59E0B]/25 bg-[#F59E0B]/5">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#F59E0B]">Man of the Match</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/25 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground">{recap.mvp.name}</p>
                  <p className="text-xs text-muted-foreground">{getTeam(recap.mvp.team).flag} {getTeam(recap.mvp.team).name}</p>
                </div>
                <div className="text-center">
                  <p className="font-['JetBrains_Mono'] font-black text-[#F59E0B] text-xl">{recap.mvp.rating}</p>
                  <p className="text-xs text-muted-foreground">/ 10</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{recap.mvp.reason}</p>
            </div>
          </div>
        )}

        {/* Stats tab */}
        {tab === 'stats' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="text-xl">{home.flag}</span>{home.name}
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold text-accent">
                {away.name}<span className="text-xl">{away.flag}</span>
              </span>
            </div>
            <StatBar label="Possession %" home={`${recap.homeStats.possession}%`} away={`${recap.awayStats.possession}%`} homeVal={recap.homeStats.possession} awayVal={recap.awayStats.possession} />
            <StatBar label="Shots" home={recap.homeStats.shots} away={recap.awayStats.shots} homeVal={recap.homeStats.shots} awayVal={recap.awayStats.shots} />
            <StatBar label="Shots on Target" home={recap.homeStats.shotsOnTarget} away={recap.awayStats.shotsOnTarget} homeVal={recap.homeStats.shotsOnTarget} awayVal={recap.awayStats.shotsOnTarget} />
            <StatBar label="xG" home={recap.homeStats.xG} away={recap.awayStats.xG} homeVal={recap.homeStats.xG} awayVal={recap.awayStats.xG} />
            <StatBar label="Corners" home={recap.homeStats.corners} away={recap.awayStats.corners} homeVal={recap.homeStats.corners} awayVal={recap.awayStats.corners} />
            <StatBar label="Fouls" home={recap.homeStats.fouls} away={recap.awayStats.fouls} homeVal={recap.homeStats.fouls} awayVal={recap.awayStats.fouls} />
            <StatBar label="Passes" home={recap.homeStats.passes} away={recap.awayStats.passes} homeVal={recap.homeStats.passes} awayVal={recap.awayStats.passes} />
            <StatBar label="Pass Accuracy" home={`${recap.homeStats.passAccuracy}%`} away={`${recap.awayStats.passAccuracy}%`} homeVal={recap.homeStats.passAccuracy} awayVal={recap.awayStats.passAccuracy} />
            <StatBar label="Yellow Cards" home={recap.homeStats.yellowCards} away={recap.awayStats.yellowCards} homeVal={recap.homeStats.yellowCards} awayVal={recap.awayStats.yellowCards} />
          </div>
        )}

        {/* Timeline tab */}
        {tab === 'events' && (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
            <div className="flex flex-col gap-3">
              {recap.events.map((ev, i) => {
                const team = getTeam(ev.team);
                const isHome = ev.team === match.homeTeam;
                return (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div className="w-14 text-right shrink-0">
                      <span className="font-['JetBrains_Mono'] text-xs font-bold text-muted-foreground">{ev.minute}'</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 z-10 ${ev.type === 'goal' ? 'bg-[#16A34A] border-[#16A34A]' : ev.type === 'yellow' ? 'bg-[#F59E0B] border-[#F59E0B]' : ev.type === 'red' ? 'bg-accent border-accent' : ev.type === 'var' ? 'bg-[#8B5CF6] border-[#8B5CF6]' : 'bg-primary border-primary'}`} />
                    <div className="flex-1 pb-3">
                      <div className="flex items-center gap-2">
                        <span>{EVENT_ICONS[ev.type]}</span>
                        <span className="font-semibold text-sm text-foreground">{ev.player}</span>
                        <span className="text-xs text-muted-foreground">{team.flag} {team.name}</span>
                      </div>
                      {ev.detail && <p className="text-xs text-muted-foreground mt-0.5 ml-6">{ev.detail}</p>}
                    </div>
                    {ev.type === 'goal' && (
                      <div className="text-right shrink-0">
                        <span className="font-['JetBrains_Mono'] text-sm font-bold text-[#16A34A]">Goal!</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Insight tab */}
        {tab === 'ai' && (
          <div className="flex flex-col gap-4">
            <div
              className="rounded-2xl p-5 border border-primary/20 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(26,86,219,0.08), rgba(26,86,219,0.03))' }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #1A56DB, transparent)' }} />
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-primary uppercase tracking-wider">AI Tactical Analysis</span>
                <span className="ml-auto text-xs text-muted-foreground bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Powered by MatchPulse AI</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{liveInsight ?? recap.aiInsight}</p>
              <button
                type="button"
                onClick={generateLiveInsight}
                disabled={aiRecap.isPending}
                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60"
              >
                {aiRecap.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {aiRecap.isPending ? 'Generating…' : 'Generate with OpenRouter AI'}
              </button>
              {aiRecap.isError && (
                <p className="mt-2 text-xs text-accent">{(aiRecap.error as Error).message}</p>
              )}
            </div>

            {/* Performance ratings */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-muted-foreground" />
                Team Performance Ratings
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  { team: home, rating: recap.homeRating },
                  { team: away, rating: recap.awayRating },
                ].map(({ team, rating }) => (
                  <div key={team.code} className="flex items-center gap-3">
                    <span className="text-xl">{team.flag}</span>
                    <span className="text-sm font-medium text-foreground w-32 truncate">{team.name}</span>
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(rating / 10) * 100}%`,
                          background: rating >= 8 ? '#16A34A' : rating >= 7 ? '#1A56DB' : rating >= 6 ? '#F59E0B' : '#E53535'
                        }}
                      />
                    </div>
                    <span className="font-['JetBrains_Mono'] font-bold text-foreground text-sm w-8 text-right">{rating}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary border border-border">
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                AI recaps use OpenRouter when OPENROUTER_API_KEY is configured on the server. Static recaps are shown as fallback.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AIRecap({ favTeams }: Props) {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const { matches } = useFootball();
  const completedMatches = matches.filter(m => m.status === 'completed');
  const recaps = getAllRecaps();

  const favRecaps = recaps.filter(r => {
    const m = matches.find(x => x.id === r.matchId);
    return m && (favTeams.includes(m.homeTeam) || favTeams.includes(m.awayTeam));
  });
  const otherRecaps = recaps.filter(r => !favRecaps.includes(r));

  if (selectedMatchId) {
    const recap = getRecap(selectedMatchId);
    if (recap) {
      return <FullRecap recap={recap} matchId={selectedMatchId} onClose={() => setSelectedMatchId(null)} />;
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/15 text-primary border border-primary/25 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              AI Feature
            </span>
          </div>
          <h1
            className="font-['Barlow_Condensed'] font-black uppercase text-foreground"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.1 }}
          >
            AI Match Recaps
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Tactical analysis, key moments, stats, and AI insights for every completed match
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex gap-4 mb-8 p-4 rounded-xl bg-card border border-border">
          {[
            { value: completedMatches.length, label: 'Matches Completed' },
            { value: recaps.length, label: 'Recaps Available' },
            { value: `${completedMatches.length - recaps.length}`, label: 'Processing...' },
          ].map(s => (
            <div key={s.label} className="flex-1 text-center">
              <p className="font-['JetBrains_Mono'] font-black text-foreground text-xl">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Fav team recaps */}
        {favRecaps.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <h2 className="font-['Barlow_Condensed'] font-bold uppercase text-foreground" style={{ fontSize: '1.1rem' }}>
                Your Teams
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {favRecaps.map(r => (
                <RecapCard
                  key={r.matchId}
                  recap={r}
                  matchId={r.matchId}
                  favTeams={favTeams}
                  onOpen={() => setSelectedMatchId(r.matchId)}
                />
              ))}
            </div>
          </div>
        )}

        {/* All recaps */}
        <div>
          <h2 className="font-['Barlow_Condensed'] font-bold uppercase text-muted-foreground mb-4" style={{ fontSize: '1rem' }}>
            All Recaps — {recaps.length} Available
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {(favRecaps.length > 0 ? otherRecaps : recaps).map(r => (
              <RecapCard
                key={r.matchId}
                recap={r}
                matchId={r.matchId}
                favTeams={favTeams}
                onOpen={() => setSelectedMatchId(r.matchId)}
              />
            ))}
          </div>
        </div>

        {/* Upcoming recaps */}
        {completedMatches.length > recaps.length && (
          <div className="mt-6 p-4 rounded-xl border border-border bg-card flex items-center gap-4">
            <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">More Recaps Processing</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {completedMatches.length - recaps.length} match recap{completedMatches.length - recaps.length !== 1 ? 's' : ''} will be available within 30 minutes of final whistle.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
