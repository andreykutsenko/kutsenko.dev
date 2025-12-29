import { Trophy, FlaskConical, Zap, DollarSign, ExternalLink, Star, GitFork } from 'lucide-react';

// ===== LMSYS ARENA VIEW =====
// Mock data - would come from lmsys.org API
const MOCK_ARENA_DATA = [
  { rank: 1, model: 'GPT-4o', elo: 1287, organization: 'OpenAI', change: '+2' },
  { rank: 2, model: 'Claude 3.5 Sonnet', elo: 1268, organization: 'Anthropic', change: '0' },
  { rank: 3, model: 'Gemini 1.5 Pro', elo: 1254, organization: 'Google', change: '-1' },
];

export const ArenaView: React.FC = () => {
  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-term-orange">// lmsys_arena.json</span> - Chatbot Arena Leaderboard
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Trophy size={24} className="text-term-orange" />
        <div>
          <h2 className="text-lg font-bold text-fg-light dark:text-fg-dark">LMSYS Chatbot Arena</h2>
          <p className="text-xs text-fg-dark-muted">Top 3 models by ELO rating (live)</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {MOCK_ARENA_DATA.map((model, idx) => (
          <div 
            key={idx}
            className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
              idx === 0 
                ? 'border-term-orange/50 bg-term-orange/5' 
                : 'border-border-dark bg-black/10 hover:border-accent/30'
            }`}
          >
            <div className={`text-2xl font-black ${idx === 0 ? 'text-term-orange' : 'text-fg-dark-muted'}`}>
              #{model.rank}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-fg-light dark:text-fg-dark">{model.model}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  model.change.startsWith('+') ? 'bg-green-500/20 text-green-400' :
                  model.change === '0' ? 'bg-gray-500/20 text-gray-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {model.change}
                </span>
              </div>
              <div className="text-xs text-fg-dark-muted">{model.organization}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-accent">{model.elo}</div>
              <div className="text-[10px] text-fg-dark-muted uppercase">ELO</div>
            </div>
          </div>
        ))}
      </div>

      <a 
        href="https://chat.lmsys.org/?leaderboard" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 mt-6 text-xs text-fg-dark-muted hover:text-accent transition-colors"
      >
        <ExternalLink size={12} />
        View full leaderboard on lmsys.org
      </a>
    </div>
  );
};

// ===== PAPERS WITH CODE VIEW =====
// Mock data - would come from paperswithcode.com API
const MOCK_PAPERS_DATA = [
  { 
    title: 'Scaling Laws for Neural Language Models', 
    authors: 'Kaplan et al.',
    stars: 2847,
    repo: 'openai/scaling-laws',
    arxiv: 'https://arxiv.org/abs/2001.08361',
    category: 'NLP'
  },
  { 
    title: 'Chain-of-Thought Prompting Elicits Reasoning', 
    authors: 'Wei et al.',
    stars: 1923,
    repo: 'google-research/chain-of-thought',
    arxiv: 'https://arxiv.org/abs/2201.11903',
    category: 'Reasoning'
  },
  { 
    title: 'Constitutional AI: Harmlessness from AI Feedback', 
    authors: 'Bai et al.',
    stars: 856,
    repo: 'anthropic/constitutional-ai',
    arxiv: 'https://arxiv.org/abs/2212.08073',
    category: 'Alignment'
  },
];

export const PapersView: React.FC = () => {
  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-term-purple"># papers.py</span> - Papers with Code implementations
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FlaskConical size={24} className="text-term-purple" />
        <div>
          <h2 className="text-lg font-bold text-fg-light dark:text-fg-dark">Paper → Code</h2>
          <p className="text-xs text-fg-dark-muted">AI papers with GitHub implementations</p>
        </div>
      </div>

      {/* Papers List */}
      <div className="space-y-4">
        {MOCK_PAPERS_DATA.map((paper, idx) => (
          <div 
            key={idx}
            className="p-4 border border-border-dark rounded-lg bg-black/10 hover:border-term-purple/50 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] px-1.5 py-0.5 bg-term-purple/20 text-term-purple rounded font-bold uppercase">
                    {paper.category}
                  </span>
                </div>
                <a 
                  href={paper.arxiv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-fg-light dark:text-fg-dark group-hover:text-term-purple transition-colors"
                >
                  {paper.title}
                </a>
                <div className="text-xs text-fg-dark-muted mt-1">{paper.authors}</div>
              </div>
              <div className="flex items-center gap-3 text-xs text-fg-dark-muted">
                <span className="flex items-center gap-1">
                  <Star size={12} className="text-term-orange" />
                  {paper.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={12} />
                  {paper.repo}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a 
        href="https://paperswithcode.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 mt-6 text-xs text-fg-dark-muted hover:text-accent transition-colors"
      >
        <ExternalLink size={12} />
        Browse more on paperswithcode.com
      </a>
    </div>
  );
};

// ===== AI TOOL OF THE DAY =====
// Mock data - would come from Product Hunt or curated
const MOCK_TOOL = {
  name: 'Cursor',
  tagline: 'The AI Code Editor',
  description: 'Built to make you extraordinarily productive. Cursor is a fork of VS Code with native AI integration.',
  votes: 2847,
  url: 'https://cursor.com',
  category: 'Developer Tools',
  featured: true
};

export const ToolView: React.FC = () => {
  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-accent"># tool_of_day.md</span> - Today's featured AI tool
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Zap size={24} className="text-accent" />
        <div>
          <h2 className="text-lg font-bold text-fg-light dark:text-fg-dark">AI Tool of the Day</h2>
          <p className="text-xs text-fg-dark-muted">One tool. No noise.</p>
        </div>
      </div>

      {/* Featured Tool Card */}
      <div className="border-2 border-accent/50 rounded-xl p-6 bg-accent/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 px-3 py-1 bg-accent text-black text-[10px] font-bold uppercase rounded-bl-lg">
          Featured
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-black/20 flex items-center justify-center text-2xl">
            ⚡
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-fg-light dark:text-fg-dark mb-1">
              {MOCK_TOOL.name}
            </h3>
            <p className="text-sm text-accent font-medium mb-2">{MOCK_TOOL.tagline}</p>
            <p className="text-xs text-fg-dark-muted leading-relaxed">
              {MOCK_TOOL.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-accent/20">
          <div className="flex items-center gap-4 text-xs text-fg-dark-muted">
            <span className="px-2 py-1 bg-black/20 rounded">{MOCK_TOOL.category}</span>
            <span className="flex items-center gap-1">
              <span className="text-term-orange">▲</span> {MOCK_TOOL.votes} votes
            </span>
          </div>
          <a 
            href={MOCK_TOOL.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-accent text-black font-bold text-xs rounded-lg hover:bg-accent/80 transition-colors flex items-center gap-2"
          >
            Try it <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <p className="text-[10px] text-fg-dark-muted mt-4 text-center opacity-50">
        Updated daily from Product Hunt & Twitter/X trends
      </p>
    </div>
  );
};

// ===== TOKEN PRICES VIEW =====
// Mock data - would come from OpenAI/Anthropic pricing pages
const MOCK_PRICES = [
  { model: 'GPT-4o', provider: 'OpenAI', input: 2.50, output: 10.00, context: '128K' },
  { model: 'GPT-4o-mini', provider: 'OpenAI', input: 0.15, output: 0.60, context: '128K' },
  { model: 'Claude 3.5 Sonnet', provider: 'Anthropic', input: 3.00, output: 15.00, context: '200K' },
  { model: 'Claude 3.5 Haiku', provider: 'Anthropic', input: 0.25, output: 1.25, context: '200K' },
  { model: 'Gemini 1.5 Pro', provider: 'Google', input: 1.25, output: 5.00, context: '2M' },
];

export const PricesView: React.FC = () => {
  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-term-green">// token_prices.json</span> - LLM pricing comparison
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <DollarSign size={24} className="text-term-green" />
        <div>
          <h2 className="text-lg font-bold text-fg-light dark:text-fg-dark">Token Prices</h2>
          <p className="text-xs text-fg-dark-muted">Cost per 1M tokens (USD)</p>
        </div>
      </div>

      {/* Price Table */}
      <div className="border border-border-dark rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-black/20 text-[10px] font-bold text-fg-dark-muted uppercase">
          <div className="col-span-2">Model</div>
          <div className="text-right">Input</div>
          <div className="text-right">Output</div>
          <div className="text-right">Context</div>
        </div>
        
        {/* Rows */}
        {MOCK_PRICES.map((price, idx) => (
          <div 
            key={idx}
            className={`grid grid-cols-5 gap-2 px-4 py-3 text-xs border-t border-border-dark hover:bg-white/5 transition-colors ${
              idx === 0 ? 'bg-term-green/5' : ''
            }`}
          >
            <div className="col-span-2">
              <div className="font-bold text-fg-light dark:text-fg-dark">{price.model}</div>
              <div className="text-[10px] text-fg-dark-muted">{price.provider}</div>
            </div>
            <div className="text-right text-term-green font-mono">${price.input.toFixed(2)}</div>
            <div className="text-right text-term-orange font-mono">${price.output.toFixed(2)}</div>
            <div className="text-right text-fg-dark-muted">{price.context}</div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-fg-dark-muted mt-4 opacity-50">
        Prices as of December 2025. Check provider websites for latest.
      </p>
    </div>
  );
};
