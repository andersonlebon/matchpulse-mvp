import { useState, useRef } from 'react';
import { Printer, Download, FileText, Star, Calendar, Check } from 'lucide-react';
import { MATCHES, getMatchesByTeam, getGroupStageMatches } from '../data/matches';
import { getTeam, GROUPS, getAllTeams } from '../data/teams';
import { format } from 'date-fns';
import logoImg from '../../imports/ChatGPT_Image_Jun_11__2026__09_04_24_PM.png';

interface Props {
  favTeams: string[];
}

type PDFScope = 'full' | 'my-teams' | 'group-stage' | 'knockout';

const SCOPE_OPTIONS: { id: PDFScope; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'full', label: 'Complete Tournament Schedule', desc: 'All 104 matches, groups through Final', icon: Calendar },
  { id: 'my-teams', label: 'My Teams Schedule', desc: 'Only matches featuring my favourite teams', icon: Star },
  { id: 'group-stage', label: 'Group Stage Only', desc: 'All 48 group stage matches', icon: FileText },
  { id: 'knockout', label: 'Knockout Rounds', desc: 'Round of 32 through the Final', icon: FileText },
];

const GROUP_KEYS = Object.keys(GROUPS);

export function PDFExport({ favTeams }: Props) {
  const [scope, setScope] = useState<PDFScope>(favTeams.length > 0 ? 'my-teams' : 'full');
  const [printing, setPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const printMatches = (() => {
    if (scope === 'my-teams') return favTeams.flatMap(c => getMatchesByTeam(c)).sort((a, b) => a.datetime.localeCompare(b.datetime));
    if (scope === 'group-stage') return getGroupStageMatches();
    if (scope === 'knockout') return MATCHES.filter(m => !m.stage.startsWith('Group'));
    return MATCHES.filter(m => m.homeTeam !== 'TBD');
  })();

  function handlePrint() {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 100);
  }

  const groupedByDate = new Map<string, typeof printMatches>();
  for (const m of printMatches) {
    const day = m.datetime.slice(0, 10);
    if (!groupedByDate.has(day)) groupedByDate.set(day, []);
    groupedByDate.get(day)!.push(m);
  }

  // Group standings for full/group-stage scopes
  const groupStandings = GROUP_KEYS.map(group => {
    const teams = (GROUPS[group] ?? []).map(code => getTeam(code));
    const completedMatches = MATCHES.filter(m => m.stage === `Group ${group}` && m.status === 'completed');
    const standings = teams.map(t => {
      let pts = 0, gf = 0, ga = 0;
      completedMatches.filter(m => m.homeTeam === t.code || m.awayTeam === t.code).forEach(m => {
        const isHome = m.homeTeam === t.code;
        const tG = isHome ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
        const oG = isHome ? (m.awayScore ?? 0) : (m.homeScore ?? 0);
        gf += tG; ga += oG;
        if (tG > oG) pts += 3;
        else if (tG === oG) pts += 1;
      });
      return { ...t, pts, gf, ga, gd: gf - ga };
    }).sort((a, b) => b.pts - a.pts || b.gd - a.gd);
    return { group, standings };
  });

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Print styles */}
      <style>{`
        @media print {
          body > * { display: none !important; }
          .print-container { display: block !important; }
          .no-print { display: none !important; }
          @page { margin: 1cm; size: A4; }
          body { background: white !important; color: black !important; font-family: 'DM Sans', sans-serif; }
          .print-container { color: black !important; background: white !important; }
          .print-page-break { page-break-before: always; }
        }
        @media screen {
          .print-container { display: none; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 py-6 no-print">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/25">
              Export
            </span>
          </div>
          <h1
            className="font-['Barlow_Condensed'] font-black uppercase text-foreground"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.1 }}
          >
            PDF Schedule Export
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Print or save a PDF of the World Cup 2026 schedule
          </p>
        </div>

        {/* Scope selection */}
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {SCOPE_OPTIONS.map(opt => {
            if (opt.id === 'my-teams' && favTeams.length === 0) return null;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => setScope(opt.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                  scope === opt.id
                    ? 'border-primary/40 bg-primary/10'
                    : 'border-border hover:border-white/20 hover:bg-white/[0.02]'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${scope === opt.id ? 'bg-primary/20' : 'bg-secondary'}`}>
                  <Icon className={`w-5 h-5 ${scope === opt.id ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${scope === opt.id ? 'text-primary' : 'text-foreground'}`}>{opt.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${scope === opt.id ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {scope === opt.id && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Preview summary */}
        <div className="mb-6 p-5 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Print Preview</h2>
            <span className="font-['JetBrains_Mono'] text-sm text-muted-foreground">
              {printMatches.length} matches · {groupedByDate.size} days
            </span>
          </div>

          {/* Sample dates */}
          <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
            {Array.from(groupedByDate.entries()).slice(0, 6).map(([day, dayMatches]) => (
              <div key={day} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground">{format(new Date(day + 'T12:00:00Z'), 'EEE, MMM d')}</span>
                <span className="text-xs font-medium text-foreground">{dayMatches.length} match{dayMatches.length !== 1 ? 'es' : ''}</span>
              </div>
            ))}
            {groupedByDate.size > 6 && (
              <p className="text-xs text-muted-foreground text-center pt-1">
                + {groupedByDate.size - 6} more days...
              </p>
            )}
          </div>
        </div>

        {/* Print buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrint}
            disabled={printing}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.01] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #1A56DB, #1244b0)', boxShadow: '0 0 20px rgba(26,86,219,0.25)' }}
          >
            <Printer className="w-5 h-5" />
            Print / Save as PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-foreground border border-border hover:bg-white/5 transition-all"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-3">
          Use your browser's "Save as PDF" option when the print dialog opens.
        </p>
      </div>

      {/* ─── PRINTABLE DOCUMENT ─────────────────────────────────────── */}
      <div className="print-container" ref={printRef} style={{ fontFamily: 'DM Sans, sans-serif', color: '#000', background: '#fff', padding: '0' }}>

        {/* Cover page */}
        <div style={{ textAlign: 'center', padding: '40px 20px 30px', borderBottom: '3px solid #1A56DB' }}>
          <img src={logoImg} alt="MatchPulse" style={{ height: '48px', objectFit: 'contain', marginBottom: '16px' }} />
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '36px', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 8px', letterSpacing: '0.02em' }}>
            FIFA World Cup 2026
          </h1>
          <p style={{ fontSize: '14px', color: '#666', margin: '0 0 4px' }}>
            {SCOPE_OPTIONS.find(o => o.id === scope)?.label}
          </p>
          {scope === 'my-teams' && (
            <p style={{ fontSize: '13px', color: '#1A56DB', marginTop: '4px' }}>
              {favTeams.map(c => `${getTeam(c).flag} ${getTeam(c).name}`).join(' · ')}
            </p>
          )}
          <p style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
            Printed via MatchPulse · matchpulse.app · {format(new Date(), 'MMMM d, yyyy')}
          </p>
        </div>

        {/* Group standings (for full/group-stage) */}
        {(scope === 'full' || scope === 'group-stage') && (
          <div style={{ padding: '20px', pageBreakAfter: 'always' }}>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
              Group Standings
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {groupStandings.map(({ group, standings }) => (
                <div key={group} style={{ border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden', fontSize: '11px' }}>
                  <div style={{ background: '#1A56DB', color: '#fff', padding: '4px 8px', fontWeight: 700, fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Group {group}
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb' }}>
                        <th style={{ textAlign: 'left', padding: '2px 6px', fontWeight: 600, color: '#6b7280' }}>Team</th>
                        <th style={{ padding: '2px 4px', fontWeight: 600, color: '#6b7280' }}>Pts</th>
                        <th style={{ padding: '2px 4px', fontWeight: 600, color: '#6b7280' }}>GD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((t, i) => (
                        <tr key={t.code} style={{ borderTop: '1px solid #f3f4f6', background: i < 2 ? '#f0f9ff' : 'transparent' }}>
                          <td style={{ padding: '3px 6px' }}>{t.flag} {t.name}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', fontWeight: 700, fontFamily: 'monospace' }}>{t.pts}</td>
                          <td style={{ padding: '3px 4px', textAlign: 'center', fontFamily: 'monospace' }}>{t.gd > 0 ? '+' : ''}{t.gd}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Match schedule */}
        <div style={{ padding: '20px' }}>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
            Match Schedule
          </h2>

          {Array.from(groupedByDate.entries()).map(([day, dayMatches]) => (
            <div key={day} style={{ marginBottom: '16px' }}>
              <div style={{ background: '#f3f4f6', padding: '4px 10px', borderLeft: '3px solid #1A56DB', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#374151' }}>
                  {format(new Date(day + 'T12:00:00Z'), 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '4px 8px', color: '#6b7280', fontWeight: 600 }}>Time (UTC)</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px', color: '#6b7280', fontWeight: 600 }}>Match</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px', color: '#6b7280', fontWeight: 600 }}>Stage</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px', color: '#6b7280', fontWeight: 600 }}>Venue</th>
                    <th style={{ textAlign: 'center', padding: '4px 8px', color: '#6b7280', fontWeight: 600 }}>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {dayMatches.map(m => {
                    const home = getTeam(m.homeTeam);
                    const away = getTeam(m.awayTeam);
                    const isFav = favTeams.includes(m.homeTeam) || favTeams.includes(m.awayTeam);
                    return (
                      <tr key={m.id} style={{ borderBottom: '1px solid #f3f4f6', background: isFav ? '#eff6ff' : 'transparent' }}>
                        <td style={{ padding: '5px 8px', fontFamily: 'monospace', color: '#6b7280' }}>
                          {format(new Date(m.datetime), 'HH:mm')}
                        </td>
                        <td style={{ padding: '5px 8px', fontWeight: 600 }}>
                          {m.homeTeam === 'TBD'
                            ? 'TBD vs TBD'
                            : `${home.flag} ${home.name} vs ${away.flag} ${away.name}`
                          }
                          {isFav && <span style={{ marginLeft: '4px', color: '#1A56DB', fontSize: '10px' }}>★</span>}
                        </td>
                        <td style={{ padding: '5px 8px', color: '#6b7280' }}>{m.stage}</td>
                        <td style={{ padding: '5px 8px', color: '#6b7280' }}>{m.venue}</td>
                        <td style={{ padding: '5px 8px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 700 }}>
                          {m.status === 'completed' ? `${m.homeScore} – ${m.awayScore}` : m.status === 'live' ? `${m.homeScore} – ${m.awayScore} LIVE` : '— : —'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e5e7eb', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: '#9ca3af' }}>
          <span>MatchPulse — FIFA World Cup 2026</span>
          <span>matchpulse.app · Not affiliated with FIFA</span>
          <span>Printed: {format(new Date(), 'MMM d, yyyy')}</span>
        </div>
      </div>
    </div>
  );
}
