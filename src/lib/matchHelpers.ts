import { Match, MatchStatus } from '../app/data/matches';

export function getMatchesByTeam(matches: Match[], teamCode: string): Match[] {
  return matches.filter(m => m.homeTeam === teamCode || m.awayTeam === teamCode);
}

export function getMatchesByStatus(matches: Match[], status: MatchStatus): Match[] {
  return matches.filter(m => m.status === status);
}

export function getNextMatch(matches: Match[], teamCodes?: string[]): Match | undefined {
  const upcoming = matches.filter(m => m.status === 'upcoming');
  if (teamCodes?.length) {
    const teamMatch = upcoming.find(m =>
      teamCodes.includes(m.homeTeam) || teamCodes.includes(m.awayTeam),
    );
    if (teamMatch) return teamMatch;
  }
  return upcoming.sort((a, b) => a.datetime.localeCompare(b.datetime))[0];
}

export function getTodayMatches(matches: Match[]): Match[] {
  const today = new Date().toISOString().slice(0, 10);
  return matches.filter(m => m.datetime.startsWith(today));
}

export function getGroupStageMatches(matches: Match[]): Match[] {
  return matches.filter(m => m.stage.startsWith('Group'));
}

export function getKnockoutMatches(matches: Match[]): Match[] {
  return matches.filter(m => !m.stage.startsWith('Group'));
}
