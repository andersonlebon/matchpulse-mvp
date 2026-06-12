const API_BASE = 'https://v3.football.api-sports.io';
const WC_LEAGUE = 1;
const WC_SEASON = 2026;

export function getApiKey(): string | undefined {
  return process.env.API_FOOTBALL_KEY || process.env.VITE_API_FOOTBALL_KEY;
}

export async function footballFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const key = getApiKey();
  if (!key) throw new Error('API_FOOTBALL_KEY not configured');

  const url = new URL(`${API_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { 'x-apisports-key': key },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API-Football error ${res.status}: ${text.slice(0, 200)}`);
  }

  return res.json() as Promise<T>;
}

export const WC = { league: WC_LEAGUE, season: WC_SEASON };

export interface ApiFootballResponse<T> {
  response: T;
  results: number;
  errors?: Record<string, string>;
}
