import type { VercelRequest, VercelResponse } from '@vercel/node';
import { footballFetch, getApiKey, WC, type ApiFootballResponse } from '../_lib/football';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!getApiKey()) {
    return res.status(200).json({ source: 'static', standings: [] });
  }

  try {
    const data = await footballFetch<ApiFootballResponse<unknown[]>>('/standings', {
      league: String(WC.league),
      season: String(WC.season),
    });

    return res.status(200).json({
      source: 'api-football',
      standings: data.response,
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(502).json({ error: err instanceof Error ? err.message : 'Standings fetch failed' });
  }
}
