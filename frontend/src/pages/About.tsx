import { Lang } from '../types';
import { Mail, Linkedin, Send, MapPin, ExternalLink } from 'lucide-react';

interface AboutProps {
  lang: Lang;
  t: (key: string) => string;
}

export const About: React.FC<AboutProps> = () => {
  return (
    <div className="max-w-2xl">
      {/* File header */}
      <div className="text-fg-dark-muted opacity-50 text-xs font-mono mb-6">
        <span className="text-[#519aba]"># about_me.md</span> - Profile
      </div>

      {/* Simple Profile Block - Terminal Style */}
      <div className="space-y-6 font-mono text-sm">
        
        {/* Identity */}
        <div className="border-l-2 border-accent pl-4">
          <h1 className="text-xl font-bold text-fg-light dark:text-fg-dark mb-1">
            Andrey Kutsenko
          </h1>
          <p className="text-fg-dark-muted text-xs">
            Software engineer building automation tools and AI agents.
          </p>
        </div>

        {/* Quick Info */}
        <div className="bg-black/10 dark:bg-black/20 rounded p-4 space-y-2 text-xs">
          <div className="flex gap-4">
            <span className="text-term-purple w-20">location:</span>
            <span className="text-fg-light dark:text-fg-dark">San Francisco, CA</span>
          </div>
          <div className="flex gap-4">
            <span className="text-term-purple w-20">focus:</span>
            <span className="text-fg-light dark:text-fg-dark">Banking systems, Data processing, Automation</span>
          </div>
          <div className="flex gap-4">
            <span className="text-term-purple w-20">stack:</span>
            <span className="text-term-orange">Python, TypeScript, SQL, Docker</span>
          </div>
        </div>

        {/* Contacts - Simple List */}
        <div>
          <div className="text-term-purple text-[11px] uppercase tracking-widest mb-3">## Contacts</div>
          <div className="space-y-2">
            <a 
              href="mailto:kutsenko@gmail.com" 
              className="flex items-center gap-3 text-fg-dark-muted hover:text-accent transition-colors group"
            >
              <Mail size={14} />
              <span className="group-hover:underline">kutsenko@gmail.com</span>
              <ExternalLink size={10} className="opacity-0 group-hover:opacity-50" />
            </a>
            <a 
              href="https://www.linkedin.com/in/andreykutsenko/" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-fg-dark-muted hover:text-accent transition-colors group"
            >
              <Linkedin size={14} />
              <span className="group-hover:underline">linkedin.com/in/andreykutsenko</span>
              <ExternalLink size={10} className="opacity-0 group-hover:opacity-50" />
            </a>
            <a 
              href="https://t.me/kutsenko_dev" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-fg-dark-muted hover:text-accent transition-colors group"
            >
              <Send size={14} />
              <span className="group-hover:underline">@kutsenko_dev</span>
              <ExternalLink size={10} className="opacity-0 group-hover:opacity-50" />
            </a>
            <div className="flex items-center gap-3 text-fg-dark-muted">
              <MapPin size={14} />
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>

        {/* Career - Just Current */}
        <div>
          <div className="text-term-purple text-[11px] uppercase tracking-widest mb-3">## Current</div>
          <div className="space-y-3 text-xs">
            <div className="border-l border-accent/30 pl-3">
              <div className="text-fg-light dark:text-fg-dark font-bold">Software Engineer @ InfoIMAGE</div>
              <div className="text-fg-dark-muted">Data parsing & automation for fintech</div>
            </div>
            <div className="border-l border-accent/30 pl-3">
              <div className="text-fg-light dark:text-fg-dark font-bold">CEO @ SIMPLE PROCESS LLC</div>
              <div className="text-fg-dark-muted">Business automation & AI-driven tools</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-[10px] text-fg-dark-muted opacity-40 pt-4 border-t border-border-dark">
          ---<br />
          Press <kbd className="px-1 py-0.5 bg-black/20 rounded text-accent">`</kbd> for terminal
        </div>
      </div>
    </div>
  );
};
