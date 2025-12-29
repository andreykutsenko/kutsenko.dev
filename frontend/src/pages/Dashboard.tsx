import { useEffect, useState, useCallback } from 'react';
import { fetchDashboardData, fetchTranslations } from '../services/api';
import { DashboardData, Lang } from '../types';
import { GitFork, Star, ExternalLink, Code, Eye } from 'lucide-react';
import { BookmarkItem } from '../hooks/useBookmarks';

// Shared props interface
interface ViewProps {
  lang: Lang;
  t: (key: string) => string;
  refreshTrigger?: number;
  onSyncUpdate?: (time: string) => void;
  isBookmarked?: (id: string) => boolean;
  toggleBookmark?: (item: Omit<BookmarkItem, 'savedAt'>) => void;
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

  return { data: translatedData || data, rawData: data, loading };
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

// View Mode Toggle
const ViewModeToggle: React.FC<{ mode: 'preview' | 'raw'; onChange: (mode: 'preview' | 'raw') => void }> = ({ mode, onChange }) => (
  <div className="flex items-center gap-1 border border-border-light dark:border-border-dark rounded p-0.5 bg-slate-100 dark:bg-black/30">
    <button
      onClick={() => onChange('preview')}
      className={`flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded transition-colors ${
        mode === 'preview' ? 'bg-panel-light dark:bg-panel-dark text-accent' : 'text-fg-dark-muted hover:text-fg-dark'
      }`}
      title="Preview mode"
    >
      <Eye size={10} />
      <span className="hidden sm:inline">Preview</span>
    </button>
    <button
      onClick={() => onChange('raw')}
      className={`flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded transition-colors ${
        mode === 'raw' ? 'bg-panel-light dark:bg-panel-dark text-accent' : 'text-fg-dark-muted hover:text-fg-dark'
      }`}
      title="Raw JSON"
    >
      <Code size={10} />
      <span className="hidden sm:inline">Raw</span>
    </button>
  </div>
);

// Bookmark Star Button
const BookmarkStar: React.FC<{ 
  isActive: boolean; 
  onClick: (e: React.MouseEvent) => void;
}> = ({ isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`p-1 rounded transition-all hover:scale-110 ${
      isActive 
        ? 'text-term-orange' 
        : 'text-fg-dark-muted opacity-40 hover:opacity-100 hover:text-term-orange'
    }`}
    title={isActive ? 'Remove from bookmarks' : 'Add to bookmarks'}
  >
    <Star size={12} fill={isActive ? 'currentColor' : 'none'} />
  </button>
);

// Raw JSON Display
const RawJsonView: React.FC<{ data: unknown; title: string }> = ({ data, title }) => (
  <div className="max-w-4xl">
    <div className="text-fg-dark-muted opacity-50 text-xs mb-4 font-mono">
      <span className="text-term-orange">// {title}</span> - Raw JSON data
    </div>
    <pre className="bg-slate-50 dark:bg-black/30 border border-border-light dark:border-border-dark rounded-lg p-4 overflow-x-auto text-[11px] leading-relaxed">
      <code className="text-fg-light dark:text-fg-dark">
        {JSON.stringify(data, null, 2)}
      </code>
    </pre>
  </div>
);

// ===== HACKER NEWS VIEW =====
export const HackerNewsView: React.FC<ViewProps> = ({ lang, t, refreshTrigger = 0, onSyncUpdate, isBookmarked, toggleBookmark }) => {
  const { data, rawData, loading } = useDashboardData(lang, refreshTrigger, onSyncUpdate);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  if (loading || !data) return <LoadingState t={t} />;

  if (viewMode === 'raw') {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />
        </div>
        <RawJsonView data={rawData?.hackerNews} title="hacker_news.json" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-term-purple">// hacker_news.ts</span> - Top stories from Hacker News API
        </div>
        <ViewModeToggle mode={viewMode} onChange={setViewMode} />
      </div>
      
      <div className="space-y-2 text-[13px]">
        {data.hackerNews.map((item, idx) => {
          const itemId = `hn-${item.url}`;
          const saved = isBookmarked?.(itemId) ?? false;
          
          return (
            <div 
              key={idx}
              className="flex items-start gap-3 pl-4 py-2 hover:bg-accent/5 rounded transition-colors group border-l-2 border-transparent hover:border-accent"
            >
              <span className="text-term-orange shrink-0 pt-0.5">{(idx + 1).toString().padStart(2, '0')}.</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg-light dark:text-fg-dark group-hover:text-accent transition-colors font-medium flex-1"
                  >
                    {item.title}
                    <ExternalLink size={10} className="inline ml-2 opacity-0 group-hover:opacity-50" />
                  </a>
                  <BookmarkStar 
                    isActive={saved}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleBookmark?.({ id: itemId, type: 'hn', title: item.title || '', url: item.url || '' });
                    }}
                  />
                </div>
                <div className="flex gap-4 mt-1 text-[10px] text-fg-dark-muted">
                  <span className="text-term-orange">points: {item.points}</span>
                  <span className="text-term-purple">comments: {item.comments}</span>
                  {item.author && <span className="hidden sm:inline">by: @{item.author}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===== GITHUB VIEW =====
export const GithubView: React.FC<ViewProps> = ({ lang, t, refreshTrigger = 0, onSyncUpdate, isBookmarked, toggleBookmark }) => {
  const { data, rawData, loading } = useDashboardData(lang, refreshTrigger, onSyncUpdate);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  if (loading || !data) return <LoadingState t={t} />;

  if (viewMode === 'raw') {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />
        </div>
        <RawJsonView data={rawData?.github} title="github.json" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-term-orange">// github.json</span> - Trending repositories
        </div>
        <ViewModeToggle mode={viewMode} onChange={setViewMode} />
      </div>
      
      <div className="space-y-2 text-[13px]">
        {data.github.map((item, idx) => {
          const itemId = `github-${item.url}`;
          const saved = isBookmarked?.(itemId) ?? false;
          
          return (
            <div 
              key={idx}
              className="flex items-start gap-3 pl-4 py-2 hover:bg-accent/5 rounded transition-colors group border-l border-term-orange/30"
            >
              <span className="text-term-blue shrink-0">repo:</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg-light dark:text-fg-dark group-hover:text-term-blue transition-colors font-medium flex-1"
                  >
                    {item.name}
                  </a>
                  <BookmarkStar 
                    isActive={saved}
                    onClick={(e) => {
                      e.preventDefault();
                      toggleBookmark?.({ id: itemId, type: 'github', title: item.name || '', url: item.url || '' });
                    }}
                  />
                </div>
                {item.description && (
                  <div className="text-[11px] text-fg-dark-muted mt-1 line-clamp-1">
                    {item.description}
                  </div>
                )}
                <div className="flex gap-4 mt-1 text-[10px] text-fg-dark-muted">
                  <span className="text-term-orange flex items-center gap-1"><Star size={10} /> {item.stars?.toLocaleString()}</span>
                  {item.language && <span className="text-term-purple">{item.language}</span>}
                  <span className="flex items-center gap-1"><GitFork size={10} /> {item.forks || 0}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===== LLM NEWS VIEW =====
export const LLMView: React.FC<ViewProps> = ({ lang, t, refreshTrigger = 0, onSyncUpdate, isBookmarked, toggleBookmark }) => {
  const { data, rawData, loading } = useDashboardData(lang, refreshTrigger, onSyncUpdate);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  if (loading || !data) return <LoadingState t={t} />;

  if (viewMode === 'raw') {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />
        </div>
        <RawJsonView data={rawData?.llmNews} title="llm.json" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-term-purple"># llm.py</span> - AI/ML news aggregator
        </div>
        <ViewModeToggle mode={viewMode} onChange={setViewMode} />
      </div>
      
      <div className="space-y-2 text-[13px]">
        {data.llmNews.map((item, idx) => {
          const itemId = `llm-${item.url}`;
          const saved = isBookmarked?.(itemId) ?? false;
          
          return (
            <div 
              key={idx}
              className="flex items-start gap-3 py-2 hover:bg-accent/5 rounded transition-colors group border-l border-term-purple/30 pl-4"
            >
              <span className="text-term-orange shrink-0">#{idx + 1}</span>
              <div className="flex-1 flex items-start justify-between gap-2">
                <div className="flex-1">
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg-light dark:text-fg-dark group-hover:text-term-orange transition-colors block"
                  >
                    {item.title}
                  </a>
                  <div className="text-[10px] text-term-purple mt-1">
                    score={item.score}
                  </div>
                </div>
                <BookmarkStar 
                  isActive={saved}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleBookmark?.({ id: itemId, type: 'llm', title: item.title || '', url: item.url || '' });
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===== LESSWRONG VIEW =====
export const LessWrongView: React.FC<ViewProps> = ({ lang, t, refreshTrigger = 0, onSyncUpdate, isBookmarked, toggleBookmark }) => {
  const { data, rawData, loading } = useDashboardData(lang, refreshTrigger, onSyncUpdate);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  if (loading || !data) return <LoadingState t={t} />;

  if (viewMode === 'raw') {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />
        </div>
        <RawJsonView data={rawData?.lessWrong} title="less_wrong.json" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-[#519aba]"># less_wrong.md</span> - Rationality essays
        </div>
        <ViewModeToggle mode={viewMode} onChange={setViewMode} />
      </div>
      
      <div className="space-y-2 text-[13px]">
        {data.lessWrong.map((item, idx) => {
          const itemId = `lw-${item.url}`;
          const saved = isBookmarked?.(itemId) ?? false;
          
          return (
            <div 
              key={idx} 
              className="flex items-start gap-3 py-2 hover:bg-accent/5 rounded transition-colors group border-l border-[#519aba]/30 pl-4"
            >
              <span className="text-[#519aba] shrink-0">##</span>
              <div className="flex-1 flex items-start justify-between gap-2">
                <a 
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-light dark:text-fg-dark group-hover:text-[#519aba] transition-colors"
                >
                  {item.title}
                </a>
                <BookmarkStar 
                  isActive={saved}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleBookmark?.({ id: itemId, type: 'lesswrong', title: item.title || '', url: item.url || '' });
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===== LEGACY GRID DASHBOARD (for backward compatibility) =====
export const Dashboard: React.FC<ViewProps> = ({ lang, t }) => {
  return <HackerNewsView lang={lang} t={t} />;
};
