import { createContext, useContext, useCallback, ReactNode } from 'react';
import { useFootballData, DataSource } from '../../hooks/useFootballData';
import { Match, MatchStatus } from '../data/matches';
import { Team, getTeam as getStaticTeam } from '../data/teams';
import {
  getMatchesByTeam as getMatchesByTeamHelper,
  getMatchesByStatus as getMatchesByStatusHelper,
  getNextMatch as getNextMatchHelper,
  getTodayMatches as getTodayMatchesHelper,
  getGroupStageMatches as getGroupStageMatchesHelper,
  getKnockoutMatches as getKnockoutMatchesHelper,
} from '../../lib/matchHelpers';

interface FootballContextValue {
  matches: Match[];
  teams: Record<string, Team>;
  source: DataSource;
  isLive: boolean;
  apiConfigured: boolean;
  provider: string;
  isLoading: boolean;
  error?: string;
  lastUpdated: number;
  refetch: () => void;
  getTeam: (code: string) => Team;
  getMatchesByGroup: (group: string) => Match[];
  getMatchesByTeam: (code: string) => Match[];
  getMatchesByStatus: (status: MatchStatus) => Match[];
  getLiveMatch: () => Match | undefined;
  getNextMatch: (teamCodes?: string[]) => Match | undefined;
  getTodayMatches: () => Match[];
  getGroupStageMatches: () => Match[];
  getKnockoutMatches: () => Match[];
}

const FootballContext = createContext<FootballContextValue | null>(null);

export function FootballProvider({ children }: { children: ReactNode }) {
  const data = useFootballData();
  const { matches } = data;

  const getTeam = useCallback(
    (code: string) => data.teams[code] ?? getStaticTeam(code),
    [data.teams],
  );

  const getMatchesByGroup = useCallback(
    (group: string) => matches.filter(m => m.stage === `Group ${group}`),
    [matches],
  );

  const getMatchesByTeam = useCallback(
    (code: string) => getMatchesByTeamHelper(matches, code),
    [matches],
  );

  const getMatchesByStatus = useCallback(
    (status: MatchStatus) => getMatchesByStatusHelper(matches, status),
    [matches],
  );

  const getLiveMatch = useCallback(
    () => matches.find(m => m.status === 'live'),
    [matches],
  );

  const getNextMatch = useCallback(
    (codes?: string[]) => getNextMatchHelper(matches, codes),
    [matches],
  );

  const getTodayMatches = useCallback(
    () => getTodayMatchesHelper(matches),
    [matches],
  );

  const getGroupStageMatches = useCallback(
    () => getGroupStageMatchesHelper(matches),
    [matches],
  );

  const getKnockoutMatches = useCallback(
    () => getKnockoutMatchesHelper(matches),
    [matches],
  );

  const ctx: FootballContextValue = {
    ...data,
    getTeam,
    getMatchesByGroup,
    getMatchesByTeam,
    getMatchesByStatus,
    getLiveMatch,
    getNextMatch,
    getTodayMatches,
    getGroupStageMatches,
    getKnockoutMatches,
  };

  return (
    <FootballContext.Provider value={ctx}>
      {children}
    </FootballContext.Provider>
  );
}

export function useFootball() {
  const ctx = useContext(FootballContext);
  if (!ctx) throw new Error('useFootball must be used within FootballProvider');
  return ctx;
}
