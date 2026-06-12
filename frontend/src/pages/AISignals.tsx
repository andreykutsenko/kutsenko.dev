import { useState, useEffect } from 'react';
import { ExternalLink, Star, Loader2 } from 'lucide-react';
import { fetchAISignals, AISignalsData } from '../services/api';
import { safeUrl } from '../utils/safeUrl';

// Hook to fetch AI signals data
const useAISignals = () => {
  const [data, setData] = useState<AISignalsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchAISignals().then((result) => {
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
};

// Loading component
const LoadingState = () => (
  <div className="flex items-center justify-center py-12 text-fg-dark-muted">
    <Loader2 className="animate-spin mr-2" size={16} />
    <span className="text-xs font-mono">FETCHING DATA...</span>
  </div>
);

const OfflineState = () => (
  <div className="text-xs font-mono p-4 text-fg-dark-muted">
    signals offline, check back in an hour
  </div>
);

const fmtContext = (ctx: number): string => {
  if (!ctx) return '?';
  if (ctx >= 1000000) return `${ctx / 1000000}M`;
  return `${Math.round(ctx / 1000)}K`;
};

// ===== MODELS VIEW (live from OpenRouter) =====
export const ModelsView: React.FC = () => {
  const { data, loading } = useAISignals();

  if (loading) return <LoadingState />;
  if (!data || !data.models.length) return <OfflineState />;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-term-green">// models.json</span> - newest models and pricing ($/1M tokens), live from OpenRouter
        </div>
      </div>

      <div className="space-y-3 text-[13px]">
        {data.models.map((model, idx) => (
          <div
            key={model.id}
            className="flex items-center gap-3 pl-4 py-2.5 hover:bg-accent/5 rounded transition-colors duration-200 ease-in-out group border-l-2 border-transparent hover:border-term-green"
          >
            <span className="text-term-green shrink-0">{(idx + 1).toString().padStart(2, '0')}.</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-fg-light dark:text-fg-dark font-medium truncate">{model.name}</span>
                <span className="text-[10px] text-fg-dark-muted shrink-0">({model.provider})</span>
              </div>
              <div className="flex gap-4 mt-1 text-[10px] text-fg-dark-muted font-mono">
                <span className="text-term-green">in: ${model.inputPerM.toFixed(2)}</span>
                <span className="text-term-orange">out: ${model.outputPerM.toFixed(2)}</span>
                <span>ctx: {fmtContext(model.context)}</span>
                {model.addedAt && <span className="hidden sm:inline">added: {model.addedAt}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <a
        href="https://openrouter.ai/models"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mt-4 text-xs text-fg-dark-muted hover:text-accent transition-colors duration-200 ease-in-out"
      >
        <ExternalLink size={10} />
        All models on openrouter.ai
      </a>
    </div>
  );
};

// ===== PAPERS VIEW (HuggingFace Daily Papers) =====
export const PapersView: React.FC = () => {
  const { data, loading } = useAISignals();

  if (loading) return <LoadingState />;
  if (!data || !data.papers.length) return <OfflineState />;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-term-purple"># papers.py</span> - trending this week on HuggingFace Daily Papers
        </div>
      </div>

      <div className="space-y-3 text-[13px]">
        {data.papers.map((paper, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 pl-4 py-2.5 hover:bg-accent/5 rounded transition-colors duration-200 ease-in-out group border-l-2 border-transparent hover:border-term-purple"
          >
            <span className="text-term-purple shrink-0 pt-0.5">{(idx + 1).toString().padStart(2, '0')}.</span>
            <div className="flex-1 min-w-0">
              <a
                href={safeUrl(paper.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-light dark:text-fg-dark group-hover:text-term-purple transition-colors duration-200 ease-in-out font-medium"
              >
                {paper.title}
                <ExternalLink size={10} className="inline ml-2 opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
              </a>
              {paper.summary && (
                <div className="mt-1 text-[11px] text-fg-dark-muted line-clamp-2">{paper.summary}</div>
              )}
              <div className="flex gap-4 mt-1 text-[10px] text-fg-dark-muted">
                {paper.authors && <span>{paper.authors}</span>}
                <span className="text-term-orange">▲ {paper.upvotes}</span>
                {paper.publishedAt && <span className="hidden sm:inline">{paper.publishedAt}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <a
        href="https://huggingface.co/papers"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 mt-4 text-xs text-fg-dark-muted hover:text-accent transition-colors duration-200 ease-in-out"
      >
        <ExternalLink size={10} />
        Browse more on huggingface.co/papers
      </a>
    </div>
  );
};

// ===== TRENDING VIEW (fresh AI repos on GitHub) =====
export const TrendingView: React.FC = () => {
  const { data, loading } = useAISignals();

  if (loading) return <LoadingState />;
  if (!data || !data.trending.length) return <OfflineState />;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-accent">// trending.json</span> - LLM repos created in the last 30 days, by stars
        </div>
      </div>

      <div className="space-y-3 text-[13px]">
        {data.trending.map((repo, idx) => (
          <div
            key={repo.name}
            className="flex items-start gap-3 pl-4 py-2.5 hover:bg-accent/5 rounded transition-colors duration-200 ease-in-out group border-l-2 border-transparent hover:border-accent"
          >
            <span className="text-accent shrink-0 pt-0.5">{(idx + 1).toString().padStart(2, '0')}.</span>
            <div className="flex-1 min-w-0">
              <a
                href={safeUrl(repo.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-light dark:text-fg-dark group-hover:text-accent transition-colors duration-200 ease-in-out font-medium"
              >
                {repo.name}
                <ExternalLink size={10} className="inline ml-2 opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
              </a>
              {repo.description && (
                <div className="mt-1 text-[11px] text-fg-dark-muted line-clamp-2">{repo.description}</div>
              )}
              <div className="flex gap-4 mt-1 text-[10px] text-fg-dark-muted">
                <span className="flex items-center gap-1">
                  <Star size={10} className="text-term-orange" />
                  {repo.stars.toLocaleString()}
                </span>
                {repo.language && <span className="text-accent">{repo.language}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
