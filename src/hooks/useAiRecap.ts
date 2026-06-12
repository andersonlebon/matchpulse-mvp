import { useMutation } from '@tanstack/react-query';

interface RecapRequest {
  matchSummary: string;
  prompt?: string;
}

interface RecapResponse {
  content: string;
  model?: string;
  error?: string;
}

export function useAiRecap() {
  return useMutation({
    mutationFn: async (body: RecapRequest): Promise<RecapResponse> => {
      const res = await fetch('/api/ai/recap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'AI recap failed');
      return data;
    },
  });
}
