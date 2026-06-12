import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'OPENROUTER_API_KEY not configured' });
  }

  const { matchSummary, prompt } = req.body as { matchSummary?: string; prompt?: string };
  const userPrompt = prompt || `Write a concise FIFA World Cup 2026 match recap (headline, 3 key moments, tactical insight) for:\n${matchSummary}`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://matchpulse-mvp.vercel.app',
        'X-Title': 'MatchPulse Pulse AI',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are Pulse AI, the MatchPulse World Cup analyst. Be concise, factual, and fan-friendly. Use markdown sparingly.',
          },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `OpenRouter error: ${errText.slice(0, 300)}` });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '';

    return res.status(200).json({
      content,
      model: data.model,
      source: 'openrouter',
    });
  } catch (err) {
    return res.status(502).json({ error: err instanceof Error ? err.message : 'AI recap failed' });
  }
}
