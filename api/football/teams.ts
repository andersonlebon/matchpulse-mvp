import type { VercelRequest, VercelResponse } from '@vercel/node';
import { footballFetch, getApiKey, WC, type ApiFootballResponse } from '../_lib/football';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!getApiKey()) {
    return res.status(200).json({ source: 'static', teams: [] });
  }

  try {
    const data = await footballFetch<ApiFootballResponse<unknown[]>>('/teams', {
      league: String(WC.league),
      season: String(WC.season),
    });

    return res.status(200).json({
      source: 'api-football',
      teams: data.response,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(502).json({ error: err instanceof Error ? err.message : 'Teams fetch failed' });
  }
}
