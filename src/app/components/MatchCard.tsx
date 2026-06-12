import { format } from 'date-fns';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { Match } from '../data/matches';
import { getTeam } from '../data/teams';
import { getGoogleCalendarURL, downloadICS } from '../utils/icsGenerator';

interface Props {
  match: Match;
  highlighted?: boolean;
  compact?: boolean;
  onExport?: (match: Match) => void;
  onClick?: (match: Match) => void;
}

function StatusBadge({ status, minute }: { status: Match['status']; minute?: number }) {
  if (status === 'live') {
    return (
      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-accent/20 text-accent border border-accent/30">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        LIVE {minute ? `${minute}'` : ''}
      </span>
    );
  }
  if (status === 'completed') {
    return (
      <span className="px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-muted-foreground border border-white/8">
        FT
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
      UPCOMING
    </span>
  );
}

export function MatchCard({ match, highlighted = false, compact = false, onExport, onClick }: Props) {
  const home = getTeam(match.homeTeam);
  const away = getTeam(match.awayTeam);
  const isTBD = match.homeTeam === 'TBD';
  const kickoff = new Date(match.datetime);

  const cardBg = highlighted
    ? 'bg-gradient-to-br from-primary/10 to-card border-primary/30'
    : 'bg-card border-border';

  if (compact) {
    return (
      <div className={`flex items-center justify-between p-3 rounded-lg border ${cardBg} gap-4`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">{home.flag}</span>
          <span className="text-sm font-semibold text-foreground truncate">{home.name}</span>
        </div>
        <div className="flex flex-col items-center shrink-0">
          {match.status === 'completed' || match.status === 'live' ? (
            <span className="font-['JetBrains_Mono'] text-base font-bold text-foreground">
              {match.homeScore} – {match.awayScore}
            </span>
          ) : (
            <span className="font-['JetBrains_Mono'] text-xs text-muted-foreground">
              {format(kickoff, 'HH:mm')} UTC
            </span>
          )}
          <StatusBadge status={match.status} minute={match.liveMinute} />
        </div>
        <div className="flex items-center gap-2 min-w-0 justify-end">
          <span className="text-sm font-semibold text-foreground truncate text-right">{away.name}</span>
          <span className="text-lg shrink-0">{away.flag}</span>
        </div>
      </div>
    );
  }

  const Wrapper = onClick ? 'button' : 'div';
  const wrapperProps = onClick
    ? { type: 'button' as const, onClick: () => onClick(match), className: `w-full text-left rounded-xl border ${cardBg} overflow-hidden transition-all hover:border-primary/40 group cursor-pointer` }
    : { className: `rounded-xl border ${cardBg} overflow-hidden transition-all hover:border-primary/40 group` };

  return (
    <Wrapper {...wrapperProps}>
      {/* Stage bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-white/[0.02]">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {match.stage}{match.matchday ? ` · MD${match.matchday}` : ''}
        </span>
        <StatusBadge status={match.status} minute={match.liveMinute} />
      </div>

      {/* Teams + Score */}
      <div className="px-4 py-5">
        {isTBD ? (
          <div className="flex items-center justify-center py-2">
            <span className="text-muted-foreground text-sm">Teams to be determined</span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            {/* Home */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-4xl">{home.flag}</span>
              <span className="text-sm font-semibold text-foreground text-center leading-tight">{home.name}</span>
              <span className="text-xs text-muted-foreground">{home.code}</span>
            </div>

            {/* Score / Time */}
            <div className="flex flex-col items-center gap-1 px-4">
              {match.status === 'completed' || match.status === 'live' ? (
                <span className="font-['JetBrains_Mono'] text-3xl font-bold text-foreground tabular-nums">
                  {match.homeScore} – {match.awayScore}
                </span>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="font-['JetBrains_Mono'] text-xl font-bold text-primary">
                    {format(kickoff, 'HH:mm')}
                  </span>
                  <span className="text-xs text-muted-foreground">UTC</span>
                </div>
              )}
              {match.status === 'live' && match.liveMinute && (
                <span className="text-xs text-accent font-semibold">{match.liveMinute}'</span>
              )}
            </div>

            {/* Away */}
            <div className="flex-1 flex flex-col items-center gap-2">
              <span className="text-4xl">{away.flag}</span>
              <span className="text-sm font-semibold text-foreground text-center leading-tight">{away.name}</span>
              <span className="text-xs text-muted-foreground">{away.code}</span>
            </div>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="px-4 pb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {format(kickoff, 'EEE, MMM d yyyy')}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {format(kickoff, 'HH:mm')} UTC
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {match.venue}, {match.city}
        </span>
      </div>

      {/* Actions */}
      {match.status === 'upcoming' && !isTBD && (
        <div className="px-4 pb-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <a
            href={getGoogleCalendarURL(match)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-1.5 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            + Google Cal
          </a>
          <button
            onClick={() => onExport ? onExport(match) : downloadICS([match], `match-${match.id}.ics`)}
            className="flex-1 py-1.5 rounded-md text-xs font-semibold bg-white/5 text-foreground border border-border hover:bg-white/10 transition-colors"
          >
            ↓ ICS
          </button>
        </div>
      )}
    </Wrapper>
  );
}
