import { useEffect, useState, useCallback } from 'react';
import { fetchDashboardData, fetchTranslations } from '../services/api';
import { DashboardData, Lang } from '../types';
import { GitFork, Star, ExternalLink } from 'lucide-react';

// Shared props interface
interface ViewProps {
  lang: Lang;
  t: (key: string) => string;
  refreshTrigger?: number;
  onSyncUpdate?: (time: string) => void;
}

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

// Shared data hook
const useDashboardData = (lang: Lang, refreshTrigger: number, onSyncUpdate?: (time: string) => void) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [translatedData, setTranslatedData] = useState<DashboardData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const fetched = await fetchDashboardData();
    setData(fetched);
    setLoading(false);
    const updateTime = fetched.updatedAt ? new Date(fetched.updatedAt) : new Date();
    setLastUpdate(updateTime);
    if (onSyncUpdate) {
      onSyncUpdate(formatRelativeTime(updateTime));
    }
  }, [onSyncUpdate]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  // Update sync time display periodically
  useEffect(() => {
    if (!lastUpdate || !onSyncUpdate) return;
    const interval = setInterval(() => {
      onSyncUpdate(formatRelativeTime(lastUpdate));
    }, 10000);
    return () => clearInterval(interval);
  }, [lastUpdate, onSyncUpdate]);

  // Translate when language changes
  useEffect(() => {
    if (!data) return;
    if (lang === 'en') {
      setTranslatedData(data);
      return;
    }
    
    const translateAllSections = async () => {
      const newData = JSON.parse(JSON.stringify(data)) as DashboardData;
      
      const allTexts: string[] = [
        ...newData.hackerNews.map(i => i.title || ''),
        ...newData.github.map(i => i.description || ''),
        ...newData.llmNews.map(i => i.title || ''),
        ...newData.lessWrong.map(i => i.title || ''),
        ...newData.lessWrong.map(i => i.summary || ''),
      ];
      
      const translated = await fetchTranslations(allTexts, lang);
      
      let idx = 0;
      newData.hackerNews.forEach((item) => { item.title = translated[idx++]; });
      newData.github.forEach((item) => { item.description = translated[idx++]; });
      newData.llmNews.forEach((item) => { item.title = translated[idx++]; });
      newData.lessWrong.forEach((item) => { item.title = translated[idx++]; });
      newData.lessWrong.forEach((item) => { item.summary = translated[idx++]; });
      
      setTranslatedData(newData);
    };
    
    translateAllSections();
  }, [data, lang]);

  return { data: translatedData || data, loading };
};

// Loading component
const LoadingState: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <div className="h-[60vh] flex flex-col items-center justify-center text-fg-dark-muted gap-6">
    <div className="w-16 h-1 border border-border-dark overflow-hidden rounded-full">
      <div className="w-full h-full bg-accent animate-pulse"></div>
    </div>
    <p className="text-xs font-mono uppercase tracking-[0.3em] opacity-60 animate-pulse">{t('status.loading')}</p>
  </div>
);

// Line numbers component
const LineNumbers: React.FC<{ count: number }> = ({ count }) => (
  <div className="select-none text-right pr-4 text-fg-dark-muted opacity-30 text-[11px] leading-relaxed border-r border-border-dark mr-4">
    {Array.from({ length: count }, (_, i) => (
      <div key={i}>{i + 1}</div>
    ))}
  </div>
);

// ===== HACKER NEWS VIEW =====
export const HackerNewsView: React.FC<ViewProps> = ({ lang, t, refreshTrigger = 0, onSyncUpdate }) => {
  const { data, loading } = useDashboardData(lang, refreshTrigger, onSyncUpdate);

  if (loading || !data) return <LoadingState t={t} />;

  return (
    <div className="max-w-4xl">
      {/* File header comment */}
      <div className="text-fg-dark-muted opacity-50 text-xs mb-4 font-mono">
        <span className="text-term-purple">// hacker_news.ts</span> - Top stories from Hacker News API
      </div>
      
      <div className="flex">
        <LineNumbers count={data.hackerNews.length + 5} />
        <div className="flex-1 space-y-2 text-[13px]">
          <div className="text-term-purple">interface</div>
          <div className="pl-4">
            <span className="text-term-blue">HNStory</span> {'{'}
          </div>
          
          {data.hackerNews.map((item, idx) => (
            <a 
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block pl-4 py-2 hover:bg-accent/5 rounded transition-colors group border-l-2 border-transparent hover:border-accent"
            >
              <div className="flex items-start gap-3">
                <span className="text-term-orange shrink-0">{(idx + 1).toString().padStart(2, '0')}.</span>
                <div className="flex-1 min-w-0">
                  <div className="text-fg-light dark:text-fg-dark group-hover:text-accent transition-colors font-medium">
                    {item.title}
                    <ExternalLink size={10} className="inline ml-2 opacity-0 group-hover:opacity-50" />
                  </div>
                  <div className="flex gap-4 mt-1 text-[10px] text-fg-dark-muted">
                    <span className="text-term-orange">points: {item.points}</span>
                    <span className="text-term-purple">comments: {item.comments}</span>
                    {item.author && <span className="hidden sm:inline">by: @{item.author}</span>}
                  </div>
                </div>
              </div>
            </a>
          ))}
          
          <div className="pl-4">{'}'}</div>
        </div>
      </div>
    </div>
  );
};

// ===== GITHUB VIEW =====
export const GithubView: React.FC<ViewProps> = ({ lang, t, refreshTrigger = 0, onSyncUpdate }) => {
  const { data, loading } = useDashboardData(lang, refreshTrigger, onSyncUpdate);

  if (loading || !data) return <LoadingState t={t} />;

  return (
    <div className="max-w-4xl">
      <div className="text-fg-dark-muted opacity-50 text-xs mb-4 font-mono">
        <span className="text-term-orange">// github.json</span> - Trending repositories
      </div>
      
      <div className="font-mono text-[13px]">
        <div className="text-fg-dark-muted opacity-60">{'{'}</div>
        <div className="pl-4 text-term-orange">"trending"</div>
        <div className="pl-4 text-fg-dark-muted">: [</div>
        
        {data.github.map((item, idx) => (
          <a 
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block ml-8 my-3 p-4 border border-border-light dark:border-border-dark rounded-lg hover:border-accent/50 transition-all bg-slate-50 dark:bg-white/[0.02] group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-term-blue font-bold group-hover:text-accent transition-colors">
                "{item.name}"
              </span>
              <span className="text-[9px] px-2 py-0.5 bg-term-purple/10 text-term-purple border border-term-purple/20 rounded uppercase font-bold">
                {item.language}
              </span>
            </div>
            <p className="text-[11px] text-fg-dark-muted italic opacity-80 mb-3 line-clamp-2">
              "{item.description}"
            </p>
            <div className="flex gap-6 text-[10px] font-bold">
              <span className="flex items-center gap-1.5 text-term-orange">
                <Star size={10} /> {item.stars?.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 text-accent">
                <GitFork size={10} /> {item.forks || 0}
              </span>
            </div>
          </a>
        ))}
        
        <div className="pl-4 text-fg-dark-muted">]</div>
        <div className="text-fg-dark-muted opacity-60">{'}'}</div>
      </div>
    </div>
  );
};

// ===== LLM NEWS VIEW =====
export const LLMView: React.FC<ViewProps> = ({ lang, t, refreshTrigger = 0, onSyncUpdate }) => {
  const { data, loading } = useDashboardData(lang, refreshTrigger, onSyncUpdate);

  if (loading || !data) return <LoadingState t={t} />;

  return (
    <div className="max-w-4xl">
      <div className="text-fg-dark-muted opacity-50 text-xs mb-4 font-mono">
        <span className="text-term-purple"># llm.py</span> - AI/ML news aggregator
      </div>
      
      <div className="font-mono text-[13px]">
        <div className="text-term-purple">class <span className="text-term-blue">LLMFeed</span>:</div>
        <div className="pl-4 text-term-purple">def <span className="text-term-orange">__init__</span>(self):</div>
        <div className="pl-8 text-fg-dark-muted opacity-60"># Latest AI news items</div>
        <div className="pl-8 mb-4">self.<span className="text-term-blue">items</span> = [</div>
        
        {data.llmNews.map((item, idx) => (
          <a 
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block ml-12 my-2 py-2 hover:bg-accent/5 rounded transition-colors group border-l border-term-purple/30 pl-4"
          >
            <div className="flex items-start gap-2">
              <span className="text-term-orange shrink-0">#{idx + 1}</span>
              <div className="flex-1">
                <div className="text-fg-light dark:text-fg-dark group-hover:text-term-orange transition-colors">
                  "{item.title}"
                </div>
                <div className="text-[10px] text-term-purple mt-1">
                  score={item.score}
                </div>
              </div>
            </div>
          </a>
        ))}
        
        <div className="pl-8">]</div>
      </div>
    </div>
  );
};

// ===== LESSWRONG VIEW =====
export const LessWrongView: React.FC<ViewProps> = ({ lang, t, refreshTrigger = 0, onSyncUpdate }) => {
  const { data, loading } = useDashboardData(lang, refreshTrigger, onSyncUpdate);

  if (loading || !data) return <LoadingState t={t} />;

  return (
    <div className="max-w-4xl">
      <div className="text-fg-dark-muted opacity-50 text-xs mb-4 font-mono">
        <span className="text-[#519aba]"># less_wrong.md</span> - Rationality essays
      </div>
      
      <div className="font-mono text-[13px] space-y-6">
        <div className="text-[#519aba] text-lg font-bold"># LessWrong Feed</div>
        
        {data.lessWrong.map((item, idx) => (
          <a 
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="text-[#519aba] mb-1">## {item.title}</div>
            <blockquote className="border-l-2 border-accent/30 pl-4 text-[12px] text-fg-dark-muted italic opacity-80 group-hover:border-accent transition-colors">
              &gt; {item.summary}
            </blockquote>
          </a>
        ))}
      </div>
    </div>
  );
};

// ===== LEGACY GRID DASHBOARD (for backward compatibility) =====
export const Dashboard: React.FC<ViewProps> = ({ lang, t }) => {
  return <HackerNewsView lang={lang} t={t} />;
};
