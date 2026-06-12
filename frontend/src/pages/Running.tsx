import { useEffect, useState } from 'react';
import { Footprints, ExternalLink, Loader2 } from 'lucide-react';
import { fetchStrava, StravaData } from '../services/api';

const fmtPace = (sec: number | null): string => {
  if (!sec) return '–';
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
};

const fmtDuration = (sec: number): string => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
};

export const RunningView = () => {
  const [data, setData] = useState<StravaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchStrava().then((d) => {
      if (!cancelled) {
        setData(d);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-fg-dark-muted text-xs font-mono p-4">
        <Loader2 size={14} className="animate-spin" />
        <span>tail -f running.log ...</span>
      </div>
    );
  }

  if (!data || !data.week) {
    return (
      <div className="text-xs font-mono p-4 text-fg-dark-muted">
        telemetry offline — splits at{' '}
        <a
          href="https://www.strava.com/athletes/kutsenko"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          strava.com/athletes/kutsenko
        </a>
      </div>
    );
  }

  const stats = [
    { label: 'this week', value: `${data.week.miles} mi`, sub: `${data.week.runs} runs` },
    ...(data.ytd ? [{ label: 'this year', value: `${data.ytd.miles} mi`, sub: `${data.ytd.runs} runs` }] : []),
    ...(data.all ? [{ label: 'all time', value: `${data.all.miles} mi`, sub: `${data.all.runs} runs` }] : []),
  ];

  return (
    <div className="max-w-3xl font-mono text-sm">
      <div className="text-fg-dark-muted opacity-50 text-xs mb-6">
        <span className="text-[#519aba]"># running.log</span> - live telemetry from Strava
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-black/10 dark:bg-black/20 rounded p-4">
            <div className="text-term-purple text-[10px] uppercase tracking-widest mb-1">{s.label}</div>
            <div className="text-xl font-bold text-fg-light dark:text-fg-dark">{s.value}</div>
            <div className="text-fg-dark-muted text-[11px]">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="text-term-purple text-[11px] uppercase tracking-widest mb-3">## Recent runs</div>
      <div className="space-y-2">
        {data.recent.map((run, i) => (
          <div key={`${run.date}-${i}`} className="flex items-baseline gap-3 border-l-2 border-accent/30 pl-3 py-1">
            <Footprints size={12} className="text-accent shrink-0 self-center" />
            <div className="flex-1 min-w-0">
              <div className="text-fg-light dark:text-fg-dark truncate">{run.name}</div>
              <div className="text-fg-dark-muted text-[11px]">
                {run.date} · {run.miles} mi · {fmtPace(run.paceSecPerMile)}/mi · {fmtDuration(run.movingTimeSec)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <a
        href="https://www.strava.com/athletes/kutsenko"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-8 text-xs text-fg-dark-muted hover:text-accent transition-colors"
      >
        full log on Strava
        <ExternalLink size={10} />
      </a>
    </div>
  );
};
