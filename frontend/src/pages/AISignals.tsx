import { useState, useEffect } from 'react';
import { ExternalLink, Star, GitFork, Loader2 } from 'lucide-react';
import { fetchAISignals } from '../services/api';

// Types
interface ArenaModel {
  rank: number;
  model: string;
  elo: number;
  organization: string;
  change: string;
}

interface Paper {
  title: string;
  authors: string;
  stars: number;
  repo: string;
  arxiv: string;
  category: string;
}

interface Tool {
  name: string;
  tagline: string;
  description: string;
  votes: number;
  url: string;
  category: string;
}

interface TokenPrice {
  model: string;
  provider: string;
  input: number;
  output: number;
  context: string;
}

interface AISignalsData {
  updatedAt: string;
  arena: ArenaModel[];
  papers: Paper[];
  toolOfDay: Tool;
  tokenPrices: TokenPrice[];
}

// Hook to fetch AI signals data
const useAISignals = () => {
  const [data, setData] = useState<AISignalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchAISignals();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch AI signals:', err);
        setError('Failed to load data');
        // Use fallback data
        setData({
          updatedAt: new Date().toISOString(),
          arena: [
            { rank: 1, model: 'GPT-4o', elo: 1290, organization: 'OpenAI', change: '+1' },
            { rank: 2, model: 'Claude 3.5 Sonnet', elo: 1285, organization: 'Anthropic', change: '0' },
            { rank: 3, model: 'Gemini 1.5 Pro', elo: 1267, organization: 'Google', change: '-1' },
            { rank: 4, model: 'GPT-4 Turbo', elo: 1255, organization: 'OpenAI', change: '0' },
            { rank: 5, model: 'Claude 3 Opus', elo: 1248, organization: 'Anthropic', change: '0' },
          ],
          papers: [
            { title: 'Attention Is All You Need', authors: 'Vaswani et al.', stars: 15000, repo: 'tensorflow/tensor2tensor', arxiv: 'https://arxiv.org/abs/1706.03762', category: 'NLP' },
            { title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', stars: 12000, repo: 'google-research/bert', arxiv: 'https://arxiv.org/abs/1810.04805', category: 'NLP' },
            { title: 'GPT-4 Technical Report', authors: 'OpenAI', stars: 8000, repo: 'openai/evals', arxiv: 'https://arxiv.org/abs/2303.08774', category: 'LLM' },
          ],
          toolOfDay: {
            name: 'Cursor',
            tagline: 'The AI Code Editor',
            description: 'Built to make you extraordinarily productive.',
            votes: 3200,
            url: 'https://cursor.com',
            category: 'Developer Tools',
          },
          tokenPrices: [
            { model: 'GPT-4o', provider: 'OpenAI', input: 2.50, output: 10.00, context: '128K' },
            { model: 'GPT-4o-mini', provider: 'OpenAI', input: 0.15, output: 0.60, context: '128K' },
            { model: 'Claude 3.5 Sonnet', provider: 'Anthropic', input: 3.00, output: 15.00, context: '200K' },
            { model: 'Claude 3.5 Haiku', provider: 'Anthropic', input: 0.25, output: 1.25, context: '200K' },
            { model: 'Gemini 1.5 Pro', provider: 'Google', input: 1.25, output: 5.00, context: '2M' },
            { model: 'Gemini 1.5 Flash', provider: 'Google', input: 0.075, output: 0.30, context: '1M' },
            { model: 'DeepSeek V3', provider: 'DeepSeek', input: 0.27, output: 1.10, context: '128K' },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return { data, loading, error };
};

// Loading component
const LoadingState = () => (
  <div className="flex items-center justify-center py-12 text-fg-dark-muted">
    <Loader2 className="animate-spin mr-2" size={16} />
    <span className="text-xs font-mono">FETCHING DATA...</span>
  </div>
);

// ===== LMSYS ARENA VIEW =====
export const ArenaView: React.FC = () => {
  const { data, loading } = useAISignals();

  if (loading || !data) return <LoadingState />;

  const arenaData = data.arena.slice(0, 5);

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-term-orange">// lmsys_arena.json</span> - Chatbot Arena Leaderboard
        </div>
      </div>
      
      <div className="space-y-2 text-[13px]">
        {arenaData.map((model, idx) => (
          <div 
            key={idx}
            className="flex items-center gap-3 pl-4 py-2 hover:bg-accent/5 rounded transition-colors group border-l-2 border-transparent hover:border-accent"
          >
            <span className="text-term-orange shrink-0">#{model.rank}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-fg-light dark:text-fg-dark font-medium">{model.model}</span>
                <span className={`text-[10px] px-1 py-0.5 rounded ${
                  model.change.startsWith('+') ? 'bg-green-500/20 text-green-400' :
                  model.change === '0' ? 'bg-gray-500/20 text-gray-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {model.change}
                </span>
              </div>
              <div className="flex gap-4 mt-1 text-[10px] text-fg-dark-muted">
                <span>{model.organization}</span>
                <span className="text-accent">ELO: {model.elo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a 
        href="https://lmarena.ai/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 mt-4 text-xs text-fg-dark-muted hover:text-accent transition-colors"
      >
        <ExternalLink size={10} />
        View full leaderboard on lmarena.ai
      </a>
    </div>
  );
};

// ===== PAPERS WITH CODE VIEW =====
export const PapersView: React.FC = () => {
  const { data, loading } = useAISignals();

  if (loading || !data) return <LoadingState />;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-term-purple"># papers.py</span> - Papers with Code implementations
        </div>
      </div>
      
      <div className="space-y-2 text-[13px]">
        {data.papers.map((paper, idx) => (
          <div 
            key={idx}
            className="flex items-start gap-3 pl-4 py-2 hover:bg-accent/5 rounded transition-colors group border-l-2 border-transparent hover:border-term-purple"
          >
            <span className="text-term-purple shrink-0 pt-0.5">{(idx + 1).toString().padStart(2, '0')}.</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <a 
                  href={paper.arxiv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-light dark:text-fg-dark group-hover:text-term-purple transition-colors font-medium flex-1"
                >
                  {paper.title}
                  <ExternalLink size={10} className="inline ml-2 opacity-0 group-hover:opacity-50" />
                </a>
              </div>
              <div className="flex gap-4 mt-1 text-[10px] text-fg-dark-muted">
                <span>{paper.authors}</span>
                <span className="text-term-purple">[{paper.category}]</span>
                <span className="flex items-center gap-1">
                  <Star size={10} className="text-term-orange" />
                  {paper.stars.toLocaleString()}
                </span>
                {paper.repo && (
                  <span className="flex items-center gap-1 hidden sm:flex">
                    <GitFork size={10} />
                    {paper.repo}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <a 
        href="https://paperswithcode.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 mt-4 text-xs text-fg-dark-muted hover:text-accent transition-colors"
      >
        <ExternalLink size={10} />
        Browse more on paperswithcode.com
      </a>
    </div>
  );
};

// ===== AI TOOL OF THE DAY =====
export const ToolView: React.FC = () => {
  const { data, loading } = useAISignals();

  if (loading || !data) return <LoadingState />;

  const tool = data.toolOfDay;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-accent"># tool_of_day.md</span> - Today's featured AI tool
        </div>
      </div>
      
      <div className="space-y-2 text-[13px]">
        <div className="flex items-start gap-3 pl-4 py-2 hover:bg-accent/5 rounded transition-colors group border-l-2 border-accent">
          <span className="text-accent shrink-0 pt-0.5">⚡</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <a 
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-light dark:text-fg-dark group-hover:text-accent transition-colors font-medium"
              >
                {tool.name} — {tool.tagline}
                <ExternalLink size={10} className="inline ml-2 opacity-0 group-hover:opacity-50" />
              </a>
            </div>
            <div className="mt-1 text-[11px] text-fg-dark-muted">
              {tool.description}
            </div>
            <div className="flex gap-4 mt-1 text-[10px] text-fg-dark-muted">
              <span className="text-accent">[{tool.category}]</span>
              <span className="flex items-center gap-1">
                <span className="text-term-orange">▲</span> {tool.votes.toLocaleString()} votes
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-fg-dark-muted mt-4 opacity-50">
        Rotates daily from curated AI tools list
      </p>
    </div>
  );
};

// ===== TOKEN PRICES VIEW =====
export const PricesView: React.FC = () => {
  const { data, loading } = useAISignals();

  if (loading || !data) return <LoadingState />;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-4">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-term-green">// token_prices.json</span> - LLM pricing comparison ($/1M tokens)
        </div>
      </div>
      
      <div className="space-y-2 text-[13px]">
        {data.tokenPrices.map((price, idx) => (
          <div 
            key={idx}
            className="flex items-center gap-3 pl-4 py-2 hover:bg-accent/5 rounded transition-colors group border-l-2 border-transparent hover:border-term-green"
          >
            <span className="text-term-green shrink-0">{(idx + 1).toString().padStart(2, '0')}.</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-fg-light dark:text-fg-dark font-medium">{price.model}</span>
                <span className="text-[10px] text-fg-dark-muted">({price.provider})</span>
              </div>
              <div className="flex gap-4 mt-1 text-[10px] text-fg-dark-muted font-mono">
                <span className="text-term-green">in: ${price.input.toFixed(2)}</span>
                <span className="text-term-orange">out: ${price.output.toFixed(2)}</span>
                <span>ctx: {price.context}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-fg-dark-muted mt-4 opacity-50">
        Prices as of December 2024. Check provider websites for latest.
      </p>
    </div>
  );
};
