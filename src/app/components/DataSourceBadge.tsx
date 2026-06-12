import { Radio, AlertTriangle, Database } from 'lucide-react';
import { useFootball } from '../context/FootballContext';

export function DataSourceBadge({ compact = false }: { compact?: boolean }) {
  const { source, isLive, apiConfigured, provider, isLoading } = useFootball();

  if (isLoading) return null;

  if (isLive) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-[#16A34A] font-semibold ${compact ? 'text-xs' : 'text-sm'}`}>
        <Radio className="w-3.5 h-3.5" />
        {compact ? 'Live' : `Live · ${provider}`}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${
        apiConfigured
          ? 'border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]'
          : 'border-border bg-secondary text-muted-foreground'
      } ${compact ? 'text-xs' : 'text-sm'}`}
      title={apiConfigured ? 'API key set but live fixtures unavailable — showing demo fallback' : 'Add API_FOOTBALL_KEY in Vercel for live World Cup data'}
    >
      {apiConfigured ? <AlertTriangle className="w-3 h-3" /> : <Database className="w-3 h-3" />}
      {compact ? 'Demo data' : `Demo data · add API_FOOTBALL_KEY to Vercel`}
    </span>
  );
}
