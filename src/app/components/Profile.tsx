import { useState } from 'react';
import { User, Star, Download, Calendar, Bell, Edit2, Check, ChevronRight, LogOut, Shield, Trash2, Copy } from 'lucide-react';
import { getTeam, getAllTeams } from '../data/teams';
import { getMatchesByTeam, MATCHES } from '../data/matches';
import { downloadICS } from '../utils/icsGenerator';
import { format } from 'date-fns';
import logoImg from '../../imports/MatchPulse_Symbol.png';

interface Props {
  user: { name: string; email: string };
  favTeams: string[];
  onUpdateTeams: (teams: string[]) => void;
  onUpdateName?: (name: string) => void | Promise<void>;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

const STAT_CARDS = (favTeams: string[], user: { name: string; email: string }) => [
  {
    icon: Calendar,
    label: 'Matches Synced',
    value: String(MATCHES.filter(m => m.status !== 'completed' && m.homeTeam !== 'TBD').length),
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Download,
    label: 'Exports Done',
    value: '3',
    color: 'text-[#16A34A]',
    bg: 'bg-[#16A34A]/10',
  },
  {
    icon: Star,
    label: 'Teams Followed',
    value: String(favTeams.length),
    color: 'text-[#F59E0B]',
    bg: 'bg-[#F59E0B]/10',
  },
  {
    icon: Bell,
    label: 'Reminders Set',
    value: favTeams.length > 0 ? String(favTeams.flatMap(c => getMatchesByTeam(c).filter(m => m.status === 'upcoming')).length) : '0',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
];

function TeamPicker({ favTeams, onSave }: { favTeams: string[]; onSave: (teams: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([...favTeams]);
  const [saved, setSaved] = useState(false);
  const allTeams = getAllTeams();

  function toggle(code: string) {
    setSelected(prev => {
      if (prev.includes(code)) return prev.filter(c => c !== code);
      if (prev.length >= 3) return [...prev.slice(1), code];
      return [...prev, code];
    });
    setSaved(false);
  }

  function save() {
    onSave(selected);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {allTeams.map(t => {
          const rank = selected.indexOf(t.code);
          const isSelected = rank !== -1;
          return (
            <button
              key={t.code}
              onClick={() => toggle(t.code)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                isSelected ? 'border-primary/50 bg-primary/10' : 'border-border hover:border-white/20 hover:bg-white/[0.02]'
              }`}
            >
              <span className="text-xl">{t.flag}</span>
              <span className={`text-xs font-medium truncate ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>{t.name}</span>
              {isSelected && (
                <span className={`ml-auto shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-bold ${rank === 0 ? 'bg-[#F59E0B]' : 'bg-primary'}`}>
                  {rank === 0 ? '★' : rank + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <button
        onClick={save}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${saved ? 'bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/30' : 'bg-primary text-white hover:bg-primary/90'}`}
      >
        {saved ? '✓ Teams Updated!' : 'Save Teams'}
      </button>
    </div>
  );
}

export function Profile({ user, favTeams, onUpdateTeams, onUpdateName, onLogout, onNavigate }: Props) {
  const [editingTeams, setEditingTeams] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user.name);
  const [nameSaved, setNameSaved] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const stats = STAT_CARDS(favTeams, user);
  const userId = `MP-${user.email.split('@')[0].toUpperCase().slice(0, 6)}-2026`;

  async function saveName() {
    const trimmed = displayName.trim();
    if (!trimmed) return;
    setEditingName(false);
    setNameSaved(true);
    await onUpdateName?.(trimmed);
    setTimeout(() => setNameSaved(false), 2000);
  }

  function copyId() {
    navigator.clipboard.writeText(userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  }

  const quickLinks = [
    { label: 'Notification Settings', page: 'notifications', icon: Bell },
    { label: 'Calendar Export', page: 'export', icon: Download },
    { label: 'PDF Schedule', page: 'pdf', icon: Calendar },
    { label: 'Tournament Bracket', page: 'bracket', icon: Star },
    { label: 'AI Match Recaps', page: 'recap', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Profile card */}
        <div
          className="relative overflow-hidden rounded-2xl p-6 mb-6 border border-primary/20"
          style={{ background: 'linear-gradient(135deg, rgba(26,86,219,0.08), rgba(26,86,219,0.03))' }}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #1A56DB, transparent)' }} />
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0 relative">
              <img src={logoImg} alt="" className="w-10 h-10 object-contain opacity-60" />
            </div>
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-input-background border border-primary/40 text-foreground text-sm focus:outline-none"
                    autoFocus
                  />
                  <button onClick={saveName} className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-semibold">Save</button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-['Barlow_Condensed'] font-bold text-foreground" style={{ fontSize: '1.35rem' }}>{displayName}</h2>
                  <button onClick={() => setEditingName(true)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {nameSaved && <Check className="w-3.5 h-3.5 text-[#16A34A]" />}
                </div>
              )}
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={copyId} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-secondary px-2 py-1 rounded border border-border">
                  <span className="font-['JetBrains_Mono']">{userId}</span>
                  {copiedId ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* Fav teams */}
          {favTeams.length > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Following:</span>
              {favTeams.map((code, i) => {
                const t = getTeam(code);
                return (
                  <div key={code} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary border border-border">
                    <span>{t.flag}</span>
                    <span className="text-xs font-medium text-foreground">{t.name}</span>
                    {i === 0 && <Star className="w-3 h-3 text-primary fill-primary" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-card border border-border rounded-xl p-3 flex flex-col items-center gap-1.5 text-center">
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <p className="font-['JetBrains_Mono'] font-black text-foreground text-xl leading-none">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* My Teams section */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
          <button
            className="w-full flex items-center justify-between px-4 py-3 border-b border-border hover:bg-white/[0.02] transition-colors"
            onClick={() => setEditingTeams(!editingTeams)}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#F59E0B]" />
              <span className="font-semibold text-sm text-foreground">My Favourite Teams</span>
              <span className="text-xs text-muted-foreground">({favTeams.length}/3)</span>
            </div>
            <span className="text-xs text-primary font-semibold">{editingTeams ? 'Close' : 'Edit'}</span>
          </button>
          {editingTeams ? (
            <div className="p-4">
              <TeamPicker favTeams={favTeams} onSave={(teams) => { onUpdateTeams(teams); setEditingTeams(false); }} />
            </div>
          ) : (
            <div className="p-4">
              {favTeams.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">No teams selected yet. Click Edit to add teams.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {favTeams.map((code, i) => {
                    const t = getTeam(code);
                    const nextMatch = getMatchesByTeam(code).find(m => m.status === 'upcoming');
                    return (
                      <div key={code} className="flex items-center gap-3 py-1">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: i === 0 ? '#F59E0B' : '#1A56DB', color: '#fff' }}>
                          {i === 0 ? '★' : i + 1}
                        </span>
                        <span className="text-xl">{t.flag}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{t.name}</p>
                          <p className="text-xs text-muted-foreground">Group {t.group} · {t.confederation}</p>
                        </div>
                        {nextMatch && (
                          <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {format(new Date(nextMatch.datetime), 'MMM d')}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick export */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm text-foreground">Quick Export</h3>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <button
              onClick={() => downloadICS(MATCHES.filter(m => favTeams.includes(m.homeTeam) || favTeams.includes(m.awayTeam)).filter(m => m.status === 'upcoming'), 'my-teams.ics')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border hover:bg-white/5 transition-colors"
            >
              <Download className="w-4 h-4 text-primary shrink-0" />
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-foreground">My Teams' Matches</p>
                <p className="text-xs text-muted-foreground">ICS file for all upcoming matches</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => downloadICS(MATCHES.filter(m => m.status === 'upcoming' && m.homeTeam !== 'TBD'), 'wc2026-full.ics')}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border hover:bg-white/5 transition-colors"
            >
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-foreground">Complete Tournament</p>
                <p className="text-xs text-muted-foreground">All {MATCHES.filter(m => m.status === 'upcoming' && m.homeTeam !== 'TBD').length} upcoming matches</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Quick navigation */}
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-sm text-foreground">Quick Navigation</h3>
          </div>
          <div className="divide-y divide-border">
            {quickLinks.map(link => {
              const Icon = link.icon;
              return (
                <button
                  key={link.page}
                  onClick={() => onNavigate(link.page)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors text-left"
                >
                  <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium text-foreground flex-1">{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Account actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/5 transition-all font-semibold text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <p className="text-xs text-muted-foreground text-center">
            MatchPulse v1.0 · FIFA World Cup 2026 Edition · Not affiliated with FIFA
          </p>
        </div>
      </div>
    </div>
  );
}
