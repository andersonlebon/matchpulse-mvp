import { useQuery } from '@tanstack/react-query';
import { MATCHES, Match } from '../app/data/matches';
import { TEAMS, Team } from '../app/data/teams';
import { mapApiFixture, mergeApiTeamsIntoRecord } from '../lib/footballMapper';

interface FixturesResponse {
  source: string;
  fixtures?: unknown[];
  error?: string;
}

interface TeamsResponse {
  source: string;
  teams?: { team: { id: number; name: string; code: string | null; logo: string } }[];
}

export function useFootballData() {
  const fixturesQuery = useQuery({
    queryKey: ['football', 'fixtures', 'wc2026'],
    queryFn: async (): Promise<{ matches: Match[]; source: string }> => {
      try {
        const res = await fetch('/api/football/fixtures');
        const data: FixturesResponse = await res.json();
        if (data.fixtures && data.fixtures.length > 0) {
          const matches = (data.fixtures as Parameters<typeof mapApiFixture>[0][]).map(mapApiFixture);
          return { matches, source: data.source };
        }
      } catch {
        // fall through
      }
      return { matches: MATCHES, source: 'static' };
    },
    refetchInterval: 30_000,
    staleTime: 15_000,
    placeholderData: { matches: MATCHES, source: 'static' },
  });

  const teamsQuery = useQuery({
    queryKey: ['football', 'teams', 'wc2026'],
    queryFn: async (): Promise<{ teams: Record<string, Team>; source: string }> => {
      try {
        const res = await fetch('/api/football/teams');
        const data: TeamsResponse = await res.json();
        if (data.teams && data.teams.length > 0) {
          return {
            teams: mergeApiTeamsIntoRecord(data.teams, TEAMS),
            source: data.source,
          };
        }
      } catch {
        // fall through
      }
      return { teams: TEAMS, source: 'static' };
    },
    staleTime: 300_000,
    placeholderData: { teams: TEAMS, source: 'static' },
  });

  const matches = fixturesQuery.data?.matches ?? MATCHES;
  const teams = teamsQuery.data?.teams ?? TEAMS;
  const isLive = fixturesQuery.data?.source === 'api-football';

  return {
    matches,
    teams,
    isLive,
    isLoading: fixturesQuery.isLoading,
    lastUpdated: fixturesQuery.dataUpdatedAt,
    refetch: fixturesQuery.refetch,
  };
}
