import { Match, MatchStage, MatchStatus } from '../app/data/matches';
import { Team, Confederation } from '../app/data/teams';

interface ApiTeam {
  id: number;
  name: string;
  code: string | null;
  logo: string;
}

interface ApiFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
    venue: { name: string | null; city: string | null };
  };
  league: { round: string };
  teams: { home: ApiTeam; away: ApiTeam };
  goals: { home: number | null; away: number | null };
}

const NAME_TO_CODE: Record<string, string> = {
  'United States': 'USA',
  'USA': 'USA',
  'Mexico': 'MEX',
  'Canada': 'CAN',
  'Brazil': 'BRA',
  'Argentina': 'ARG',
  'France': 'FRA',
  'England': 'ENG',
  'Germany': 'GER',
  'Spain': 'ESP',
  'Portugal': 'POR',
  'Netherlands': 'NED',
  'Belgium': 'BEL',
  'Croatia': 'CRO',
  'Morocco': 'MAR',
  'Senegal': 'SEN',
  'Nigeria': 'NGA',
  'Cameroon': 'CMR',
  'Ghana': 'GHA',
  'Egypt': 'EGY',
  'South Africa': 'RSA',
  'Ivory Coast': 'CIV',
  "Cote D'Ivoire": 'CIV',
  'DR Congo': 'COD',
  'Congo DR': 'COD',
  'Democratic Republic of the Congo': 'COD',
  'Japan': 'JPN',
  'South Korea': 'KOR',
  'Korea Republic': 'KOR',
  'Saudi Arabia': 'SAU',
  'Iran': 'IRN',
  'Australia': 'AUS',
  'Uruguay': 'URU',
  'Colombia': 'COL',
  'Chile': 'CHI',
  'Ecuador': 'ECU',
  'Peru': 'PER',
  'Paraguay': 'PAR',
  'Poland': 'POL',
  'Switzerland': 'SUI',
  'Serbia': 'SRB',
  'Denmark': 'DEN',
  'Norway': 'NOR',
  'Turkey': 'TUR',
  'Italy': 'ITA',
  'Panama': 'PAN',
  'Costa Rica': 'CRC',
  'Honduras': 'HON',
  'Jamaica': 'JAM',
  'New Zealand': 'NZL',
  'Uzbekistan': 'UZB',
  'Jordan': 'JOR',
  'Mali': 'MLI',
  'Trinidad and Tobago': 'TTO',
};

const CODE_FLAGS: Record<string, string> = {
  COD: '🇨🇩', USA: '🇺🇸', MEX: '🇲🇽', CAN: '🇨🇦', BRA: '🇧🇷', ARG: '🇦🇷',
  FRA: '🇫🇷', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', GER: '🇩🇪', ESP: '🇪🇸', POR: '🇵🇹', NED: '🇳🇱',
  BEL: '🇧🇪', CRO: '🇭🇷', MAR: '🇲🇦', SEN: '🇸🇳', NGA: '🇳🇬', CMR: '🇨🇲',
  GHA: '🇬🇭', EGY: '🇪🇬', RSA: '🇿🇦', CIV: '🇨🇮', JPN: '🇯🇵', KOR: '🇰🇷',
  SAU: '🇸🇦', IRN: '🇮🇷', AUS: '🇦🇺', URU: '🇺🇾', COL: '🇨🇴', CHI: '🇨🇱',
  ECU: '🇪🇨', PER: '🇵🇪', PAR: '🇵🇾', POL: '🇵🇱', SUI: '🇨🇭', SRB: '🇷🇸',
  DEN: '🇩🇰', NOR: '🇳🇴', TUR: '🇹🇷', ITA: '🇮🇹', PAN: '🇵🇦', CRC: '🇨🇷',
  HON: '🇭🇳', JAM: '🇯🇲', NZL: '🇳🇿', UZB: '🇺🇿', JOR: '🇯🇴', MLI: '🇲🇱', TTO: '🇹🇹',
};

function resolveCode(team: ApiTeam): string {
  if (team.code && team.code.length <= 3) return team.code.toUpperCase();
  return NAME_TO_CODE[team.name] ?? team.name.slice(0, 3).toUpperCase();
}

function mapStatus(short: string): MatchStatus {
  if (['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE', 'INT'].includes(short)) return 'live';
  if (['FT', 'AET', 'PEN'].includes(short)) return 'completed';
  return 'upcoming';
}

function mapStage(round: string): MatchStage {
  const r = round.toLowerCase();
  if (r.includes('group')) {
    const letter = r.match(/group\s*([a-p])/i)?.[1]?.toUpperCase();
    if (letter) return `Group ${letter}` as MatchStage;
  }
  if (r.includes('round of 32') || r.includes('1/16')) return 'Round of 32';
  if (r.includes('round of 16') || r.includes('1/8')) return 'Round of 16';
  if (r.includes('quarter')) return 'Quarter-Final';
  if (r.includes('semi')) return 'Semi-Final';
  if (r.includes('3rd') || r.includes('third')) return 'Third Place';
  if (r.includes('final')) return 'Final';
  return 'Round of 32';
}

export function mapApiFixture(f: ApiFixture): Match {
  const homeCode = resolveCode(f.teams.home);
  const awayCode = resolveCode(f.teams.away);
  const status = mapStatus(f.fixture.status.short);

  return {
    id: `api-${f.fixture.id}`,
    homeTeam: homeCode,
    awayTeam: awayCode,
    datetime: f.fixture.date,
    venue: f.fixture.venue?.name ?? 'TBD',
    city: f.fixture.venue?.city ?? '',
    country: 'USA',
    stage: mapStage(f.league.round),
    status,
    homeScore: f.goals.home ?? undefined,
    awayScore: f.goals.away ?? undefined,
    liveMinute: f.fixture.status.elapsed ?? undefined,
  };
}

export function mapApiTeam(entry: { team: ApiTeam }): Team {
  const code = resolveCode(entry.team);
  return {
    code,
    name: entry.team.name,
    flag: CODE_FLAGS[code] ?? '🏳️',
    group: '?',
    confederation: 'CAF',
    primaryColor: '#1A56DB',
    secondaryColor: '#E53535',
  };
}

export function mergeApiTeamsIntoRecord(
  apiTeams: { team: ApiTeam }[],
  base: Record<string, Team>,
): Record<string, Team> {
  const merged = { ...base };
  for (const entry of apiTeams) {
    const t = mapApiTeam(entry);
    merged[t.code] = { ...merged[t.code], ...t, flag: merged[t.code]?.flag ?? t.flag };
  }
  return merged;
}
