import { GROUPS } from './teams';

export interface GroupPrediction {
  group: string;
  first: string;   // team code
  second: string;  // team code
}

export interface KnockoutPrediction {
  stage: string;
  slot: number;   // match slot index
  winner: string; // team code
}

export interface PredictionSet {
  groups: Record<string, GroupPrediction>;
  knockout: KnockoutPrediction[];
  champion: string;
}

export const EMPTY_PREDICTIONS: PredictionSet = {
  groups: {},
  knockout: [],
  champion: '',
};

export const POINTS_TABLE = {
  groupFirst: 5,
  groupSecond: 3,
  roundOf32: 2,
  roundOf16: 3,
  quarterFinal: 5,
  semiFinal: 8,
  champion: 15,
};

// Mock leaderboard — simulated community predictions
export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Carlos M.', flag: '🇧🇷', points: 142, avatar: 'CM', champion: 'BRA' },
  { rank: 2, name: 'Sophie L.', flag: '🇫🇷', points: 138, avatar: 'SL', champion: 'FRA' },
  { rank: 3, name: 'Ahmed K.', flag: '🇲🇦', points: 131, avatar: 'AK', champion: 'ENG' },
  { rank: 4, name: 'Yuki T.', flag: '🇯🇵', points: 127, avatar: 'YT', champion: 'ARG' },
  { rank: 5, name: 'Diego R.', flag: '🇦🇷', points: 125, avatar: 'DR', champion: 'ARG' },
  { rank: 6, name: 'Priya N.', flag: '🇮🇳', points: 119, avatar: 'PN', champion: 'ESP' },
  { rank: 7, name: 'Kofi A.', flag: '🇬🇭', points: 112, avatar: 'KA', champion: 'NGA' },
  { rank: 8, name: 'Emma W.', flag: '🇩🇪', points: 108, avatar: 'EW', champion: 'GER' },
  { rank: 9, name: 'Lucas F.', flag: '🇵🇹', points: 104, avatar: 'LF', champion: 'POR' },
  { rank: 10, name: 'Soo-Jin P.', flag: '🇰🇷', points: 99, avatar: 'SP', champion: 'KOR' },
];

// Global prediction popularity (for social proof)
export const POPULAR_PICKS: Record<string, number> = {
  BRA: 22.4,   // % of fans picking them as champion
  FRA: 18.1,
  ARG: 16.7,
  ENG: 12.3,
  ESP: 9.8,
  POR: 7.2,
  GER: 5.4,
  NED: 2.8,
  // rest share remaining %
};

export const ALL_GROUPS = Object.keys(GROUPS);
