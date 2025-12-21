import { useEffect, useState } from 'react';
import { fetchDashboardData } from '../services/api';
import { DashboardData, Lang } from '../types';
import { GitFork, Star, Terminal, Cpu, BookOpen, Activity, Globe, Clock } from 'lucide-react';

interface DashboardProps {
  lang: Lang;
  t: (key: string) => string;
}

interface IDETabProps {
  title: string;
  path: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  footerStatus?: string;
  lastSync?: string;
}

const IDETab: React.FC<IDETabProps> = ({ title, path, children, icon, footerStatus, lastSync }) => (
  <div className="border border-border-light dark:border-border-dark bg-panel-light dark:bg-panel-dark flex flex-col h-full rounded shadow-xl transition-all hover:border-accent/40">
    {/* Tab Header */}
    <div className="flex bg-slate-100 dark:bg-[#0d1117] border-b border-border-light dark:border-border-dark">
        <div className="px-4 py-2 bg-panel-light dark:bg-panel-dark border-r border-border-light dark:border-border-dark flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-widest">
           {icon}
           <span>{title}</span>
        </div>
        <div className="flex-1 flex items-center justify-end px-3 gap-1.5 opacity-20">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
        </div>
    </div>
    
    {/* Path Bar */}
    <div className="px-4 py-1.5 bg-slate-50 dark:bg-[#161b22] border-b border-border-light dark:border-border-dark flex items-center gap-2 text-[9px] text-fg-dark-muted font-mono">
       <span className="opacity-40">~</span>
       <span>/</span>
       <span className="opacity-40">streams</span>
       <span>/</span>
       <span className="text-fg-light dark:text-fg-dark">{path}</span>
    </div>

    <div className="p-4 overflow-y-auto scrollbar-hide flex-1 font-mono text-[13px] leading-relaxed">
      {children}
    </div>

    {/* Footer with sync status */}
    <div className="px-3 py-1 bg-slate-100 dark:bg-[#0d1117] border-t border-border-light dark:border-border-dark flex justify-between items-center text-[9px] font-mono text-fg-dark-muted">
       <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-accent"><Activity size={10} /> {footerStatus || 'IDLE'}</span>
          <span className="hidden sm:flex items-center gap-1"><Globe size={10} /> 127.0.0.1</span>
       </div>
       {lastSync && (
         <div className="flex items-center gap-1.5 opacity-60">
           <Clock size={9} />
           <span>{lastSync}</span>
         </div>
       )}
    </div>
  </div>
);

// Format relative time (e.g., "just now", "10m ago", "1h ago")
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  
  if (diffSec < 60) return 'just now';
  if (diffMin === 1) return '1m ago';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours === 1) return '1h ago';
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};

export const Dashboard: React.FC<DashboardProps> = ({ t }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [, setTick] = useState(0); // Force re-render for relative time updates

  useEffect(() => {
    fetchDashboardData().then(fetched => {
      setData(fetched);
      setLoading(false);
      // Use updatedAt from API (when cron ran), not page load time
      setLastUpdate(fetched.updatedAt ? new Date(fetched.updatedAt) : new Date());
    });
  }, []);

  // Update relative time display every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const syncTime = lastUpdate ? formatRelativeTime(lastUpdate) : undefined;

  if (loading || !data) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-fg-dark-muted gap-6">
         <div className="w-16 h-1 border border-border-dark overflow-hidden rounded-full">
            <div className="w-full h-full bg-accent animate-pulse"></div>
         </div>
         <p className="text-xs font-mono uppercase tracking-[0.3em] opacity-60 animate-pulse">{t('status.loading')}</p>
      </div>
    );
  }

  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full pb-10">
        
        {/* Hacker News - Log Style */}
        <div className="h-[450px]">
            <IDETab title="hn_monitor" path="hacker_news.log" icon={<Terminal size={12} />} footerStatus="SYNCED" lastSync={syncTime}>
                <div className="space-y-4">
                    {data.hackerNews.map((item, idx) => (
                        <div key={idx} className="group flex gap-4 hover:bg-white/[0.02] p-2 -mx-2 rounded transition-colors border-l border-transparent hover:border-accent/20">
                            <span className="text-fg-dark-muted opacity-30 text-[10px] pt-1">{(idx + 1).toString().padStart(2, '0')}</span>
                            <div className="flex-1 min-w-0">
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-fg-light dark:text-fg-dark hover:text-accent transition-colors block truncate font-bold">
                                    <span className="text-term-blue">[FETCH]</span> {item.title}
                                </a>
                                <div className="flex gap-4 mt-1 opacity-50 text-[10px] font-bold">
                                    <span className="text-term-orange">POINTS: {item.points}</span>
                                    <span className="text-term-purple">REPLIES: {item.comments}</span>
                                    {item.author && <span className="text-fg-dark-muted hidden sm:inline">AUTHOR: @{item.author}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </IDETab>
        </div>
        
        {/* GitHub Trending */}
        <div className="h-[450px]">
            <IDETab title="git_monitor" path="github_trending.sh" icon={<GitFork size={12} />} footerStatus="SYNCED" lastSync={syncTime}>
                <div className="space-y-3">
                    {data.github.map((item, idx) => (
                        <div key={idx} className="p-3 border border-border-light dark:border-border-dark bg-slate-50 dark:bg-white/[0.01] hover:border-accent/30 rounded group">
                            <div className="flex justify-between items-center mb-1">
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-term-blue font-bold hover:underline truncate">
                                    {item.name}
                                </a>
                                <span className="text-[9px] px-2 py-0.5 bg-term-purple/10 text-term-purple border border-term-purple/20 rounded uppercase font-black shrink-0 ml-2">
                                    {item.language}
                                </span>
                            </div>
                            <p className="text-[11px] text-fg-dark-muted mb-3 line-clamp-2 italic opacity-80 leading-snug">
                                # {item.description}
                            </p>
                            <div className="flex gap-5 text-[10px] font-black tracking-widest uppercase">
                                <span className="flex items-center gap-1.5 text-term-orange"><Star size={10} /> {item.stars?.toLocaleString()}</span>
                                <span className="flex items-center gap-1.5 text-accent"><GitFork size={10} /> {item.forks || 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </IDETab>
        </div>

        {/* LLM News */}
        <div className="h-[400px]">
            <IDETab title="neural_feed" path="llm_watch.stream" icon={<Cpu size={12} />} footerStatus="SYNCED" lastSync={syncTime}>
                <div className="space-y-3">
                    {data.llmNews.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 group">
                            <span className="text-accent shrink-0 pt-0.5 opacity-50 select-none">❯</span>
                            <div className="flex-1">
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-fg-light dark:text-fg-dark hover:text-term-orange transition-colors">
                                    {item.title}
                                </a>
                                <div className="text-[10px] mt-1 text-term-purple flex items-center gap-2">
                                   <span className="font-bold">SCORE: {item.score}</span>
                                   <span className="opacity-40">|</span>
                                   <span className="opacity-40">UTC {new Date().getHours()}:00</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </IDETab>
        </div>

        {/* LessWrong */}
        <div className="h-[400px]">
            <IDETab title="rational_db" path="essays.md" icon={<BookOpen size={12} />} footerStatus="SYNCED" lastSync={syncTime}>
                <div className="space-y-6">
                    {data.lessWrong.map((item, idx) => (
                        <div key={idx} className="relative pl-5 group cursor-pointer">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/10 group-hover:bg-accent transition-all"></div>
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                <h4 className="font-bold text-fg-light dark:text-fg-dark mb-1 group-hover:text-accent transition-colors">
                                    {item.title}
                                </h4>
                                <p className="text-[11px] text-fg-dark-muted line-clamp-2 leading-relaxed opacity-80 italic">
                                    "{item.summary}"
                                </p>
                            </a>
                        </div>
                    ))}
                </div>
            </IDETab>
        </div>

      </div>
  );
};
