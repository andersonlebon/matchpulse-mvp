import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getApiKey } from '../_lib/football';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const configured = Boolean(getApiKey());
  return res.status(200).json({
    provider: 'API-Football (api-sports.io)',
    configured,
    league: 1,
    season: 2026,
    message: configured
      ? 'Live World Cup 2026 data enabled'
      : 'Add API_FOOTBALL_KEY in Vercel env for live data',
  });
}
