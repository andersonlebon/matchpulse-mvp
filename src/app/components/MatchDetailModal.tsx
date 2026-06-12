import { X, MapPin, Calendar, Clock, Download } from 'lucide-react';
import { Match } from '../data/matches';
import { Team } from '../data/teams';
import { format } from 'date-fns';
import { downloadICS, getGoogleCalendarURL } from '../utils/icsGenerator';

interface Props {
  match: Match;
  getTeam: (code: string) => Team;
  onClose: () => void;
}

export function MatchDetailModal({ match, getTeam, onClose }: Props) {
  const home = getTeam(match.homeTeam);
  const away = getTeam(match.awayTeam);
  const kickoff = new Date(match.datetime);
  const isTBD = match.homeTeam === 'TBD';

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-card border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #1A56DB, #E53535)' }} />

        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">{match.stage}</p>
            {match.matchday && <p className="text-xs text-muted-foreground">Matchday {match.matchday}</p>}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!isTBD ? (
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex-1 flex flex-col items-center gap-2">
                <span className="text-5xl">{home.flag}</span>
                <p className="font-bold text-foreground text-center">{home.name}</p>
                <p className="text-xs text-muted-foreground">{home.code}</p>
              </div>
              <div className="text-center shrink-0">
                {match.status === 'completed' || match.status === 'live' ? (
                  <p className="font-['JetBrains_Mono'] text-4xl font-black text-foreground">
                    {match.homeScore} – {match.awayScore}
                  </p>
                ) : (
                  <p className="font-['JetBrains_Mono'] text-2xl font-bold text-primary">{format(kickoff, 'HH:mm')}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1 uppercase">
                  {match.status === 'live' ? `Live ${match.liveMinute ?? ''}'` : match.status}
                </p>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <span className="text-5xl">{away.flag}</span>
                <p className="font-bold text-foreground text-center">{away.name}</p>
                <p className="text-xs text-muted-foreground">{away.code}</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">Teams to be determined</p>
          )}

          <div className="flex flex-col gap-2 mb-6 p-4 rounded-xl bg-secondary/50 border border-border text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {format(kickoff, 'EEEE, MMMM d, yyyy')}
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              {format(kickoff, 'HH:mm')} UTC
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {match.venue}{match.city ? `, ${match.city}` : ''}{match.country ? `, ${match.country}` : ''}
            </span>
          </div>

          {!isTBD && match.status === 'upcoming' && (
            <div className="flex gap-2">
              <a
                href={getGoogleCalendarURL(match)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-3 rounded-xl text-sm font-semibold bg-primary/10 text-primary border border-primary/20"
              >
                Google Calendar
              </a>
              <button
                onClick={() => downloadICS([match], `match-${match.id}.ics`)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-white/5 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download ICS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
