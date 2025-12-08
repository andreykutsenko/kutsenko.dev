import { useState, useEffect } from 'react';
import { 
  Star, 
  RefreshCw,
  ArrowUpRight,
  GitBranch
} from 'lucide-react';
import type { Lang, DashboardData, FeedItem } from '../types';
import { fetchDashboardData } from '../services/api';
import './pages.css';

interface HomePageProps {
  lang: Lang;
  t: (key: string) => string;
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export function HomePage({ t }: HomePageProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [lastSynced, setLastSynced] = useState<string>('');

  const loadData = async () => {
    setLoadingState('loading');
    try {
      const result = await fetchDashboardData();
      setData(result);
      setLoadingState('success');
      setLastSynced(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      }));
    } catch {
      setLoadingState('error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="home-dashboard">
      {/* Terminal Header */}
      <header className="terminal-header">
        <div className="terminal-prompt">
          <span className="prompt-user">guest@kutsenko.dev</span>
          <span className="prompt-sep"> : ~ $ </span>
          <span className="prompt-cmd">whoami</span>
        </div>
        <p className="terminal-output">{t('hero.subtitle')}</p>
      </header>

      {/* Dashboard Grid */}
      <div className="dashboard-bento">
        {/* Hacker News Column */}
        <section className="bento-panel bento-panel--hn">
          <div className="bento-panel__head">
            <h2 className="bento-panel__title">Hacker News</h2>
            <span className="bento-panel__sub">Top discussions from the front page</span>
          </div>
          
          <div className="bento-panel__body">
            {loadingState === 'loading' && !data && (
              <div className="bento-loading">
                <RefreshCw size={16} className="spin" />
                <span>Loading...</span>
              </div>
            )}
            
            {data?.hackerNews?.slice(0, 5).map((item, idx) => (
              <HNCard key={item.id || idx} item={item} />
            ))}
          </div>
        </section>

        {/* GitHub Column */}
        <section className="bento-panel bento-panel--gh">
          <div className="bento-panel__head">
            <div className="bento-panel__title-row">
              <h2 className="bento-panel__title">GitHub Radar</h2>
              <span className="bento-panel__badge">Fresh repos trending on GitHub</span>
            </div>
          </div>
          
          <div className="bento-panel__body">
            {data?.github?.slice(0, 4).map((item, idx) => (
              <GitHubCard key={item.id || idx} item={item} />
            ))}
          </div>
        </section>

        {/* Right Column - LLM + LessWrong */}
        <div className="bento-stack">
          {/* LocalLLaMA */}
          <section className="bento-panel bento-panel--sm">
            <div className="bento-panel__head">
              <h2 className="bento-panel__title">LocalLLaMA</h2>
            </div>
            <div className="bento-panel__body">
              {data?.llmNews?.slice(0, 2).map((item, idx) => (
                <CompactCard key={item.id || idx} item={item} showScore />
              ))}
            </div>
          </section>

          {/* LessWrong */}
          <section className="bento-panel bento-panel--sm">
            <div className="bento-panel__head">
              <h2 className="bento-panel__title">LessWrong</h2>
            </div>
            <div className="bento-panel__body">
              {data?.lessWrong?.slice(0, 2).map((item, idx) => (
                <CompactCard key={item.id || idx} item={item} showDate />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Last Synced Footer */}
      <footer className="sync-footer">
        {lastSynced && (
          <span className="sync-time">Last synced: {lastSynced}</span>
        )}
        <button 
          className="sync-btn"
          onClick={loadData}
          disabled={loadingState === 'loading'}
        >
          <RefreshCw size={14} className={loadingState === 'loading' ? 'spin' : ''} />
        </button>
      </footer>
    </div>
  );
}

/** Hacker News card */
function HNCard({ item }: { item: FeedItem }) {
  return (
    <a 
      href={item.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="hn-card"
    >
      <div className="hn-card__content">
        <h3 className="hn-card__title">{item.title}</h3>
        <div className="hn-card__meta">
          <span>{item.points ?? 0} PTS</span>
          <span className="meta-sep">::</span>
          <span>{item.comments ?? 0} CMTS</span>
        </div>
      </div>
      <ArrowUpRight size={16} className="hn-card__arrow" />
    </a>
  );
}

/** GitHub repo card */
function GitHubCard({ item }: { item: FeedItem }) {
  return (
    <a 
      href={item.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="gh-card"
    >
      <div className="gh-card__head">
        <GitBranch size={14} className="gh-card__icon" />
        <span className="gh-card__name">{item.name}</span>
      </div>
      {item.description && (
        <p className="gh-card__desc">{item.description}</p>
      )}
      <div className="gh-card__meta">
        <span className="gh-card__stars">
          <Star size={12} />
          {formatStars(item.stars)}
        </span>
        {item.language && (
          <>
            <span className="meta-sep">|</span>
            <span className="gh-card__lang">{item.language}</span>
          </>
        )}
      </div>
    </a>
  );
}

/** Compact card for LLM/LessWrong */
function CompactCard({ item, showScore, showDate }: { 
  item: FeedItem; 
  showScore?: boolean;
  showDate?: boolean;
}) {
  return (
    <a 
      href={item.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="compact-card"
    >
      <h4 className="compact-card__title">{item.title}</h4>
      <span className="compact-card__meta">
        {showScore && `${item.score ?? item.points ?? 0} upvotes`}
        {showDate && item.publishedAt && formatDate(item.publishedAt)}
      </span>
    </a>
  );
}

/** Format large star counts */
function formatStars(stars?: number): string {
  if (!stars) return '0';
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(stars >= 100000 ? 0 : 1)}k`;
  }
  return stars.toString();
}

/** Format date */
function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { 
    month: 'numeric', 
    day: 'numeric', 
    year: 'numeric' 
  });
}
