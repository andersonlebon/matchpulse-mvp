import { useState } from 'react';
import { X, Download, Calendar, Check, ExternalLink, Apple, Globe } from 'lucide-react';
import { Match } from '../data/matches';
import { useFootball } from '../context/FootballContext';
import { downloadICS, getGoogleCalendarURL, getOutlookCalendarURL } from '../utils/icsGenerator';
import { format } from 'date-fns';

interface Props {
  favTeams: string[];
  preselectedMatch?: Match;
  onClose: () => void;
}

type ExportScope = 'all' | 'group-stage' | 'knockout' | 'my-teams' | 'single';
type Platform = 'ics' | 'google' | 'apple' | 'outlook';

export function CalendarExportModal({ favTeams, preselectedMatch, onClose }: Props) {
  const [scope, setScope] = useState<ExportScope>(preselectedMatch ? 'single' : favTeams.length > 0 ? 'my-teams' : 'all');
  const [exported, setExported] = useState(false);
  const { matches, getTeam } = useFootball();

  const upcoming = matches.filter(m => m.status !== 'completed' && m.homeTeam !== 'TBD');

  const exportMatches = (() => {
    if (scope === 'single' && preselectedMatch) return [preselectedMatch];
    if (scope === 'all') return upcoming;
    if (scope === 'group-stage') return upcoming.filter(m => m.stage.startsWith('Group'));
    if (scope === 'knockout') return upcoming.filter(m => !m.stage.startsWith('Group'));
    if (scope === 'my-teams') return upcoming.filter(m => favTeams.includes(m.homeTeam) || favTeams.includes(m.awayTeam));
    return upcoming;
  })();

  function handleExport(platform: Platform) {
    if (platform === 'ics' || platform === 'apple') {
      const label = scope === 'my-teams' ? 'my-teams' : scope === 'single' ? `match-${preselectedMatch?.id}` : `wc2026-${scope}`;
      downloadICS(exportMatches, `${label}.ics`);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } else if (platform === 'google' && exportMatches.length === 1) {
      window.open(getGoogleCalendarURL(exportMatches[0]), '_blank');
    } else if (platform === 'outlook' && exportMatches.length === 1) {
      window.open(getOutlookCalendarURL(exportMatches[0]), '_blank');
    } else if (platform === 'google' || platform === 'outlook') {
      // For bulk, download ICS and show instructions
      downloadICS(exportMatches, 'wc2026.ics');
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    }
  }

  const SCOPES: { id: ExportScope; label: string; desc: string; count: number }[] = [
    ...(favTeams.length > 0 ? [{
      id: 'my-teams' as ExportScope,
      label: 'My Teams',
      desc: `Matches for ${favTeams.map(c => getTeam(c).flag + ' ' + getTeam(c).name).join(', ')}`,
      count: upcoming.filter(m => favTeams.includes(m.homeTeam) || favTeams.includes(m.awayTeam)).length
    }] : []),
    { id: 'all', label: 'All Matches', desc: 'Complete World Cup 2026 schedule', count: upcoming.length },
    { id: 'group-stage', label: 'Group Stage', desc: 'All 48 group stage matches', count: upcoming.filter(m => m.stage.startsWith('Group')).length },
    { id: 'knockout', label: 'Knockout Rounds', desc: 'Round of 32 through the Final', count: upcoming.filter(m => !m.stage.startsWith('Group')).length },
    ...(preselectedMatch ? [{
      id: 'single' as ExportScope,
      label: 'This Match Only',
      desc: `${getTeam(preselectedMatch.homeTeam).name} vs ${getTeam(preselectedMatch.awayTeam).name}`,
      count: 1,
    }] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #1A56DB, #E53535)' }} />

        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-['Barlow_Condensed'] font-bold text-foreground" style={{ fontSize: '1.5rem' }}>
                Export to Calendar
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Never miss a match — sync to your calendar
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scope selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              What to Export
            </label>
            <div className="flex flex-col gap-2">
              {SCOPES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setScope(s.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    scope === s.id
                      ? 'border-primary/40 bg-primary/10'
                      : 'border-border hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div>
                    <p className={`text-sm font-semibold ${scope === s.id ? 'text-primary' : 'text-foreground'}`}>
                      {s.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-['JetBrains_Mono'] text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                      {s.count} match{s.count !== 1 ? 'es' : ''}
                    </span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${scope === s.id ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                      {scope === s.id && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Export platforms */}
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Choose Platform
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleExport('ics')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
              >
                <Download className="w-6 h-6 text-primary" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Download ICS</p>
                  <p className="text-xs text-muted-foreground">Any Calendar App</p>
                </div>
              </button>

              <a
                href={exportMatches.length === 1 ? getGoogleCalendarURL(exportMatches[0]) : '#'}
                onClick={e => { if (exportMatches.length !== 1) { e.preventDefault(); handleExport('google'); } }}
                target={exportMatches.length === 1 ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Google Calendar</p>
                  <p className="text-xs text-muted-foreground">
                    {exportMatches.length === 1 ? 'Add single match' : 'Download + Import'}
                  </p>
                </div>
              </a>

              <button
                onClick={() => handleExport('apple')}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                <Apple className="w-6 h-6 text-foreground" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Apple Calendar</p>
                  <p className="text-xs text-muted-foreground">Opens in Calendar.app</p>
                </div>
              </button>

              <a
                href={exportMatches.length === 1 ? getOutlookCalendarURL(exportMatches[0]) : '#'}
                onClick={e => { if (exportMatches.length !== 1) { e.preventDefault(); handleExport('outlook'); } }}
                target={exportMatches.length === 1 ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <Globe className="w-6 h-6 text-[#0078D4]" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Outlook</p>
                  <p className="text-xs text-muted-foreground">
                    {exportMatches.length === 1 ? 'Add to Outlook' : 'Download + Import'}
                  </p>
                </div>
              </a>
            </div>
          </div>

          {exported && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#16A34A]/10 border border-[#16A34A]/20 text-[#16A34A] text-sm font-semibold">
              <Check className="w-4 h-4" />
              ICS file downloaded! Open it to import into your calendar.
            </div>
          )}

          {/* Match list preview */}
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
              <span>Includes {exportMatches.length} match{exportMatches.length !== 1 ? 'es' : ''}</span>
              <span>+ reminders at 60min & 15min before each match</span>
            </p>
            <div className="max-h-32 overflow-y-auto flex flex-col gap-1">
              {exportMatches.slice(0, 8).map(m => (
                <div key={m.id} className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-foreground font-medium">
                    {getTeam(m.homeTeam).flag} {getTeam(m.homeTeam).name} vs {getTeam(m.awayTeam).flag} {getTeam(m.awayTeam).name}
                  </span>
                  <span className="text-muted-foreground shrink-0 ml-2">
                    {format(new Date(m.datetime), 'MMM d')}
                  </span>
                </div>
              ))}
              {exportMatches.length > 8 && (
                <p className="text-xs text-muted-foreground text-center py-1">
                  + {exportMatches.length - 8} more matches
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
