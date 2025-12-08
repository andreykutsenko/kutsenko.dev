import { 
  Send, 
  User, 
  FileText, 
  Shield, 
  Database, 
  Calendar,
  Bot,
  ArrowRight
} from 'lucide-react';
import type { Lang, AgentPreset } from '../types';
import { AGENT_PRESETS } from '../constants';
import './pages.css';

interface AgentsPageProps {
  lang: Lang;
  t: (key: string) => string;
}

export function AgentsPage({ t }: AgentsPageProps) {
  // Group agents by category
  const categories = {
    outreach: AGENT_PRESETS.filter(a => a.category === 'outreach'),
    content: AGENT_PRESETS.filter(a => a.category === 'content'),
    utility: AGENT_PRESETS.filter(a => a.category === 'utility'),
    guard: AGENT_PRESETS.filter(a => a.category === 'guard'),
  };

  return (
    <div className="agents-page">
      {/* Page Header */}
      <header className="agents-header">
        <div className="agents-header__icon">
          <Bot size={32} />
        </div>
        <div>
          <h1 className="agents-title">{t('section.agents')}</h1>
          <p className="agents-subtitle">{t('section.agents.tagline')}</p>
        </div>
      </header>

      {/* Info Banner */}
      <div className="agents-banner">
        <p>
          <span className="text-accent">$</span> These are pre-configured automation 
          agents built on SimpleProcess.io infrastructure. Some are active, others 
          are in development.
        </p>
      </div>

      {/* Agents Grid */}
      <div className="agents-grid">
        {/* Outreach Agents */}
        {categories.outreach.length > 0 && (
          <section className="agents-section">
            <h2 className="agents-section__title">
              <Send size={18} />
              Outreach
            </h2>
            <div className="agents-cards">
              {categories.outreach.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </section>
        )}

        {/* Content Agents */}
        {categories.content.length > 0 && (
          <section className="agents-section">
            <h2 className="agents-section__title">
              <FileText size={18} />
              Content
            </h2>
            <div className="agents-cards">
              {categories.content.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </section>
        )}

        {/* Utility Agents */}
        {categories.utility.length > 0 && (
          <section className="agents-section">
            <h2 className="agents-section__title">
              <Database size={18} />
              Utility
            </h2>
            <div className="agents-cards">
              {categories.utility.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </section>
        )}

        {/* Guard Agents */}
        {categories.guard.length > 0 && (
          <section className="agents-section">
            <h2 className="agents-section__title">
              <Shield size={18} />
              Safety & Guards
            </h2>
            <div className="agents-cards">
              {categories.guard.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* CTA Section */}
      <div className="agents-cta">
        <p>Want a custom agent for your workflow?</p>
        <a href="mailto:kutsenko@gmail.com" className="btn btn--primary">
          Get in Touch
          <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}

/** Single agent card component */
function AgentCard({ agent }: { agent: AgentPreset }) {
  const statusLabels = {
    active: 'Active',
    beta: 'Beta',
    'coming-soon': 'Coming Soon',
  };

  return (
    <div className={`agent-card agent-card--${agent.status}`}>
      <div className="agent-card__header">
        <div className="agent-card__icon">
          <AgentIcon name={agent.icon} />
        </div>
        <span className={`agent-status agent-status--${agent.status}`}>
          {statusLabels[agent.status]}
        </span>
      </div>
      
      <h3 className="agent-card__name">{agent.name}</h3>
      <p className="agent-card__desc">{agent.description}</p>
      
      {agent.status === 'active' && (
        <button className="btn btn--ghost btn--sm agent-card__action">
          Learn More
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

/** Helper to render agent icons */
function AgentIcon({ name }: { name: string }) {
  const size = 20;
  switch (name) {
    case 'send': return <Send size={size} />;
    case 'user': return <User size={size} />;
    case 'file-text': return <FileText size={size} />;
    case 'shield': return <Shield size={size} />;
    case 'database': return <Database size={size} />;
    case 'calendar': return <Calendar size={size} />;
    default: return <Bot size={size} />;
  }
}


