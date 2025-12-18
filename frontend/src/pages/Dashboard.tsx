import { useEffect, useState } from 'react';
import { fetchDashboardData, fetchTranslations } from '../services/api';
import { DashboardData, Lang, FeedItem } from '../types';
import { GitFork, Star, ArrowUpRight, Cpu, BookOpen, Newspaper, ChevronDown, ChevronUp, RefreshCw, Clock } from 'lucide-react';

interface DashboardProps {
  lang: Lang;
  t: (key: string) => string;
}

interface TerminalPanelProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  itemCount?: number;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ title, subtitle, children, icon, itemCount }) => (
  <div className="border border-border-light dark:border-border-dark bg-panel-light dark:bg-panel-dark flex flex-col h-full rounded-lg overflow-hidden shadow-sm dark:shadow-black/40 group transition-all hover:border-slate-300 dark:hover:border-slate-600 relative">
    {/* Corner decorations */}
    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent/20 rounded-tl-lg pointer-events-none"></div>
    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent/20 rounded-tr-lg pointer-events-none"></div>
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent/20 rounded-bl-lg pointer-events-none"></div>
    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent/20 rounded-br-lg pointer-events-none"></div>
    
    <div className="px-4 py-3 bg-slate-50 dark:bg-[#1f242e] border-b border-border-light dark:border-border-dark shrink-0 flex items-center justify-between">
      <div className="flex items-center gap-3">
         <div className="flex gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
         </div>
         <div className="ml-2 flex items-center gap-2">
           {icon}
           <h3 className="text-xs font-semibold text-fg-light dark:text-fg-dark font-mono">
              {title}
           </h3>
           {subtitle && (
             <span className="text-[10px] text-fg-dark-muted hidden sm:inline">
               :: {subtitle}
             </span>
           )}
         </div>
      </div>
      {itemCount !== undefined && (
        <span className="text-[9px] font-mono text-fg-dark-muted bg-white/50 dark:bg-white/5 px-1.5 py-0.5 rounded">
          [{itemCount}]
        </span>
      )}
    </div>
    <div className="p-4 overflow-y-auto scrollbar-hide flex-1 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      {children}
    </div>
  </div>
);

interface ExpandableSectionProps {
  items: FeedItem[];
  initialCount: number;
  renderItem: (item: FeedItem, idx: number) => React.ReactNode;
  moreLabel: string;
  lessLabel: string;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ 
  items, 
  initialCount, 
  renderItem, 
  moreLabel, 
  lessLabel 
}) => {
  const [expanded, setExpanded] = useState(false);
  const displayItems = expanded ? items : items.slice(0, initialCount);
  const hasMore = items.length > initialCount;

  return (
    <div className="space-y-3">
      {displayItems.map((item, idx) => renderItem(item, idx))}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left text-xs font-mono text-accent-light dark:text-accent hover:text-accent-light/80 dark:hover:text-accent/80 transition-colors py-2 flex items-center gap-2 opacity-70 hover:opacity-100"
        >
          {expanded ? (
            <>
              <ChevronUp size={12} />
              {lessLabel}
            </>
          ) : (
            <>
              <ChevronDown size={12} />
              {moreLabel} ({items.length - initialCount})
            </>
          )}
        </button>
      )}
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ lang, t }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [translatedData, setTranslatedData] = useState<DashboardData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    fetchDashboardData().then(fetched => {
      setData(fetched);
      setLoading(false);
      setLastUpdate(new Date());
    });
  }, []);

  // Translate ALL sections when language changes
  useEffect(() => {
    if (!data) return;
    if (lang === 'en') {
      setTranslatedData(data);
      return;
    }
    
    const translateAllSections = async () => {
      const newData = JSON.parse(JSON.stringify(data)) as DashboardData;
      
      // Collect all texts to translate
      const allTexts: string[] = [
        ...newData.hackerNews.map(i => i.title || ''),
        ...newData.github.map(i => i.description || ''),
        ...newData.llmNews.map(i => i.title || ''),
        ...newData.lessWrong.map(i => i.title || ''),
        ...newData.lessWrong.map(i => i.summary || ''),
      ];
      
      // Translate in one batch
      const translated = await fetchTranslations(allTexts, lang);
      
      // Distribute translations back
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

  const displayData = translatedData || data;

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: false 
    });
  };

  if (loading || !displayData) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-fg-dark-muted gap-4">
         {/* Terminal-style loading */}
         <div className="font-mono text-xs space-y-1 text-center">
           <div className="flex items-center gap-2 justify-center">
             <RefreshCw size={14} className="animate-spin text-accent" />
             <span className="text-accent">$</span>
             <span>./fetch_feeds.sh --all</span>
           </div>
           <div className="text-fg-dark-muted animate-pulse">
             {t('status.loading')}
           </div>
           <div className="flex gap-1 justify-center mt-2">
             <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
             <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
             <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
           </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Command prompt header */}
      <div className="flex items-center justify-between text-[10px] md:text-xs font-mono text-fg-dark-muted border border-border-light dark:border-border-dark rounded-lg px-4 py-2 bg-panel-light dark:bg-panel-dark">
        <div className="flex items-center gap-2">
          <span className="text-accent">❯</span>
          <span className="text-accent-light dark:text-term-cyan">~</span>
          <span>cat /var/feeds/* | head -n 20</span>
          <span className="hidden sm:inline text-accent animate-blink">█</span>
        </div>
        {lastUpdate && (
          <div className="flex items-center gap-1.5 text-fg-dark-muted/70">
            <Clock size={10} />
            <span className="hidden sm:inline">{t('status.synced')}</span>
            <span>{formatTime(lastUpdate)}</span>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tech News / Hacker News */}
        <div className="min-h-[280px]">
            <TerminalPanel 
              title={t('section.hn.title')} 
              subtitle={t('section.hn.subtitle')}
              icon={<Newspaper size={14} className="text-orange-400" />}
              itemCount={displayData.hackerNews.length}
            >
              <ExpandableSection
                items={displayData.hackerNews}
                initialCount={4}
                moreLabel={t('btn.more')}
                lessLabel={t('btn.less')}
                renderItem={(item, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-start gap-3">
                      <span className="text-accent/50 font-mono text-xs mt-0.5 shrink-0">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-fg-light dark:text-fg-dark hover:text-accent-light dark:hover:text-accent transition-colors leading-tight block line-clamp-2">
                          {item.title}
                        </a>
                        <div className="mt-1.5 flex gap-3 text-[10px] text-fg-dark-muted font-mono">
                          <span className="bg-slate-200 dark:bg-white/5 px-1.5 py-0.5 rounded">↑{item.points}</span>
                          <span>💬{item.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            </TerminalPanel>
        </div>
        
        {/* GitHub Trending */}
        <div className="min-h-[280px]">
            <TerminalPanel 
              title={t('section.github.title')} 
              subtitle={t('section.github.subtitle')}
              icon={<GitFork size={14} className="text-purple-400" />}
              itemCount={displayData.github.length}
            >
              <ExpandableSection
                items={displayData.github}
                initialCount={3}
                moreLabel={t('btn.more')}
                lessLabel={t('btn.less')}
                renderItem={(item, idx) => (
                  <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-3 border border-border-light dark:border-border-dark bg-slate-50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:border-accent-light/50 dark:hover:border-accent/30 transition-all rounded-md group">
                    <div className="flex justify-between items-center mb-1.5 gap-2">
                      <span className="text-sm font-bold text-accent-light dark:text-accent group-hover:underline decoration-1 underline-offset-4 truncate">{item.name}</span>
                      <div className="text-[10px] text-fg-dark-muted flex items-center gap-1.5 bg-white dark:bg-black/20 px-2 py-0.5 rounded-full border border-border-light dark:border-white/5 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-term-cyan"></span>
                        {item.language}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-2">
                      {item.description}
                    </p>
                    <div className="flex gap-4 text-[10px] text-fg-dark-muted font-mono opacity-80">
                      <span className="flex items-center gap-1"><Star size={11} /> {item.stars?.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><GitFork size={11} /> {item.forks || '0'}</span>
                    </div>
                  </a>
                )}
              />
            </TerminalPanel>
        </div>

        {/* AI / LLM News */}
        <div className="min-h-[220px]">
            <TerminalPanel 
              title={t('section.llm.title')} 
              subtitle={t('section.llm.subtitle')}
              icon={<Cpu size={14} className="text-cyan-400" />}
              itemCount={displayData.llmNews.length}
            >
              <ExpandableSection
                items={displayData.llmNews}
                initialCount={4}
                moreLabel={t('btn.more')}
                lessLabel={t('btn.less')}
                renderItem={(item, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3 text-xs group cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 p-2 rounded -mx-2 transition-colors">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-slate-700 dark:text-slate-300 leading-relaxed flex-1 line-clamp-2">
                      <span className="font-mono text-accent-light dark:text-accent mr-2 opacity-50 group-hover:opacity-100">$</span>
                      {item.title}
                    </a>
                    <span className="text-fg-dark-muted font-mono text-[10px] shrink-0 bg-slate-200 dark:bg-white/10 px-1.5 rounded py-0.5">↑{item.score}</span>
                  </div>
                )}
              />
            </TerminalPanel>
        </div>

        {/* Essays / LessWrong */}
        <div className="min-h-[220px]">
            <TerminalPanel 
              title={t('section.lw.title')} 
              subtitle={t('section.lw.subtitle')}
              icon={<BookOpen size={14} className="text-blue-400" />}
              itemCount={displayData.lessWrong.length}
            >
              <ExpandableSection
                items={displayData.lessWrong}
                initialCount={3}
                moreLabel={t('btn.more')}
                lessLabel={t('btn.less')}
                renderItem={(item, idx) => (
                  <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="block group relative pl-3 border-l-2 border-transparent hover:border-accent transition-colors">
                    <h4 className="font-bold text-sm text-fg-light dark:text-fg-dark group-hover:text-accent-light dark:group-hover:text-accent transition-colors flex items-center gap-2 line-clamp-1">
                      {item.title}
                      <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 leading-relaxed line-clamp-2">{item.summary}</p>
                  </a>
                )}
              />
            </TerminalPanel>
        </div>
      </div>

      {/* Footer status bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[9px] md:text-[10px] font-mono text-fg-dark-muted/60 border-t border-border-light dark:border-border-dark pt-4 mt-6">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
            {t('status.online')}
          </span>
          <span className="hidden sm:inline">│</span>
          <span className="hidden sm:inline">PID: {Math.floor(Math.random() * 9000) + 1000}</span>
          <span className="hidden md:inline">│</span>
          <span className="hidden md:inline">MEM: 48MB</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={10} />
          <span>{t('status.lastSync')}: {lastUpdate ? formatTime(lastUpdate) : '--:--:--'}</span>
        </div>
      </div>
    </div>
  );
};
