import { useEffect, useState } from 'react';
import { fetchDashboardData, fetchTranslations } from '../services/api';
import { DashboardData, Lang, FeedItem } from '../types';
import { GitFork, Star, ArrowUpRight, Cpu, BookOpen, Newspaper, ChevronDown, ChevronUp } from 'lucide-react';

interface DashboardProps {
  lang: Lang;
  t: (key: string) => string;
}

interface TerminalPanelProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ title, subtitle, children, icon }) => (
  <div className="border border-border-light dark:border-border-dark bg-panel-light dark:bg-panel-dark flex flex-col h-full rounded-lg overflow-hidden shadow-sm dark:shadow-black/40 group transition-all hover:border-slate-300 dark:hover:border-slate-600">
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

  useEffect(() => {
    fetchDashboardData().then(fetched => {
      setData(fetched);
      setLoading(false);
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

  if (loading || !displayData) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-fg-dark-muted gap-4">
         <div className="relative">
             <div className="w-12 h-12 border-2 border-accent/30 rounded-full animate-ping absolute inset-0"></div>
             <div className="w-12 h-12 border-2 border-accent rounded-full flex items-center justify-center">
                 <Newspaper size={20} className="text-accent" />
             </div>
         </div>
         <p className="text-xs font-mono uppercase tracking-widest opacity-70 animate-pulse">{t('status.loading')}</p>
      </div>
    );
  }

  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        
        {/* Tech News / Hacker News */}
        <div className="min-h-[280px]">
            <TerminalPanel 
              title={t('section.hn.title')} 
              subtitle={t('section.hn.subtitle')}
              icon={<Newspaper size={14} className="text-orange-400" />}
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
                          <span className="bg-slate-200 dark:bg-white/5 px-1.5 py-0.5 rounded">{item.points} pts</span>
                          <span>{item.comments} cmt</span>
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
                    <span className="text-fg-dark-muted font-mono text-[10px] shrink-0 bg-slate-200 dark:bg-white/10 px-1.5 rounded py-0.5">{item.score}</span>
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
  );
};
