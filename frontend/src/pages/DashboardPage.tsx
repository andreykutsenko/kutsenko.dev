import { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  ExternalLink, 
  MessageCircle, 
  Star, 
  TrendingUp,
  BookOpen,
  AlertCircle,
  Loader2
} from 'lucide-react';
import type { Lang, DashboardData, FeedItem } from '../types';
import { fetchDashboardData } from '../services/api';
import './pages.css';

interface DashboardPageProps {
  lang: Lang;
  t: (key: string) => string;
}

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export function DashboardPage({ t }: DashboardPageProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoadingState('loading');
    setError(null);
    
    try {
      const result = await fetchDashboardData();
      setData(result);
      setLoadingState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setLoadingState('error');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Format relative time
  const formatUpdatedAt = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="dashboard-page">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          {data?.updatedAt && (
            <p className="dashboard-updated">
              Last updated: {formatUpdatedAt(data.updatedAt)}
            </p>
          )}
        </div>
        
        <button 
          className="btn btn--ghost"
          onClick={loadData}
          disabled={loadingState === 'loading'}
        >
          <RefreshCw 
            size={16} 
            className={loadingState === 'loading' ? 'spin' : ''} 
          />
          <span>Refresh</span>
        </button>
      </header>

      {/* Loading State */}
      {loadingState === 'loading' && !data && (
        <div className="dashboard-loading">
          <Loader2 size={32} className="spin" />
          <p>{t('status.loading')}</p>
        </div>
      )}

      {/* Error State */}
      {loadingState === 'error' && (
        <div className="dashboard-error">
          <AlertCircle size={32} />
          <p>{t('status.error')}</p>
          <p className="error-detail">{error}</p>
          <button className="btn btn--primary" onClick={loadData}>
            Try Again
          </button>
        </div>
      )}

      {/* Dashboard Grid */}
      {data && (
        <div className="dashboard-grid">
          {/* Column 1: Hacker News */}
          <div className="dashboard-column">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-label">Hacker News</h2>
                  <p className="panel-sub">{t('section.hn.tagline')}</p>
                </div>
                <TrendingUp size={18} className="text-accent" />
              </div>
              <div className="panel-body">
                <div className="feed-list">
                  {data.hackerNews.map((item, idx) => (
                    <HNCard key={item.id || idx} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: GitHub */}
          <div className="dashboard-column">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="panel-label">GitHub Trending</h2>
                  <p className="panel-sub">{t('section.github.tagline')}</p>
                </div>
                <Star size={18} className="text-accent" />
              </div>
              <div className="panel-body">
                <div className="feed-list">
                  {data.github.map((item, idx) => (
                    <GitHubCard key={item.id || idx} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Notes / LLM News / LessWrong */}
          <div className="dashboard-column">
            {/* Notes & Focus Panel */}
            <div className="panel panel--compact">
              <div className="panel-header">
                <div>
                  <h2 className="panel-label">{t('section.notes')}</h2>
                </div>
                <BookOpen size={18} className="text-accent" />
              </div>
              <div className="panel-body">
                <div className="notes-content">
                  {/* TODO: Andrey can customize this area with personal notes */}
                  <p className="notes-placeholder">
                    <span className="text-accent">$</span> Current focus: AI agents, automation pipelines
                  </p>
                  <p className="notes-placeholder">
                    <span className="text-accent">$</span> Building SimpleProcess.io
                  </p>
                </div>
              </div>
            </div>

            {/* LLM News Panel */}
            {data.llmNews && data.llmNews.length > 0 && (
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h2 className="panel-label">r/LocalLLaMA</h2>
                    <p className="panel-sub">{t('section.llm.tagline')}</p>
                  </div>
                </div>
                <div className="panel-body">
                  <div className="feed-list">
                    {data.llmNews.slice(0, 3).map((item, idx) => (
                      <LLMCard key={item.id || idx} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LessWrong Panel */}
            {data.lessWrong && data.lessWrong.length > 0 && (
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h2 className="panel-label">LessWrong</h2>
                    <p className="panel-sub">{t('section.lw.tagline')}</p>
                  </div>
                </div>
                <div className="panel-body">
                  <div className="feed-list">
                    {data.lessWrong.slice(0, 2).map((item, idx) => (
                      <LWCard key={item.id || idx} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Hacker News card component */
function HNCard({ item }: { item: FeedItem }) {
  return (
    <a 
      href={item.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="feed-card"
    >
      <h3 className="feed-card__title">{item.title}</h3>
      <div className="feed-card__meta">
        <span>
          <TrendingUp size={12} />
          {item.points ?? 0} pts
        </span>
        <span>
          <MessageCircle size={12} />
          {item.comments ?? 0}
        </span>
        {item.author && <span>by {item.author}</span>}
      </div>
    </a>
  );
}

/** GitHub repo card component */
function GitHubCard({ item }: { item: FeedItem }) {
  return (
    <a 
      href={item.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="feed-card"
    >
      <h3 className="feed-card__title">
        {item.name}
        <ExternalLink size={12} />
      </h3>
      {item.description && (
        <p className="feed-card__desc">{item.description}</p>
      )}
      <div className="feed-card__meta">
        <span>
          <Star size={12} />
          {formatStars(item.stars)}
        </span>
        {item.language && (
          <span className="lang-badge">{item.language}</span>
        )}
      </div>
    </a>
  );
}

/** LLM/Reddit card component */
function LLMCard({ item }: { item: FeedItem }) {
  return (
    <a 
      href={item.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="feed-card"
    >
      <h3 className="feed-card__title">{item.title}</h3>
      <div className="feed-card__meta">
        <span>
          <TrendingUp size={12} />
          {item.score ?? 0}
        </span>
        <span>
          <MessageCircle size={12} />
          {item.comments ?? 0}
        </span>
      </div>
    </a>
  );
}

/** LessWrong card component */
function LWCard({ item }: { item: FeedItem }) {
  return (
    <a 
      href={item.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="feed-card"
    >
      <h3 className="feed-card__title">{item.title}</h3>
      {item.summary && (
        <p className="feed-card__desc">{item.summary}</p>
      )}
    </a>
  );
}

/** Format large star counts (e.g., 213000 -> 213k) */
function formatStars(stars?: number): string {
  if (!stars) return '0';
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(stars >= 10000 ? 0 : 1)}k`;
  }
  return stars.toString();
}


