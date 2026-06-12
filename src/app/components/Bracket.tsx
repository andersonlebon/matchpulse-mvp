import { useState } from 'react';
import { Trophy, Lock, ChevronRight } from 'lucide-react';
import { getTeam } from '../data/teams';
import { MATCHES } from '../data/matches';
import { format } from 'date-fns';

interface Props {
  favTeams: string[];
}

interface BracketSlot {
  id: string;
  home: string;
  away: string;
  datetime: string;
  venue: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'completed';
  winner?: string;
}

function buildBracketSlots(): { r32: BracketSlot[]; r16: BracketSlot[]; qf: BracketSlot[]; sf: BracketSlot[]; final: BracketSlot; thirdPlace: BracketSlot } {
  const r32 = MATCHES.filter(m => m.stage === 'Round of 32').map((m, i) => ({
    id: m.id,
    home: m.homeTeam,
    away: m.awayTeam,
    datetime: m.datetime,
    venue: `${m.venue}, ${m.city}`,
    homeScore: m.homeScore,
    awayScore: m.awayScore,
    status: m.status,
  }));

  const r16 = MATCHES.filter(m => m.stage === 'Round of 16').map(m => ({
    id: m.id,
    home: m.homeTeam,
    away: m.awayTeam,
    datetime: m.datetime,
    venue: `${m.venue}, ${m.city}`,
    status: m.status,
  }));

  const qf = MATCHES.filter(m => m.stage === 'Quarter-Final').map(m => ({
    id: m.id,
    home: m.homeTeam,
    away: m.awayTeam,
    datetime: m.datetime,
    venue: `${m.venue}, ${m.city}`,
    status: m.status,
  }));

  const sf = MATCHES.filter(m => m.stage === 'Semi-Final').map(m => ({
    id: m.id,
    home: m.homeTeam,
    away: m.awayTeam,
    datetime: m.datetime,
    venue: `${m.venue}, ${m.city}`,
    status: m.status,
  }));

  const finalMatch = MATCHES.find(m => m.stage === 'Final')!;
  const tpMatch = MATCHES.find(m => m.stage === 'Third Place')!;

  return {
    r32,
    r16,
    qf,
    sf,
    final: { id: finalMatch.id, home: finalMatch.homeTeam, away: finalMatch.awayTeam, datetime: finalMatch.datetime, venue: `${finalMatch.venue}, ${finalMatch.city}`, status: finalMatch.status },
    thirdPlace: { id: tpMatch.id, home: tpMatch.homeTeam, away: tpMatch.awayTeam, datetime: tpMatch.datetime, venue: `${tpMatch.venue}, ${tpMatch.city}`, status: tpMatch.status },
  };
}

function SlotTeam({ code, score, isWinner }: { code: string; score?: number; isWinner?: boolean }) {
  const isTBD = code === 'TBD';
  const team = isTBD ? null : getTeam(code);

  return (
    <div className={`flex items-center justify-between px-2.5 py-1.5 ${isWinner ? 'bg-primary/10' : ''}`}>
      <div className="flex items-center gap-1.5 min-w-0">
        {isTBD ? (
          <>
            <span className="text-sm opacity-30">•</span>
            <span className="text-xs text-muted-foreground truncate">TBD</span>
          </>
        ) : (
          <>
            <span className="text-sm leading-none">{team!.flag}</span>
            <span className={`text-xs font-medium truncate ${isWinner ? 'text-foreground' : 'text-muted-foreground'}`}>
              {team!.name.length > 12 ? team!.code : team!.name}
            </span>
          </>
        )}
      </div>
      {score !== undefined && (
        <span className={`font-['JetBrains_Mono'] text-xs font-bold ml-2 shrink-0 ${isWinner ? 'text-foreground' : 'text-muted-foreground'}`}>
          {score}
        </span>
      )}
    </div>
  );
}

function MatchSlot({ slot, favTeams, compact = false }: { slot: BracketSlot; favTeams: string[]; compact?: boolean }) {
  const isTBD = slot.home === 'TBD';
  const isFav = !isTBD && (favTeams.includes(slot.home) || favTeams.includes(slot.away));
  const homeWon = slot.status === 'completed' && slot.homeScore !== undefined && slot.awayScore !== undefined && slot.homeScore > slot.awayScore;
  const awayWon = slot.status === 'completed' && slot.homeScore !== undefined && slot.awayScore !== undefined && slot.awayScore > slot.homeScore;

  return (
    <div className={`rounded-lg border overflow-hidden transition-all ${
      isFav ? 'border-primary/40' : isTBD ? 'border-border opacity-50' : 'border-border hover:border-white/20'
    } ${compact ? 'min-w-[140px]' : 'min-w-[160px]'}`}>
      <div className={`text-center py-1 border-b border-border ${
        slot.status === 'live' ? 'bg-accent/10' : 'bg-secondary'
      }`}>
        {slot.status === 'live' ? (
          <span className="text-accent text-xs font-bold flex items-center justify-center gap-1">
            <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />LIVE
          </span>
        ) : slot.status === 'completed' ? (
          <span className="text-xs text-muted-foreground font-medium">FT</span>
        ) : (
          <span className="text-xs text-muted-foreground">{format(new Date(slot.datetime), 'MMM d')}</span>
        )}
      </div>
      <div className="bg-card divide-y divide-border">
        <SlotTeam code={slot.home} score={slot.homeScore} isWinner={homeWon} />
        <SlotTeam code={slot.away} score={slot.awayScore} isWinner={awayWon} />
      </div>
    </div>
  );
}

function RoundColumn({ title, slots, favTeams, dateRange }: {
  title: string;
  slots: BracketSlot[];
  favTeams: string[];
  dateRange?: string;
}) {
  return (
    <div className="flex flex-col gap-2 min-w-[180px]">
      <div className="text-center mb-1">
        <p className="font-['Barlow_Condensed'] font-bold uppercase text-foreground text-sm tracking-wide">{title}</p>
        {dateRange && <p className="text-xs text-muted-foreground">{dateRange}</p>}
      </div>
      <div className="flex flex-col justify-around flex-1 gap-3">
        {slots.map(slot => (
          <MatchSlot key={slot.id} slot={slot} favTeams={favTeams} />
        ))}
      </div>
    </div>
  );
}

export function Bracket({ favTeams }: Props) {
  const [view, setView] = useState<'bracket' | 'list'>('list');
  const { r32, r16, qf, sf, final, thirdPlace } = buildBracketSlots();

  const STAGE_DATES: Record<string, string> = {
    'Round of 32': 'Jun 30 – Jul 3',
    'Round of 16': 'Jul 5 – Jul 7',
    'Quarter-Final': 'Jul 9 – Jul 11',
    'Semi-Final': 'Jul 14 – Jul 15',
    'Third Place': 'Jul 18',
    'Final': 'Jul 19',
  };

  const stages = [
    { key: 'Round of 32', slots: r32, cols: 2 },
    { key: 'Round of 16', slots: r16, cols: 2 },
    { key: 'Quarter-Final', slots: qf, cols: 2 },
    { key: 'Semi-Final', slots: sf, cols: 1 },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1
              className="font-['Barlow_Condensed'] font-black uppercase text-foreground"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.1 }}
            >
              Knockout Bracket
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Round of 32 → Round of 16 → Quarter-Finals → Semis → Final
            </p>
          </div>
          <div className="flex gap-1 p-1 rounded-xl bg-secondary w-fit">
            {(['list', 'bracket'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${view === v ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>
                {v === 'list' ? 'Stage View' : 'Bracket'}
              </button>
            ))}
          </div>
        </div>

        {/* Final + Third Place highlight */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Final */}
          <div
            className="relative overflow-hidden rounded-2xl border border-[#F59E0B]/30 p-5"
            style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))' }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #F59E0B, transparent)' }} />
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#F59E0B]">The Final</span>
              <span className="ml-auto text-xs text-muted-foreground">Jul 19 · MetLife Stadium, NJ</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-center gap-2 flex-1">
                <span className="text-4xl">{final.home === 'TBD' ? '🏆' : getTeam(final.home).flag}</span>
                <span className="text-sm font-semibold text-foreground text-center">
                  {final.home === 'TBD' ? 'TBD' : getTeam(final.home).name}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-['JetBrains_Mono'] font-black text-muted-foreground text-2xl">vs</span>
                <Lock className="w-4 h-4 text-muted-foreground opacity-50" />
              </div>
              <div className="flex flex-col items-center gap-2 flex-1">
                <span className="text-4xl">{final.away === 'TBD' ? '🏆' : getTeam(final.away).flag}</span>
                <span className="text-sm font-semibold text-foreground text-center">
                  {final.away === 'TBD' ? 'TBD' : getTeam(final.away).name}
                </span>
              </div>
            </div>
          </div>

          {/* Third Place */}
          <div className="rounded-2xl border border-border p-5 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🥉</span>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Third Place Play-off</span>
              <span className="ml-auto text-xs text-muted-foreground">Jul 18 · Miami</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              {[thirdPlace.home, thirdPlace.away].map((code, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-3xl">{code === 'TBD' ? '•' : getTeam(code).flag}</span>
                  <span className="text-sm font-medium text-muted-foreground text-center">
                    {code === 'TBD' ? 'TBD' : getTeam(code).name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {view === 'list' && (
          <div className="flex flex-col gap-8">
            {stages.map(stage => (
              <div key={stage.key}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-['Barlow_Condensed'] font-bold uppercase text-foreground" style={{ fontSize: '1.25rem' }}>
                    {stage.key}
                  </h2>
                  <span className="text-xs text-muted-foreground border border-border px-2 py-0.5 rounded">
                    {STAGE_DATES[stage.key]}
                  </span>
                  <span className="text-xs text-muted-foreground">{stage.slots.length} matches</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {stage.slots.map(slot => {
                    const isTBD = slot.home === 'TBD';
                    const isFav = !isTBD && (favTeams.includes(slot.home) || favTeams.includes(slot.away));
                    return (
                      <div key={slot.id} className={`rounded-xl border overflow-hidden ${isFav ? 'border-primary/30' : 'border-border'}`}>
                        <div className={`px-3 py-2 border-b border-border flex items-center justify-between ${isFav ? 'bg-primary/5' : 'bg-card'}`}>
                          <span className="text-xs text-muted-foreground">{format(new Date(slot.datetime), 'MMM d · HH:mm')} UTC</span>
                          {isFav && <span className="text-xs text-primary font-semibold">★ Fav</span>}
                        </div>
                        <div className="bg-background/50 divide-y divide-border">
                          {[
                            { code: slot.home, score: slot.homeScore },
                            { code: slot.away, score: slot.awayScore },
                          ].map(({ code, score }, i) => {
                            const team = code === 'TBD' ? null : getTeam(code);
                            return (
                              <div key={i} className="flex items-center justify-between px-3 py-2.5">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-lg">{team?.flag ?? '?'}</span>
                                  <span className="text-sm font-medium text-foreground truncate">
                                    {team ? (team.name.length > 15 ? team.code : team.name) : 'TBD'}
                                  </span>
                                </div>
                                {score !== undefined && (
                                  <span className="font-['JetBrains_Mono'] font-bold text-foreground text-sm ml-2">{score}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="px-3 py-1.5 bg-secondary/50">
                          <span className="text-xs text-muted-foreground truncate block">{slot.venue.split(',')[0]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'bracket' && (
          <div>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-[900px] p-4">
                <RoundColumn title="R32" slots={r32.slice(0, 8)} favTeams={favTeams} dateRange="Jun 30 – Jul 1" />
                <div className="flex items-center">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <RoundColumn title="R16" slots={r16.slice(0, 4)} favTeams={favTeams} dateRange="Jul 5 – 6" />
                <div className="flex items-center">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <RoundColumn title="QF" slots={qf.slice(0, 2)} favTeams={favTeams} dateRange="Jul 9 – 10" />
                <div className="flex items-center">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <RoundColumn title="SF" slots={sf.slice(0, 1)} favTeams={favTeams} dateRange="Jul 14" />
                <div className="flex items-center">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex flex-col items-center justify-center gap-2 min-w-[180px]">
                  <p className="font-['Barlow_Condensed'] font-bold uppercase text-[#F59E0B] text-sm tracking-wide flex items-center gap-1">
                    <Trophy className="w-4 h-4" />FINAL
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">Jul 19</p>
                  <MatchSlot slot={final} favTeams={favTeams} />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">← Scroll to see full bracket → (only left half shown)</p>
          </div>
        )}

        {/* Tournament path info */}
        <div className="mt-8 p-4 rounded-xl border border-border bg-card">
          <h3 className="font-semibold text-sm text-foreground mb-3">Qualification Path</h3>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {[
              { label: '16 Groups', color: 'text-muted-foreground' },
              { label: '→', color: 'text-muted-foreground' },
              { label: 'Round of 32', color: 'text-primary' },
              { label: '→', color: 'text-muted-foreground' },
              { label: 'Round of 16', color: 'text-primary' },
              { label: '→', color: 'text-muted-foreground' },
              { label: 'Quarter-Finals', color: 'text-[#F59E0B]' },
              { label: '→', color: 'text-muted-foreground' },
              { label: 'Semi-Finals', color: 'text-accent' },
              { label: '→', color: 'text-muted-foreground' },
              { label: '🏆 Final', color: 'text-[#F59E0B] font-bold' },
            ].map((step, i) => (
              <span key={i} className={step.color}>{step.label}</span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Top 2 from each group + 8 best 3rd-place teams = 32 teams advance to knockout rounds.
          </p>
        </div>
      </div>
    </div>
  );
}
