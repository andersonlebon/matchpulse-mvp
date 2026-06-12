import { createContext, useContext, useCallback, ReactNode } from 'react';
import { useFootballData } from '../../hooks/useFootballData';
import { Match } from '../data/matches';
import { Team, getTeam as getStaticTeam } from '../data/teams';

interface FootballContextValue {
  matches: Match[];
  teams: Record<string, Team>;
  isLive: boolean;
  isLoading: boolean;
  lastUpdated: number;
  refetch: () => void;
  getTeam: (code: string) => Team;
  getMatchesByGroup: (group: string) => Match[];
  getLiveMatch: () => Match | undefined;
}

const FootballContext = createContext<FootballContextValue | null>(null);

export function FootballProvider({ children }: { children: ReactNode }) {
  const data = useFootballData();

  const getTeam = useCallback(
    (code: string) => data.teams[code] ?? getStaticTeam(code),
    [data.teams],
  );

  const getMatchesByGroup = useCallback(
    (group: string) => data.matches.filter(m => m.stage === `Group ${group}`),
    [data.matches],
  );

  const getLiveMatch = useCallback(
    () => data.matches.find(m => m.status === 'live'),
    [data.matches],
  );

  return (
    <FootballContext.Provider value={{ ...data, getTeam, getMatchesByGroup, getLiveMatch }}>
      {children}
    </FootballContext.Provider>
  );
}

export function useFootball() {
  const ctx = useContext(FootballContext);
  if (!ctx) throw new Error('useFootball must be used within FootballProvider');
  return ctx;
}
