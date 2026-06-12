export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';

export interface Team {
  code: string;
  name: string;
  flag: string;
  group: string;
  confederation: Confederation;
  primaryColor: string;
  secondaryColor: string;
}

export const TEAMS: Record<string, Team> = {
  // Group A
  USA: { code: 'USA', name: 'United States', flag: '🇺🇸', group: 'A', confederation: 'CONCACAF', primaryColor: '#002868', secondaryColor: '#BF0A30' },
  PAN: { code: 'PAN', name: 'Panama', flag: '🇵🇦', group: 'A', confederation: 'CONCACAF', primaryColor: '#DA121A', secondaryColor: '#FFFFFF' },
  SEN: { code: 'SEN', name: 'Senegal', flag: '🇸🇳', group: 'A', confederation: 'CAF', primaryColor: '#00853F', secondaryColor: '#FDEF42' },

  // Group B
  MEX: { code: 'MEX', name: 'Mexico', flag: '🇲🇽', group: 'B', confederation: 'CONCACAF', primaryColor: '#006847', secondaryColor: '#CE1126' },
  POL: { code: 'POL', name: 'Poland', flag: '🇵🇱', group: 'B', confederation: 'UEFA', primaryColor: '#DC143C', secondaryColor: '#FFFFFF' },
  SAU: { code: 'SAU', name: 'Saudi Arabia', flag: '🇸🇦', group: 'B', confederation: 'AFC', primaryColor: '#006C35', secondaryColor: '#FFFFFF' },

  // Group C
  CAN: { code: 'CAN', name: 'Canada', flag: '🇨🇦', group: 'C', confederation: 'CONCACAF', primaryColor: '#FF0000', secondaryColor: '#FFFFFF' },
  MAR: { code: 'MAR', name: 'Morocco', flag: '🇲🇦', group: 'C', confederation: 'CAF', primaryColor: '#C1272D', secondaryColor: '#006233' },
  NGA: { code: 'NGA', name: 'Nigeria', flag: '🇳🇬', group: 'C', confederation: 'CAF', primaryColor: '#008751', secondaryColor: '#FFFFFF' },

  // Group D
  BRA: { code: 'BRA', name: 'Brazil', flag: '🇧🇷', group: 'D', confederation: 'CONMEBOL', primaryColor: '#009C3B', secondaryColor: '#FFDF00' },
  SUI: { code: 'SUI', name: 'Switzerland', flag: '🇨🇭', group: 'D', confederation: 'UEFA', primaryColor: '#FF0000', secondaryColor: '#FFFFFF' },
  SRB: { code: 'SRB', name: 'Serbia', flag: '🇷🇸', group: 'D', confederation: 'UEFA', primaryColor: '#C6363C', secondaryColor: '#0C4076' },

  // Group E
  ARG: { code: 'ARG', name: 'Argentina', flag: '🇦🇷', group: 'E', confederation: 'CONMEBOL', primaryColor: '#74ACDF', secondaryColor: '#FFFFFF' },
  CHI: { code: 'CHI', name: 'Chile', flag: '🇨🇱', group: 'E', confederation: 'CONMEBOL', primaryColor: '#D52B1E', secondaryColor: '#FFFFFF' },
  CIV: { code: 'CIV', name: 'Ivory Coast', flag: '🇨🇮', group: 'E', confederation: 'CAF', primaryColor: '#F77F00', secondaryColor: '#009A44' },

  // Group F
  COL: { code: 'COL', name: 'Colombia', flag: '🇨🇴', group: 'F', confederation: 'CONMEBOL', primaryColor: '#FCD116', secondaryColor: '#003087' },
  PER: { code: 'PER', name: 'Peru', flag: '🇵🇪', group: 'F', confederation: 'CONMEBOL', primaryColor: '#D91023', secondaryColor: '#FFFFFF' },
  JPN: { code: 'JPN', name: 'Japan', flag: '🇯🇵', group: 'F', confederation: 'AFC', primaryColor: '#003087', secondaryColor: '#BC002D' },

  // Group G
  FRA: { code: 'FRA', name: 'France', flag: '🇫🇷', group: 'G', confederation: 'UEFA', primaryColor: '#002395', secondaryColor: '#ED2939' },
  ECU: { code: 'ECU', name: 'Ecuador', flag: '🇪🇨', group: 'G', confederation: 'CONMEBOL', primaryColor: '#FFD100', secondaryColor: '#003DA5' },
  CMR: { code: 'CMR', name: 'Cameroon', flag: '🇨🇲', group: 'G', confederation: 'CAF', primaryColor: '#007A5E', secondaryColor: '#CE1126' },

  // Group H
  ENG: { code: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'H', confederation: 'UEFA', primaryColor: '#FFFFFF', secondaryColor: '#CE1126' },
  URU: { code: 'URU', name: 'Uruguay', flag: '🇺🇾', group: 'H', confederation: 'CONMEBOL', primaryColor: '#75AADB', secondaryColor: '#FFFFFF' },
  EGY: { code: 'EGY', name: 'Egypt', flag: '🇪🇬', group: 'H', confederation: 'CAF', primaryColor: '#CE1126', secondaryColor: '#FFFFFF' },

  // Group I
  ESP: { code: 'ESP', name: 'Spain', flag: '🇪🇸', group: 'I', confederation: 'UEFA', primaryColor: '#AA151B', secondaryColor: '#F1BF00' },
  KOR: { code: 'KOR', name: 'South Korea', flag: '🇰🇷', group: 'I', confederation: 'AFC', primaryColor: '#CD2E3A', secondaryColor: '#003478' },
  NZL: { code: 'NZL', name: 'New Zealand', flag: '🇳🇿', group: 'I', confederation: 'OFC', primaryColor: '#003087', secondaryColor: '#FFFFFF' },

  // Group J
  POR: { code: 'POR', name: 'Portugal', flag: '🇵🇹', group: 'J', confederation: 'UEFA', primaryColor: '#009246', secondaryColor: '#CE2028' },
  DEN: { code: 'DEN', name: 'Denmark', flag: '🇩🇰', group: 'J', confederation: 'UEFA', primaryColor: '#C60C30', secondaryColor: '#FFFFFF' },
  PAR: { code: 'PAR', name: 'Paraguay', flag: '🇵🇾', group: 'J', confederation: 'CONMEBOL', primaryColor: '#D52B1E', secondaryColor: '#0038A8' },

  // Group K
  GER: { code: 'GER', name: 'Germany', flag: '🇩🇪', group: 'K', confederation: 'UEFA', primaryColor: '#000000', secondaryColor: '#DD0000' },
  AUS: { code: 'AUS', name: 'Australia', flag: '🇦🇺', group: 'K', confederation: 'AFC', primaryColor: '#00843D', secondaryColor: '#FFD700' },
  CRC: { code: 'CRC', name: 'Costa Rica', flag: '🇨🇷', group: 'K', confederation: 'CONCACAF', primaryColor: '#002B7F', secondaryColor: '#CE1126' },

  // Group L
  NED: { code: 'NED', name: 'Netherlands', flag: '🇳🇱', group: 'L', confederation: 'UEFA', primaryColor: '#FF6600', secondaryColor: '#FFFFFF' },
  UZB: { code: 'UZB', name: 'Uzbekistan', flag: '🇺🇿', group: 'L', confederation: 'AFC', primaryColor: '#1EB53A', secondaryColor: '#FFFFFF' },
  TTO: { code: 'TTO', name: 'Trinidad & Tobago', flag: '🇹🇹', group: 'L', confederation: 'CONCACAF', primaryColor: '#CE1126', secondaryColor: '#000000' },

  // Group M
  ITA: { code: 'ITA', name: 'Italy', flag: '🇮🇹', group: 'M', confederation: 'UEFA', primaryColor: '#003087', secondaryColor: '#FFFFFF' },
  JOR: { code: 'JOR', name: 'Jordan', flag: '🇯🇴', group: 'M', confederation: 'AFC', primaryColor: '#007A3D', secondaryColor: '#CE1126' },
  HON: { code: 'HON', name: 'Honduras', flag: '🇭🇳', group: 'M', confederation: 'CONCACAF', primaryColor: '#003DA5', secondaryColor: '#FFFFFF' },

  // Group N
  CRO: { code: 'CRO', name: 'Croatia', flag: '🇭🇷', group: 'N', confederation: 'UEFA', primaryColor: '#FF0000', secondaryColor: '#FFFFFF' },
  NOR: { code: 'NOR', name: 'Norway', flag: '🇳🇴', group: 'N', confederation: 'UEFA', primaryColor: '#EF2B2D', secondaryColor: '#FFFFFF' },
  MLI: { code: 'MLI', name: 'Mali', flag: '🇲🇱', group: 'N', confederation: 'CAF', primaryColor: '#009A00', secondaryColor: '#FFCD00' },

  // Group O
  TUR: { code: 'TUR', name: 'Turkey', flag: '🇹🇷', group: 'O', confederation: 'UEFA', primaryColor: '#E30A17', secondaryColor: '#FFFFFF' },
  RSA: { code: 'RSA', name: 'South Africa', flag: '🇿🇦', group: 'O', confederation: 'CAF', primaryColor: '#007A4D', secondaryColor: '#FFB81C' },
  JAM: { code: 'JAM', name: 'Jamaica', flag: '🇯🇲', group: 'O', confederation: 'CONCACAF', primaryColor: '#000000', secondaryColor: '#F9C623' },

  // Group P
  BEL: { code: 'BEL', name: 'Belgium', flag: '🇧🇪', group: 'P', confederation: 'UEFA', primaryColor: '#EF3340', secondaryColor: '#000000' },
  GHA: { code: 'GHA', name: 'Ghana', flag: '🇬🇭', group: 'P', confederation: 'CAF', primaryColor: '#006B3F', secondaryColor: '#FCD116' },
  IRN: { code: 'IRN', name: 'Iran', flag: '🇮🇷', group: 'P', confederation: 'AFC', primaryColor: '#239F40', secondaryColor: '#DA0000' },
};

export const GROUPS: Record<string, string[]> = {
  A: ['USA', 'PAN', 'SEN'],
  B: ['MEX', 'POL', 'SAU'],
  C: ['CAN', 'MAR', 'NGA'],
  D: ['BRA', 'SUI', 'SRB'],
  E: ['ARG', 'CHI', 'CIV'],
  F: ['COL', 'PER', 'JPN'],
  G: ['FRA', 'ECU', 'CMR'],
  H: ['ENG', 'URU', 'EGY'],
  I: ['ESP', 'KOR', 'NZL'],
  J: ['POR', 'DEN', 'PAR'],
  K: ['GER', 'AUS', 'CRC'],
  L: ['NED', 'UZB', 'TTO'],
  M: ['ITA', 'JOR', 'HON'],
  N: ['CRO', 'NOR', 'MLI'],
  O: ['TUR', 'RSA', 'JAM'],
  P: ['BEL', 'GHA', 'IRN'],
};

export function getTeam(code: string): Team {
  return TEAMS[code] ?? { code, name: code, flag: '🏳️', group: '?', confederation: 'UEFA', primaryColor: '#666', secondaryColor: '#999' };
}

export function getGroupTeams(group: string): Team[] {
  return (GROUPS[group] ?? []).map(code => TEAMS[code]).filter(Boolean);
}

export function getAllTeams(): Team[] {
  return Object.values(TEAMS);
}
