import { useQuery } from '@tanstack/react-query';
import { MATCHES, Match } from '../app/data/matches';
import { TEAMS, Team } from '../app/data/teams';
import { mapApiFixture, mergeApiTeamsIntoRecord } from '../lib/footballMapper';

export type DataSource = 'api-football' | 'demo' | 'error';

interface FixturesResponse {
  source: string;
  fixtures?: unknown[];
  error?: string;
  message?: string;
}

interface TeamsResponse {
  source: string;
  teams?: { team: { id: number; name: string; code: string | null; logo: string } }[];
  error?: string;
}

interface StatusResponse {
  configured: boolean;
  provider: string;
}

export function useFootballData() {
  const statusQuery = useQuery({
    queryKey: ['football', 'status'],
    queryFn: async (): Promise<StatusResponse> => {
      const res = await fetch('/api/football/status');
      return res.json();
    },
    staleTime: 60_000,
  });

  const fixturesQuery = useQuery({
    queryKey: ['football', 'fixtures', 'wc2026'],
    queryFn: async (): Promise<{ matches: Match[]; source: DataSource; error?: string }> => {
      const res = await fetch('/api/football/fixtures');
      const data: FixturesResponse = await res.json();

      if (data.source === 'api-football' && data.fixtures && data.fixtures.length > 0) {
        const matches = (data.fixtures as Parameters<typeof mapApiFixture>[0][]).map(mapApiFixture);
        return { matches, source: 'api-football' };
      }

      if (data.error) {
        return { matches: MATCHES, source: 'error', error: data.error };
      }

      if (data.source === 'static' || data.message?.includes('not set')) {
        return { matches: MATCHES, source: 'demo' };
      }

      if (data.source === 'api-football' && (!data.fixtures || data.fixtures.length === 0)) {
        return { matches: MATCHES, source: 'demo', error: 'API connected but no WC 2026 fixtures returned yet' };
      }

      return { matches: MATCHES, source: 'demo' };
    },
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  const teamsQuery = useQuery({
    queryKey: ['football', 'teams', 'wc2026'],
    queryFn: async (): Promise<{ teams: Record<string, Team>; source: DataSource }> => {
      try {
        const res = await fetch('/api/football/teams');
        const data: TeamsResponse = await res.json();
        if (data.teams && data.teams.length > 0) {
          return {
            teams: mergeApiTeamsIntoRecord(data.teams, TEAMS),
            source: 'api-football',
          };
        }
      } catch {
        // fall through
      }
      return { teams: TEAMS, source: 'demo' };
    },
    staleTime: 300_000,
  });

  const matches = fixturesQuery.data?.matches ?? MATCHES;
  const teams = teamsQuery.data?.teams ?? TEAMS;
  const source: DataSource = fixturesQuery.data?.source ?? 'demo';
  const isLive = source === 'api-football';
  const apiConfigured = statusQuery.data?.configured ?? false;

  return {
    matches,
    teams,
    source,
    isLive,
    apiConfigured,
    provider: statusQuery.data?.provider ?? 'API-Football',
    isLoading: fixturesQuery.isLoading,
    error: fixturesQuery.data?.error,
    lastUpdated: fixturesQuery.dataUpdatedAt,
    refetch: fixturesQuery.refetch,
  };
}
