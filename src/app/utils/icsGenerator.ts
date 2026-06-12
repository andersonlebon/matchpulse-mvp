import { Match } from '../data/matches';
import { getTeam } from '../data/teams';

function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function escapeICS(str: string): string {
  return str.replace(/[,;\\]/g, c => '\\' + c).replace(/\n/g, '\\n');
}

function buildVEVENT(match: Match): string {
  const home = getTeam(match.homeTeam);
  const away = getTeam(match.awayTeam);
  const start = new Date(match.datetime);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const isTBD = match.homeTeam === 'TBD';
  const summary = isTBD
    ? `FIFA World Cup 2026 — ${match.stage}`
    : `${home.flag} ${home.name} vs ${away.flag} ${away.name}`;

  const description = [
    `FIFA World Cup 2026`,
    `Stage: ${match.stage}`,
    `Venue: ${match.venue}`,
    `${match.city}, ${match.country}`,
    '',
    'Sync your schedule at matchpulse.live',
  ].join('\\n');

  return [
    'BEGIN:VEVENT',
    `UID:matchpulse-wc2026-${match.id}@matchpulse.live`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${escapeICS(summary)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    `LOCATION:${escapeICS(`${match.venue}, ${match.city}, ${match.country}`)}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    `CATEGORIES:FIFA World Cup 2026,Football,Soccer`,
    'BEGIN:VALARM',
    'TRIGGER:-PT60M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Match starting in 1 hour!',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Match starting in 15 minutes!',
    'END:VALARM',
    'END:VEVENT',
  ].join('\r\n');
}

export function generateICS(matches: Match[]): string {
  const events = matches.map(buildVEVENT).join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MatchPulse//FIFA World Cup 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:FIFA World Cup 2026 — MatchPulse',
    'X-WR-CALDESC:Match schedule synchronized via MatchPulse',
    'X-WR-TIMEZONE:UTC',
    events,
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadICS(matches: Match[], filename = 'world-cup-2026.ics'): void {
  const ics = generateICS(matches);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarURL(match: Match): string {
  const home = getTeam(match.homeTeam);
  const away = getTeam(match.awayTeam);
  const start = new Date(match.datetime);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const isTBD = match.homeTeam === 'TBD';
  const text = isTBD
    ? `FIFA World Cup 2026 — ${match.stage}`
    : `${home.name} vs ${away.name} | FIFA World Cup 2026`;

  const details = `Stage: ${match.stage} | Venue: ${match.venue}, ${match.city}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text,
    dates: `${formatICSDate(start)}/${formatICSDate(end)}`,
    details,
    location: `${match.venue}, ${match.city}, ${match.country}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getOutlookCalendarURL(match: Match): string {
  const home = getTeam(match.homeTeam);
  const away = getTeam(match.awayTeam);
  const start = new Date(match.datetime);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const isTBD = match.homeTeam === 'TBD';
  const subject = isTBD
    ? `FIFA World Cup 2026 — ${match.stage}`
    : `${home.name} vs ${away.name} | FIFA World Cup 2026`;

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: `Stage: ${match.stage} | ${match.venue}, ${match.city}`,
    location: `${match.venue}, ${match.city}, ${match.country}`,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
