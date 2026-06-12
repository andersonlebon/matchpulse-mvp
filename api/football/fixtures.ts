import type { VercelRequest, VercelResponse } from '@vercel/node';
import { footballFetch, getApiKey, WC, type ApiFootballResponse } from '../_lib/football';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!getApiKey()) {
    return res.status(200).json({ source: 'static', matches: [], message: 'API_FOOTBALL_KEY not set — using client fallback' });
  }

  try {
    const live = req.query.live === 'true';
    const fixtureId = req.query.id as string | undefined;

    const params: Record<string, string> = live
      ? { live: 'all' }
      : fixtureId
        ? { id: fixtureId }
        : { league: String(WC.league), season: String(WC.season) };

    const data = await footballFetch<ApiFootballResponse<unknown[]>>('/fixtures', params);

    return res.status(200).json({
      source: 'api-football',
      results: data.results,
      fixtures: data.response,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(502).json({
      error: err instanceof Error ? err.message : 'Football API failed',
      source: 'error',
    });
  }
}
