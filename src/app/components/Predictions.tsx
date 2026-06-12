import { useState, useMemo } from 'react';
import { Trophy, Star, ChevronDown, ChevronUp, CheckCircle, Users, TrendingUp, Award, Lock } from 'lucide-react';
import { getTeam, getGroupTeams, GROUPS, getAllTeams } from '../data/teams';
import {
  PredictionSet, EMPTY_PREDICTIONS, POINTS_TABLE,
  MOCK_LEADERBOARD, POPULAR_PICKS, ALL_GROUPS
} from '../data/predictions';

interface Props {
  favTeams: string[];
  userName: string;
}

type PredTab = 'groups' | 'champion' | 'leaderboard';

const KNOCKOUT_ROUNDS = [
  { key: 'r32', label: 'Round of 32', slots: 16, points: POINTS_TABLE.roundOf32 },
  { key: 'r16', label: 'Round of 16', slots: 8, points: POINTS_TABLE.roundOf16 },
  { key: 'qf', label: 'Quarter-Final', slots: 4, points: POINTS_TABLE.quarterFinal },
  { key: 'sf', label: 'Semi-Final', slots: 2, points: POINTS_TABLE.semiFinal },
];

function GroupPicker({
  group, prediction, onUpdate
}: {
  group: string;
  prediction: { first: string; second: string } | undefined;
  onUpdate: (first: string, second: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const teams = getGroupTeams(group);
  const first = prediction?.first;
  const second = prediction?.second;
  const isDone = first && second;

  function selectTeam(code: string, slot: 'first' | 'second') {
    if (slot === 'first') {
      const newSecond = second === code ? '' : (second ?? '');
      onUpdate(code, newSecond);
    } else {
      const newFirst = first === code ? '' : (first ?? '');
      onUpdate(newFirst, code);
    }
  }

  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${isDone ? 'border-[#16A34A]/30' : 'border-border'}`}>
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-white/[0.02] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <span className="font-['Barlow_Condensed'] font-bold text-muted-foreground uppercase" style={{ fontSize: '1rem' }}>
            Group {group}
          </span>
          <div className="flex gap-0.5">
            {teams.map(t => <span key={t.code} className="text-base">{t.flag}</span>)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isDone ? (
            <div className="flex items-center gap-1.5 text-xs text-[#16A34A]">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{getTeam(first).flag} {getTeam(first).name}</span>
              <span className="text-muted-foreground">·</span>
              <span>{getTeam(second).flag} {getTeam(second).name}</span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Pick top 2</span>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-border bg-background/40 p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 1st Place */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center text-xs font-black text-black">1</span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Group Winner</span>
                <span className="text-xs text-muted-foreground ml-auto">+{POINTS_TABLE.groupFirst} pts</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {teams.map(t => (
                  <button
                    key={t.code}
                    onClick={() => selectTeam(t.code, 'first')}
                    disabled={second === t.code}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all disabled:opacity-30 ${
                      first === t.code
                        ? 'border-[#F59E0B]/50 bg-[#F59E0B]/10 text-foreground'
                        : 'border-border hover:border-white/20 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-xl">{t.flag}</span>
                    <span className="font-medium">{t.name}</span>
                    {first === t.code && <CheckCircle className="w-3.5 h-3.5 text-[#F59E0B] ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
            {/* 2nd Place */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-black text-foreground">2</span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Runner-up</span>
                <span className="text-xs text-muted-foreground ml-auto">+{POINTS_TABLE.groupSecond} pts</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {teams.map(t => (
                  <button
                    key={t.code}
                    onClick={() => selectTeam(t.code, 'second')}
                    disabled={first === t.code}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all disabled:opacity-30 ${
                      second === t.code
                        ? 'border-primary/50 bg-primary/10 text-foreground'
                        : 'border-border hover:border-white/20 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="text-xl">{t.flag}</span>
                    <span className="font-medium">{t.name}</span>
                    {second === t.code && <CheckCircle className="w-3.5 h-3.5 text-primary ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChampionPicker({ champion, onSelect }: { champion: string; onSelect: (code: string) => void }) {
  const [search, setSearch] = useState('');
  const teams = getAllTeams();
  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase())
  );

  const top = Object.entries(POPULAR_PICKS)
    .sort((a, b) => b[1] - a[1])
    .map(([code, pct]) => ({ team: getTeam(code), pct }));

  return (
    <div className="flex flex-col gap-6">
      {/* Champion pick hero */}
      {champion ? (
        <div
          className="relative overflow-hidden rounded-2xl p-8 text-center border border-[#F59E0B]/30"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))' }}
        >
          <div className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(rgba(245,158,11,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.1) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
          <div className="relative">
            <Trophy className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" />
            <p className="text-xs uppercase tracking-widest text-[#F59E0B] mb-2">Your World Cup Champion</p>
            <div className="text-6xl mb-3">{getTeam(champion).flag}</div>
            <p className="font-['Barlow_Condensed'] font-black uppercase text-foreground" style={{ fontSize: '2rem' }}>
              {getTeam(champion).name}
            </p>
            <p className="text-sm text-muted-foreground mt-1">+{POINTS_TABLE.champion} points if correct</p>
            <button
              onClick={() => onSelect('')}
              className="mt-4 text-xs text-muted-foreground hover:text-foreground underline transition-colors"
            >
              Change pick
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border p-6 text-center bg-card">
          <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="font-semibold text-foreground mb-1">Who Lifts the Trophy?</p>
          <p className="text-sm text-muted-foreground">Pick your World Cup 2026 champion below</p>
        </div>
      )}

      {/* Fan picks popularity */}
      <div>
        <h3 className="font-['Barlow_Condensed'] font-bold uppercase text-muted-foreground mb-3" style={{ fontSize: '1rem' }}>
          Fan Favourite Picks
        </h3>
        <div className="flex flex-col gap-2">
          {top.slice(0, 6).map(({ team, pct }) => (
            <button
              key={team.code}
              onClick={() => onSelect(team.code)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                champion === team.code
                  ? 'border-[#F59E0B]/50 bg-[#F59E0B]/10'
                  : 'border-border hover:border-white/20 hover:bg-white/[0.02]'
              }`}
            >
              <span className="text-2xl">{team.flag}</span>
              <span className="text-sm font-semibold text-foreground flex-1 text-left">{team.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: champion === team.code ? '#F59E0B' : '#1A56DB' }}
                  />
                </div>
                <span className="font-['JetBrains_Mono'] text-xs text-muted-foreground w-10 text-right">{pct}%</span>
              </div>
              {champion === team.code && <CheckCircle className="w-4 h-4 text-[#F59E0B] shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* All teams */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-['Barlow_Condensed'] font-bold uppercase text-muted-foreground" style={{ fontSize: '1rem' }}>
            All 48 Teams
          </h3>
        </div>
        <input
          type="text"
          placeholder="Search team..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all text-sm mb-3"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {filtered.map(t => (
            <button
              key={t.code}
              onClick={() => onSelect(t.code)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                champion === t.code
                  ? 'border-[#F59E0B]/50 bg-[#F59E0B]/10'
                  : 'border-border hover:border-white/20 hover:bg-white/[0.02]'
              }`}
            >
              <span className="text-2xl">{t.flag}</span>
              <span className="text-xs font-medium text-foreground text-center leading-tight">{t.name}</span>
              {champion === t.code && <CheckCircle className="w-3 h-3 text-[#F59E0B]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Leaderboard({ userName, myPoints }: { userName: string; myPoints: number }) {
  const myRank = MOCK_LEADERBOARD.findIndex(e => e.points < myPoints) + 1 || MOCK_LEADERBOARD.length + 1;

  return (
    <div className="flex flex-col gap-6">
      {/* My rank card */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 border border-primary/25"
        style={{ background: 'linear-gradient(135deg, rgba(26,86,219,0.08), rgba(26,86,219,0.03))' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary mb-1">Your Ranking</p>
            <p className="font-['Barlow_Condensed'] font-black text-foreground" style={{ fontSize: '2rem' }}>
              #{myRank} of {MOCK_LEADERBOARD.length + 1}
            </p>
            <p className="text-sm text-muted-foreground">{userName}</p>
          </div>
          <div className="text-right">
            <p className="font-['JetBrains_Mono'] font-black text-foreground" style={{ fontSize: '2.5rem', lineHeight: 1 }}>
              {myPoints}
            </p>
            <p className="text-xs text-muted-foreground">points</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Max Possible', value: '226' },
            { label: 'Groups Done', value: '0/16' },
            { label: 'Accuracy', value: '—' },
          ].map(s => (
            <div key={s.label} className="bg-white/5 rounded-lg p-2 text-center">
              <p className="font-['JetBrains_Mono'] font-bold text-foreground text-sm">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Points breakdown */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-semibold text-sm text-foreground">Points System</h3>
        </div>
        <div className="p-4 grid grid-cols-2 gap-2">
          {[
            { label: 'Group Winner', pts: POINTS_TABLE.groupFirst },
            { label: 'Group Runner-up', pts: POINTS_TABLE.groupSecond },
            { label: 'Round of 32', pts: POINTS_TABLE.roundOf32 },
            { label: 'Round of 16', pts: POINTS_TABLE.roundOf16 },
            { label: 'Quarter-Final', pts: POINTS_TABLE.quarterFinal },
            { label: 'Semi-Final', pts: POINTS_TABLE.semiFinal },
            { label: 'Champion', pts: POINTS_TABLE.champion },
          ].map(p => (
            <div key={p.label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary">
              <span className="text-xs text-muted-foreground">{p.label}</span>
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-primary">+{p.pts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Global leaderboard */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="font-['Barlow_Condensed'] font-bold uppercase text-foreground" style={{ fontSize: '1.1rem' }}>
            Global Leaderboard
          </h3>
          <span className="text-xs text-muted-foreground ml-auto">Live · 52,841 players</span>
        </div>
        <div className="flex flex-col gap-1">
          {MOCK_LEADERBOARD.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                entry.rank <= 3 ? 'border-[#F59E0B]/20 bg-[#F59E0B]/5' : 'border-transparent hover:bg-white/[0.02]'
              }`}
            >
              <div className="w-7 text-center shrink-0">
                {entry.rank <= 3 ? (
                  <span className="text-lg">
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                  </span>
                ) : (
                  <span className="font-['JetBrains_Mono'] text-sm text-muted-foreground">#{entry.rank}</span>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                {entry.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{entry.name}</p>
                <p className="text-xs text-muted-foreground">
                  Champion: {getTeam(entry.champion).flag} {getTeam(entry.champion).name}
                </p>
              </div>
              <span className="font-['JetBrains_Mono'] font-bold text-foreground text-sm">{entry.points}</span>
            </div>
          ))}

          {/* User's position */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-primary/25 bg-primary/10 mt-1">
            <div className="w-7 text-center shrink-0">
              <span className="font-['JetBrains_Mono'] text-sm text-primary">#{myRank}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{userName} <span className="text-primary text-xs">(you)</span></p>
              <p className="text-xs text-muted-foreground">Complete predictions to climb the ranks</p>
            </div>
            <span className="font-['JetBrains_Mono'] font-bold text-primary text-sm">{myPoints}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Predictions({ favTeams, userName }: Props) {
  const [tab, setTab] = useState<PredTab>('groups');
  const [predictions, setPredictions] = useState<PredictionSet>(EMPTY_PREDICTIONS);
  const [saved, setSaved] = useState(false);

  const completedGroups = Object.keys(predictions.groups).filter(
    g => predictions.groups[g]?.first && predictions.groups[g]?.second
  ).length;

  const myPoints = completedGroups * 2; // placeholder: 2 pts per completed group prediction for demo

  function updateGroupPrediction(group: string, first: string, second: string) {
    setPredictions(prev => ({
      ...prev,
      groups: { ...prev.groups, [group]: { group, first, second } },
    }));
    setSaved(false);
  }

  function savePredictions() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const TABS: { id: PredTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'groups', label: 'Group Stage', icon: Trophy },
    { id: 'champion', label: 'Champion Pick', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/15 text-primary border border-primary/25">
                Phase 2
              </span>
              <span className="text-xs text-muted-foreground">For entertainment only · No wagering</span>
            </div>
            <h1
              className="font-['Barlow_Condensed'] font-black uppercase text-foreground"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.1 }}
            >
              Tournament Predictions
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Pick your group winners, bracket results, and ultimate champion
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="font-['JetBrains_Mono'] font-black text-foreground" style={{ fontSize: '1.75rem', lineHeight: 1 }}>{myPoints}</p>
              <p className="text-xs text-muted-foreground">your points</p>
            </div>
            <button
              onClick={savePredictions}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                saved
                  ? 'bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/30'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {saved ? '✓ Saved!' : 'Save Picks'}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prediction Progress</span>
            <span className="font-['JetBrains_Mono'] text-xs text-foreground">{completedGroups}/16 groups · {predictions.champion ? '1/1 champion' : '0/1 champion'}</span>
          </div>
          <div className="flex gap-1">
            {ALL_GROUPS.map(g => {
              const done = predictions.groups[g]?.first && predictions.groups[g]?.second;
              return (
                <div key={g} className={`flex-1 h-2 rounded-sm transition-colors ${done ? 'bg-[#16A34A]' : 'bg-secondary'}`} />
              );
            })}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 rounded-sm bg-secondary overflow-hidden">
              <div
                className="h-full rounded-sm bg-[#F59E0B] transition-all"
                style={{ width: predictions.champion ? '100%' : '0%' }}
              />
            </div>
            <span className="text-xs text-muted-foreground">Champion pick</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-secondary mb-6 w-fit">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === t.id ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Group Stage */}
        {tab === 'groups' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                Select the top 2 finishers in each group. Worth{' '}
                <span className="text-primary font-semibold">+{POINTS_TABLE.groupFirst} pts</span> for 1st,{' '}
                <span className="text-primary font-semibold">+{POINTS_TABLE.groupSecond} pts</span> for 2nd.
              </p>
              <span className="text-xs font-semibold text-[#16A34A]">{completedGroups}/16 done</span>
            </div>
            {ALL_GROUPS.map(g => (
              <GroupPicker
                key={g}
                group={g}
                prediction={predictions.groups[g]}
                onUpdate={(first, second) => updateGroupPrediction(g, first, second)}
              />
            ))}

            {/* Knockout teaser */}
            <div className="mt-4 p-5 rounded-xl border border-border bg-card flex items-center gap-4">
              <Lock className="w-8 h-8 text-muted-foreground opacity-40 shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-sm">Knockout Bracket Predictions</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Unlocks after Group Stage concludes on June 28.
                  Predict Round of 32, 16, Quarters, Semis, and Final.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Champion pick */}
        {tab === 'champion' && (
          <ChampionPicker
            champion={predictions.champion}
            onSelect={(code) => {
              setPredictions(p => ({ ...p, champion: code }));
              setSaved(false);
            }}
          />
        )}

        {/* Leaderboard */}
        {tab === 'leaderboard' && (
          <Leaderboard userName={userName} myPoints={myPoints} />
        )}
      </div>
    </div>
  );
}
