export type MatchStatus = 'upcoming' | 'live' | 'completed';
export type MatchStage =
  | 'Group A' | 'Group B' | 'Group C' | 'Group D'
  | 'Group E' | 'Group F' | 'Group G' | 'Group H'
  | 'Group I' | 'Group J' | 'Group K' | 'Group L'
  | 'Group M' | 'Group N' | 'Group O' | 'Group P'
  | 'Round of 32' | 'Round of 16' | 'Quarter-Final'
  | 'Semi-Final' | 'Third Place' | 'Final';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  datetime: string;     // ISO UTC
  venue: string;
  city: string;
  country: string;
  stage: MatchStage;
  matchday?: 1 | 2 | 3;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  liveMinute?: number;
}

// Reference "now": June 12 2026, 20:00 UTC
// June 11 = completed | June 12 ≤ 19:00 UTC = completed | June 12 19:00 UTC = LIVE | June 12 > 19:00 UTC = upcoming

export const MATCHES: Match[] = [
  // ─── MATCHDAY 1 ─────────────────────────────────────────────────
  // June 11
  { id: 'm001', homeTeam: 'USA', awayTeam: 'PAN', datetime: '2026-06-11T23:00:00Z', venue: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA', stage: 'Group A', matchday: 1, status: 'completed', homeScore: 3, awayScore: 1 },
  { id: 'm002', homeTeam: 'MEX', awayTeam: 'POL', datetime: '2026-06-11T19:00:00Z', venue: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', stage: 'Group B', matchday: 1, status: 'completed', homeScore: 2, awayScore: 1 },
  { id: 'm003', homeTeam: 'FRA', awayTeam: 'ECU', datetime: '2026-06-11T22:00:00Z', venue: 'SoFi Stadium', city: 'Los Angeles, CA', country: 'USA', stage: 'Group G', matchday: 1, status: 'completed', homeScore: 3, awayScore: 0 },
  { id: 'm004', homeTeam: 'BRA', awayTeam: 'SUI', datetime: '2026-06-11T22:00:00Z', venue: 'AT&T Stadium', city: 'Dallas, TX', country: 'USA', stage: 'Group D', matchday: 1, status: 'completed', homeScore: 1, awayScore: 1 },

  // June 12
  { id: 'm005', homeTeam: 'ARG', awayTeam: 'CHI', datetime: '2026-06-12T16:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami, FL', country: 'USA', stage: 'Group E', matchday: 1, status: 'completed', homeScore: 2, awayScore: 0 },
  { id: 'm006', homeTeam: 'ENG', awayTeam: 'URU', datetime: '2026-06-12T19:00:00Z', venue: 'Gillette Stadium', city: 'Boston, MA', country: 'USA', stage: 'Group H', matchday: 1, status: 'live', homeScore: 1, awayScore: 0, liveMinute: 62 },
  { id: 'm007', homeTeam: 'ESP', awayTeam: 'KOR', datetime: '2026-06-12T22:00:00Z', venue: 'Levi\'s Stadium', city: 'San Jose, CA', country: 'USA', stage: 'Group I', matchday: 1, status: 'upcoming' },
  { id: 'm008', homeTeam: 'POR', awayTeam: 'DEN', datetime: '2026-06-13T01:00:00Z', venue: 'Lumen Field', city: 'Seattle, WA', country: 'USA', stage: 'Group J', matchday: 1, status: 'upcoming' },

  // June 13
  { id: 'm009', homeTeam: 'GER', awayTeam: 'AUS', datetime: '2026-06-13T16:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia, PA', country: 'USA', stage: 'Group K', matchday: 1, status: 'upcoming' },
  { id: 'm010', homeTeam: 'NED', awayTeam: 'UZB', datetime: '2026-06-13T19:00:00Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta, GA', country: 'USA', stage: 'Group L', matchday: 1, status: 'upcoming' },
  { id: 'm011', homeTeam: 'CAN', awayTeam: 'MAR', datetime: '2026-06-13T22:00:00Z', venue: 'BMO Field', city: 'Toronto', country: 'Canada', stage: 'Group C', matchday: 1, status: 'upcoming' },
  { id: 'm012', homeTeam: 'ITA', awayTeam: 'JOR', datetime: '2026-06-13T19:00:00Z', venue: 'Arrowhead Stadium', city: 'Kansas City, MO', country: 'USA', stage: 'Group M', matchday: 1, status: 'upcoming' },

  // June 14
  { id: 'm013', homeTeam: 'COL', awayTeam: 'PER', datetime: '2026-06-14T16:00:00Z', venue: 'NRG Stadium', city: 'Houston, TX', country: 'USA', stage: 'Group F', matchday: 1, status: 'upcoming' },
  { id: 'm014', homeTeam: 'CRO', awayTeam: 'NOR', datetime: '2026-06-14T19:00:00Z', venue: 'BC Place', city: 'Vancouver', country: 'Canada', stage: 'Group N', matchday: 1, status: 'upcoming' },
  { id: 'm015', homeTeam: 'TUR', awayTeam: 'RSA', datetime: '2026-06-14T22:00:00Z', venue: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico', stage: 'Group O', matchday: 1, status: 'upcoming' },
  { id: 'm016', homeTeam: 'BEL', awayTeam: 'GHA', datetime: '2026-06-14T19:00:00Z', venue: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA', stage: 'Group P', matchday: 1, status: 'upcoming' },

  // ─── MATCHDAY 2 ─────────────────────────────────────────────────
  // June 18
  { id: 'm017', homeTeam: 'SEN', awayTeam: 'PAN', datetime: '2026-06-18T16:00:00Z', venue: 'AT&T Stadium', city: 'Dallas, TX', country: 'USA', stage: 'Group A', matchday: 2, status: 'upcoming' },
  { id: 'm018', homeTeam: 'SAU', awayTeam: 'MEX', datetime: '2026-06-18T19:00:00Z', venue: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico', stage: 'Group B', matchday: 2, status: 'upcoming' },
  { id: 'm019', homeTeam: 'CMR', awayTeam: 'ECU', datetime: '2026-06-18T22:00:00Z', venue: 'SoFi Stadium', city: 'Los Angeles, CA', country: 'USA', stage: 'Group G', matchday: 2, status: 'upcoming' },
  { id: 'm020', homeTeam: 'SRB', awayTeam: 'BRA', datetime: '2026-06-18T22:00:00Z', venue: 'NRG Stadium', city: 'Houston, TX', country: 'USA', stage: 'Group D', matchday: 2, status: 'upcoming' },

  // June 19
  { id: 'm021', homeTeam: 'CIV', awayTeam: 'ARG', datetime: '2026-06-19T16:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami, FL', country: 'USA', stage: 'Group E', matchday: 2, status: 'upcoming' },
  { id: 'm022', homeTeam: 'EGY', awayTeam: 'ENG', datetime: '2026-06-19T19:00:00Z', venue: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA', stage: 'Group H', matchday: 2, status: 'upcoming' },
  { id: 'm023', homeTeam: 'NZL', awayTeam: 'ESP', datetime: '2026-06-19T22:00:00Z', venue: 'Levi\'s Stadium', city: 'San Jose, CA', country: 'USA', stage: 'Group I', matchday: 2, status: 'upcoming' },
  { id: 'm024', homeTeam: 'PAR', awayTeam: 'POR', datetime: '2026-06-19T22:00:00Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta, GA', country: 'USA', stage: 'Group J', matchday: 2, status: 'upcoming' },

  // June 20
  { id: 'm025', homeTeam: 'CRC', awayTeam: 'GER', datetime: '2026-06-20T16:00:00Z', venue: 'Gillette Stadium', city: 'Boston, MA', country: 'USA', stage: 'Group K', matchday: 2, status: 'upcoming' },
  { id: 'm026', homeTeam: 'TTO', awayTeam: 'NED', datetime: '2026-06-20T19:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia, PA', country: 'USA', stage: 'Group L', matchday: 2, status: 'upcoming' },
  { id: 'm027', homeTeam: 'NGA', awayTeam: 'CAN', datetime: '2026-06-20T22:00:00Z', venue: 'BMO Field', city: 'Toronto', country: 'Canada', stage: 'Group C', matchday: 2, status: 'upcoming' },
  { id: 'm028', homeTeam: 'HON', awayTeam: 'ITA', datetime: '2026-06-20T19:00:00Z', venue: 'Arrowhead Stadium', city: 'Kansas City, MO', country: 'USA', stage: 'Group M', matchday: 2, status: 'upcoming' },

  // June 21
  { id: 'm029', homeTeam: 'JPN', awayTeam: 'COL', datetime: '2026-06-21T16:00:00Z', venue: 'Lumen Field', city: 'Seattle, WA', country: 'USA', stage: 'Group F', matchday: 2, status: 'upcoming' },
  { id: 'm030', homeTeam: 'MLI', awayTeam: 'CRO', datetime: '2026-06-21T19:00:00Z', venue: 'BC Place', city: 'Vancouver', country: 'Canada', stage: 'Group N', matchday: 2, status: 'upcoming' },
  { id: 'm031', homeTeam: 'COD', awayTeam: 'TUR', datetime: '2026-06-21T22:00:00Z', venue: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', stage: 'Group O', matchday: 2, status: 'upcoming' },
  { id: 'm032', homeTeam: 'IRN', awayTeam: 'BEL', datetime: '2026-06-21T22:00:00Z', venue: 'AT&T Stadium', city: 'Dallas, TX', country: 'USA', stage: 'Group P', matchday: 2, status: 'upcoming' },

  // ─── MATCHDAY 3 ─────────────────────────────────────────────────
  // June 25 — Groups A & B
  { id: 'm033', homeTeam: 'USA', awayTeam: 'SEN', datetime: '2026-06-25T20:00:00Z', venue: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA', stage: 'Group A', matchday: 3, status: 'upcoming' },
  { id: 'm034', homeTeam: 'PAN', awayTeam: 'SEN', datetime: '2026-06-25T20:00:00Z', venue: 'AT&T Stadium', city: 'Dallas, TX', country: 'USA', stage: 'Group A', matchday: 3, status: 'upcoming' },
  { id: 'm035', homeTeam: 'MEX', awayTeam: 'SAU', datetime: '2026-06-25T23:00:00Z', venue: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', stage: 'Group B', matchday: 3, status: 'upcoming' },
  { id: 'm036', homeTeam: 'POL', awayTeam: 'SAU', datetime: '2026-06-25T23:00:00Z', venue: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico', stage: 'Group B', matchday: 3, status: 'upcoming' },

  // June 26 — Groups C & D
  { id: 'm037', homeTeam: 'CAN', awayTeam: 'NGA', datetime: '2026-06-26T20:00:00Z', venue: 'BMO Field', city: 'Toronto', country: 'Canada', stage: 'Group C', matchday: 3, status: 'upcoming' },
  { id: 'm038', homeTeam: 'MAR', awayTeam: 'NGA', datetime: '2026-06-26T20:00:00Z', venue: 'Levi\'s Stadium', city: 'San Jose, CA', country: 'USA', stage: 'Group C', matchday: 3, status: 'upcoming' },
  { id: 'm039', homeTeam: 'BRA', awayTeam: 'SRB', datetime: '2026-06-26T23:00:00Z', venue: 'NRG Stadium', city: 'Houston, TX', country: 'USA', stage: 'Group D', matchday: 3, status: 'upcoming' },
  { id: 'm040', homeTeam: 'SUI', awayTeam: 'SRB', datetime: '2026-06-26T23:00:00Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta, GA', country: 'USA', stage: 'Group D', matchday: 3, status: 'upcoming' },

  // June 27 — Groups E & F
  { id: 'm041', homeTeam: 'ARG', awayTeam: 'CIV', datetime: '2026-06-27T20:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami, FL', country: 'USA', stage: 'Group E', matchday: 3, status: 'upcoming' },
  { id: 'm042', homeTeam: 'CHI', awayTeam: 'CIV', datetime: '2026-06-27T20:00:00Z', venue: 'Lincoln Financial Field', city: 'Philadelphia, PA', country: 'USA', stage: 'Group E', matchday: 3, status: 'upcoming' },
  { id: 'm043', homeTeam: 'COL', awayTeam: 'JPN', datetime: '2026-06-27T23:00:00Z', venue: 'Lumen Field', city: 'Seattle, WA', country: 'USA', stage: 'Group F', matchday: 3, status: 'upcoming' },
  { id: 'm044', homeTeam: 'PER', awayTeam: 'JPN', datetime: '2026-06-27T23:00:00Z', venue: 'Arrowhead Stadium', city: 'Kansas City, MO', country: 'USA', stage: 'Group F', matchday: 3, status: 'upcoming' },

  // June 28 — Groups G & H
  { id: 'm045', homeTeam: 'FRA', awayTeam: 'CMR', datetime: '2026-06-28T20:00:00Z', venue: 'SoFi Stadium', city: 'Los Angeles, CA', country: 'USA', stage: 'Group G', matchday: 3, status: 'upcoming' },
  { id: 'm046', homeTeam: 'ECU', awayTeam: 'CMR', datetime: '2026-06-28T20:00:00Z', venue: 'AT&T Stadium', city: 'Dallas, TX', country: 'USA', stage: 'Group G', matchday: 3, status: 'upcoming' },
  { id: 'm047', homeTeam: 'ENG', awayTeam: 'EGY', datetime: '2026-06-28T23:00:00Z', venue: 'Gillette Stadium', city: 'Boston, MA', country: 'USA', stage: 'Group H', matchday: 3, status: 'upcoming' },
  { id: 'm048', homeTeam: 'URU', awayTeam: 'EGY', datetime: '2026-06-28T23:00:00Z', venue: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA', stage: 'Group H', matchday: 3, status: 'upcoming' },

  // ─── KNOCKOUT ROUNDS ────────────────────────────────────────────
  // Round of 32 (June 30 – July 4)
  { id: 'r32-01', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-06-30T20:00:00Z', venue: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA', stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32-02', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-06-30T23:00:00Z', venue: 'AT&T Stadium', city: 'Dallas, TX', country: 'USA', stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32-03', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-01T20:00:00Z', venue: 'SoFi Stadium', city: 'Los Angeles, CA', country: 'USA', stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32-04', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-01T23:00:00Z', venue: 'NRG Stadium', city: 'Houston, TX', country: 'USA', stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32-05', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-02T20:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami, FL', country: 'USA', stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32-06', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-02T23:00:00Z', venue: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32-07', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-03T20:00:00Z', venue: 'Gillette Stadium', city: 'Boston, MA', country: 'USA', stage: 'Round of 32', status: 'upcoming' },
  { id: 'r32-08', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-03T23:00:00Z', venue: 'Lumen Field', city: 'Seattle, WA', country: 'USA', stage: 'Round of 32', status: 'upcoming' },

  // Round of 16 (July 6–8)
  { id: 'r16-01', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-06T20:00:00Z', venue: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA', stage: 'Round of 16', status: 'upcoming' },
  { id: 'r16-02', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-06T23:00:00Z', venue: 'AT&T Stadium', city: 'Dallas, TX', country: 'USA', stage: 'Round of 16', status: 'upcoming' },
  { id: 'r16-03', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-07T20:00:00Z', venue: 'SoFi Stadium', city: 'Los Angeles, CA', country: 'USA', stage: 'Round of 16', status: 'upcoming' },
  { id: 'r16-04', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-07T23:00:00Z', venue: 'NRG Stadium', city: 'Houston, TX', country: 'USA', stage: 'Round of 16', status: 'upcoming' },

  // Quarter-Finals (July 10–11)
  { id: 'qf-01', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-10T20:00:00Z', venue: 'AT&T Stadium', city: 'Dallas, TX', country: 'USA', stage: 'Quarter-Final', status: 'upcoming' },
  { id: 'qf-02', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-10T23:00:00Z', venue: 'SoFi Stadium', city: 'Los Angeles, CA', country: 'USA', stage: 'Quarter-Final', status: 'upcoming' },
  { id: 'qf-03', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-11T20:00:00Z', venue: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA', stage: 'Quarter-Final', status: 'upcoming' },
  { id: 'qf-04', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-11T23:00:00Z', venue: 'NRG Stadium', city: 'Houston, TX', country: 'USA', stage: 'Quarter-Final', status: 'upcoming' },

  // Semi-Finals (July 14–15)
  { id: 'sf-01', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-14T23:00:00Z', venue: 'AT&T Stadium', city: 'Dallas, TX', country: 'USA', stage: 'Semi-Final', status: 'upcoming' },
  { id: 'sf-02', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-15T23:00:00Z', venue: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA', stage: 'Semi-Final', status: 'upcoming' },

  // Third Place (July 18)
  { id: 'tp-01', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-18T20:00:00Z', venue: 'Hard Rock Stadium', city: 'Miami, FL', country: 'USA', stage: 'Third Place', status: 'upcoming' },

  // FINAL (July 19)
  { id: 'final', homeTeam: 'TBD', awayTeam: 'TBD', datetime: '2026-07-19T20:00:00Z', venue: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA', stage: 'Final', status: 'upcoming' },
];

export function getMatchesByTeam(teamCode: string): Match[] {
  return MATCHES.filter(m => m.homeTeam === teamCode || m.awayTeam === teamCode);
}

export function getMatchesByGroup(group: string): Match[] {
  return MATCHES.filter(m => m.stage === `Group ${group}`);
}

export function getMatchesByStatus(status: MatchStatus): Match[] {
  return MATCHES.filter(m => m.status === status);
}

export function getLiveMatch(): Match | undefined {
  return MATCHES.find(m => m.status === 'live');
}

export function getNextMatch(teamCodes?: string[]): Match | undefined {
  const upcoming = MATCHES.filter(m => m.status === 'upcoming');
  if (teamCodes && teamCodes.length > 0) {
    const teamMatch = upcoming.find(m =>
      teamCodes.includes(m.homeTeam) || teamCodes.includes(m.awayTeam)
    );
    if (teamMatch) return teamMatch;
  }
  return upcoming[0];
}

export function getTodayMatches(): Match[] {
  const today = '2026-06-12';
  return MATCHES.filter(m => m.datetime.startsWith(today));
}

export function getGroupStageMatches(): Match[] {
  return MATCHES.filter(m => m.stage.startsWith('Group'));
}

export function getKnockoutMatches(): Match[] {
  return MATCHES.filter(m => !m.stage.startsWith('Group'));
}
