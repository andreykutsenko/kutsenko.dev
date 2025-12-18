import { useEffect, useState } from 'react';
import { fetchDashboardData, fetchTranslations } from '../services/api';
import { DashboardData, Lang } from '../types';
import { GitFork, Star, ArrowUpRight, Cpu, BookOpen, Terminal } from 'lucide-react';

interface DashboardProps {
  lang: Lang;
  t: (key: string) => string;
}

interface TerminalPanelProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ title, children, icon }) => (
  <div className="border border-border-light dark:border-border-dark bg-panel-light dark:bg-panel-dark flex flex-col h-full rounded-lg overflow-hidden shadow-sm dark:shadow-black/40 group transition-all hover:border-slate-300 dark:hover:border-slate-600">
    <div className="px-4 py-3 bg-slate-50 dark:bg-[#1f242e] border-b border-border-light dark:border-border-dark shrink-0 flex items-center justify-between">
      <div className="flex items-center gap-3">
         <div className="flex gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
         </div>
         <h3 className="text-xs font-semibold text-slate-500 dark:text-fg-dark-muted ml-2 font-mono flex items-center gap-2">
            {icon}
            {title}
         </h3>
      </div>
    </div>
    <div className="p-5 overflow-y-auto scrollbar-hide flex-1 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      {children}
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ lang, t }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [translatedData, setTranslatedData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData().then(fetched => {
      setData(fetched);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!data) return;
    if (lang === 'en') {
      setTranslatedData(data);
      return;
    }
    const translateSection = async () => {
       const newData = JSON.parse(JSON.stringify(data)) as DashboardData;
       const hnTitles = await fetchTranslations(newData.hackerNews.map(i => i.title || ''), lang);
       newData.hackerNews.forEach((item, i) => item.title = hnTitles[i]);
       setTranslatedData(newData);
    };
    translateSection();
  }, [data, lang]);

  const displayData = translatedData || data;

  if (loading || !displayData) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-fg-dark-muted gap-4">
         <div className="relative">
             <div className="w-12 h-12 border-2 border-accent/30 rounded-full animate-ping absolute inset-0"></div>
             <div className="w-12 h-12 border-2 border-accent rounded-full flex items-center justify-center">
                 <Terminal size={20} className="text-accent" />
             </div>
         </div>
         <p className="text-xs font-mono uppercase tracking-widest opacity-70 animate-pulse">{t('status.loading')}</p>
      </div>
    );
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 h-full pb-10">
        
        {/* Hacker News */}
        <div className="h-full min-h-[300px]">
            <TerminalPanel title="news_feed.sh" icon={<Terminal size={12} />}>
            <div className="space-y-5">
                {displayData.hackerNews.map((item, idx) => (
                <div key={idx} className="group">
                    <div className="flex items-start gap-3">
                        <span className="text-accent/50 font-mono text-xs mt-0.5">{(idx + 1).toString().padStart(2, '0')}</span>
                        <div>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-fg-light dark:text-fg-dark hover:text-accent-light dark:hover:text-accent transition-colors leading-tight block">
                                {item.title}
                            </a>
                            <div className="mt-1.5 flex gap-3 text-[10px] text-fg-dark-muted font-mono">
                                <span className="bg-slate-200 dark:bg-white/5 px-1.5 py-0.5 rounded">{item.points} pts</span>
                                <span className="flex items-center">{item.comments} comments</span>
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            </TerminalPanel>
        </div>
        
        {/* GitHub Trending */}
        <div className="h-full min-h-[300px]">
            <TerminalPanel title="git_status" icon={<GitFork size={12} />}>
            <div className="space-y-3">
                {displayData.github.map((item, idx) => (
                <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-4 border border-border-light dark:border-border-dark bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:border-accent-light/50 dark:hover:border-accent/30 transition-all rounded-md group">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-bold text-accent-light dark:text-accent group-hover:underline decoration-1 underline-offset-4">{item.name}</span>
                        <div className="text-[10px] text-fg-dark-muted flex items-center gap-1.5 bg-white dark:bg-black/20 px-2 py-0.5 rounded-full border border-border-light dark:border-white/5">
                            <span className="w-1.5 h-1.5 rounded-full bg-term-cyan"></span>
                            {item.language}
                        </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
                        {item.description}
                    </p>
                    <div className="flex gap-4 text-[10px] text-fg-dark-muted font-mono opacity-80">
                        <span className="flex items-center gap-1"><Star size={11} /> {item.stars?.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><GitFork size={11} /> {item.forks || '0'}</span>
                    </div>
                </a>
                ))}
            </div>
            </TerminalPanel>
        </div>

        {/* LLM News */}
        <div className="h-full min-h-[250px]">
            <TerminalPanel title="llm_watch" icon={<Cpu size={12} />}>
            <ul className="space-y-3">
                {displayData.llmNews.map((item, idx) => (
                <li key={idx} className="flex items-start justify-between gap-4 text-xs group cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded -mx-2 transition-colors">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
                        <span className="font-mono text-accent-light dark:text-accent mr-2 opacity-50 group-hover:opacity-100">$</span>
                        {item.title}
                        </a>
                        <span className="text-fg-dark-muted font-mono text-[10px] shrink-0 bg-slate-200 dark:bg-white/10 px-1.5 rounded h-fit py-0.5">{item.score}</span>
                </li>
                ))}
            </ul>
            </TerminalPanel>
        </div>

        {/* LessWrong */}
        <div className="h-full min-h-[250px]">
            <TerminalPanel title="rationality_buffer" icon={<BookOpen size={12} />}>
            <div className="space-y-4">
                {displayData.lessWrong.map((item, idx) => (
                <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="block group relative pl-3 border-l-2 border-transparent hover:border-accent transition-colors">
                    <h4 className="font-bold text-sm text-fg-light dark:text-fg-dark group-hover:text-accent-light dark:group-hover:text-accent transition-colors flex items-center gap-2">
                        {item.title}
                        <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 leading-relaxed line-clamp-2">{item.summary}</p>
                </a>
                ))}
            </div>
            </TerminalPanel>
        </div>

      </div>
  );
};

