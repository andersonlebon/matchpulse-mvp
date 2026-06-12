import { useState, useEffect } from 'react';

interface Props {
  targetDate: string; // ISO UTC
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n: number) { return String(n).padStart(2, '0'); }

export function CountdownTimer({ targetDate, label, size = 'md' }: Props) {
  const [time, setTime] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const unitClass = size === 'lg'
    ? 'text-5xl md:text-7xl'
    : size === 'sm'
    ? 'text-2xl'
    : 'text-3xl md:text-4xl';

  const labelClass = size === 'lg' ? 'text-xs tracking-widest' : 'text-xs tracking-wider';

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</p>
      )}
      <div className="flex items-end gap-2 md:gap-4">
        {time.days > 0 && (
          <>
            <div className="flex flex-col items-center">
              <span
                className={`font-['Barlow_Condensed'] font-black text-foreground tabular-nums ${unitClass}`}
                style={{ textShadow: '0 0 30px rgba(26,86,219,0.4)' }}
              >
                {pad(time.days)}
              </span>
              <span className={`text-muted-foreground uppercase ${labelClass}`}>days</span>
            </div>
            <span className={`font-['Barlow_Condensed'] font-black text-primary pb-3 ${unitClass}`}>:</span>
          </>
        )}
        <div className="flex flex-col items-center">
          <span
            className={`font-['Barlow_Condensed'] font-black text-foreground tabular-nums ${unitClass}`}
            style={{ textShadow: '0 0 30px rgba(26,86,219,0.4)' }}
          >
            {pad(time.hours)}
          </span>
          <span className={`text-muted-foreground uppercase ${labelClass}`}>hrs</span>
        </div>
        <span className={`font-['Barlow_Condensed'] font-black text-primary pb-3 ${unitClass}`}>:</span>
        <div className="flex flex-col items-center">
          <span
            className={`font-['Barlow_Condensed'] font-black text-foreground tabular-nums ${unitClass}`}
            style={{ textShadow: '0 0 30px rgba(26,86,219,0.4)' }}
          >
            {pad(time.minutes)}
          </span>
          <span className={`text-muted-foreground uppercase ${labelClass}`}>min</span>
        </div>
        <span className={`font-['Barlow_Condensed'] font-black text-primary pb-3 ${unitClass}`}>:</span>
        <div className="flex flex-col items-center">
          <span
            className={`font-['Barlow_Condensed'] font-black text-accent tabular-nums ${unitClass}`}
            style={{ textShadow: '0 0 30px rgba(229,53,53,0.4)' }}
          >
            {pad(time.seconds)}
          </span>
          <span className={`text-muted-foreground uppercase ${labelClass}`}>sec</span>
        </div>
      </div>
    </div>
  );
}
