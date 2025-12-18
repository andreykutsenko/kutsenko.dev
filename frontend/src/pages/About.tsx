import { Lang } from '../types';
import { User, Server, Terminal as TerminalIcon } from 'lucide-react';

interface AboutProps {
  lang: Lang;
}

interface TerminalPanelProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ title, children, icon, className }) => (
    <div className={`border border-border-light dark:border-border-dark bg-panel-light dark:bg-panel-dark flex flex-col h-full rounded-lg overflow-hidden shadow-sm dark:shadow-black/40 relative ${className}`}>
      {/* Corner decorations - same as Dashboard */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent/20 rounded-tl-lg pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent/20 rounded-tr-lg pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent/20 rounded-bl-lg pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent/20 rounded-br-lg pointer-events-none"></div>
      
      <div className="px-4 py-3 bg-slate-50 dark:bg-[#1f242e] border-b border-border-light dark:border-border-dark shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
           {/* Window Controls */}
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
           </div>
        </div>
      </div>
      <div className="p-5 overflow-y-auto scrollbar-hide flex-1">
        {children}
      </div>
    </div>
  );

const Prompt: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex items-start gap-2 font-mono text-sm mb-2">
        <span className="text-accent select-none mt-0.5">❯</span>
        <span className="text-fg-light dark:text-fg-dark font-medium break-all">{children}</span>
    </div>
);

interface OutputProps {
  children: React.ReactNode;
  isLink?: boolean;
}

const Output: React.FC<OutputProps> = ({ children, isLink }) => (
    <div className={`pl-5 mb-3 text-sm font-mono ${isLink ? 'hover:bg-slate-50 dark:hover:bg-white/5 -ml-2 p-2 rounded w-fit' : ''}`}>
       <div className="text-slate-600 dark:text-fg-dark-muted leading-relaxed">
         {children}
       </div>
    </div>
);

export const About: React.FC<AboutProps> = () => {
  return (
    <div className="pb-12 font-mono">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-fg-dark-muted mb-3">
          <span className="text-accent">❯</span>
          <span>cat ~/about.md</span>
        </div>
        <h1 className="text-2xl font-bold text-fg-light dark:text-fg-dark mb-2 tracking-tight">
            Andrey Kutsenko
        </h1>
        <p className="text-sm text-slate-500 dark:text-fg-dark-muted max-w-2xl border-l-2 border-accent pl-4">
            Software engineer building automation tools and AI agents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Summary */}
        <TerminalPanel title="whoami" icon={<User size={12} className="text-cyan-400" />}>
            <Prompt>cat ./profile.txt</Prompt>
            <Output>
                <div className="grid grid-cols-[80px_1fr] gap-2 text-xs">
                    <span className="opacity-50">Role</span> <span>Software Engineer</span>
                    <span className="opacity-50">Focus</span> <span>Automation & LLM Ops</span>
                    <span className="opacity-50">Location</span> <span>San Francisco, CA</span>
                    <span className="opacity-50">Founder</span> 
                    <span>
                      <a 
                        href="https://simpleprocess.io" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-accent-light dark:text-accent hover:underline decoration-1 underline-offset-4"
                      >
                        SimpleProcess.io
                      </a>
                    </span>
                </div>
            </Output>
        </TerminalPanel>

        {/* Contact Links */}
        <TerminalPanel title="contacts" icon={<TerminalIcon size={12} className="text-green-400" />}>
             <Prompt>ls -la ~/links</Prompt>
             <div className="space-y-1 mt-2 text-xs">
                 <Output isLink><a href="mailto:kutsenko@gmail.com" className="text-accent-light dark:text-accent hover:underline">→ kutsenko@gmail.com</a></Output>
                 <Output isLink><a href="https://www.linkedin.com/in/andreykutsenko/" target="_blank" rel="noopener noreferrer" className="text-accent-light dark:text-accent hover:underline">→ linkedin/andreykutsenko</a></Output>
                 <Output isLink><a href="https://t.me/kutsenko_dev" target="_blank" rel="noopener noreferrer" className="text-accent-light dark:text-accent hover:underline">→ t.me/kutsenko_dev</a></Output>
             </div>
        </TerminalPanel>

        {/* Tech Stack */}
        <TerminalPanel title="stack.conf" icon={<Server size={12} className="text-purple-400" />} className="md:col-span-2">
                 <Prompt>grep -r "skill" ./</Prompt>
                 <div className="pl-5 pt-2 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-fg-dark-muted">
                    <div className="space-y-1">
                        <div className="text-fg-light dark:text-fg-dark font-bold mb-2 pb-1 border-b border-border-light dark:border-white/10 w-fit text-[10px] uppercase tracking-wider">Languages</div>
                        <div>Python, TypeScript</div>
                        <div>Rust, SQL</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-fg-light dark:text-fg-dark font-bold mb-2 pb-1 border-b border-border-light dark:border-white/10 w-fit text-[10px] uppercase tracking-wider">Automation</div>
                        <div>n8n, CRM integrations</div>
                        <div>Data parsing</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-fg-light dark:text-fg-dark font-bold mb-2 pb-1 border-b border-border-light dark:border-white/10 w-fit text-[10px] uppercase tracking-wider">Infra</div>
                        <div>Cloudflare, Docker</div>
                        <div>LLM Evals/Ops</div>
                    </div>
                </div>
        </TerminalPanel>
        
        {/* Career Log */}
        <TerminalPanel title="history.log" className="md:col-span-2">
           <Prompt>tail -n 5 career.log</Prompt>
           <div className="pl-5 mt-2 space-y-2 text-xs font-mono">
                <div className="flex gap-3">
                    <span className="text-accent shrink-0">[2023-NOW]</span>
                    <span className="text-fg-light dark:text-fg-dark">Software Engineer @ InfoIMAGE</span>
                </div>
                <div className="flex gap-3">
                    <span className="text-accent shrink-0">[2023-NOW]</span>
                    <span className="text-fg-light dark:text-fg-dark">Founder @ SIMPLE PROCESS LLC</span>
                </div>
                <div className="flex gap-3 opacity-60">
                    <span className="shrink-0">[2022-2023]</span>
                    <span>QA Engineer @ InfoIMAGE</span>
                </div>
                <div className="flex gap-3 opacity-40">
                    <span className="shrink-0">[2017-2021]</span>
                    <span>Freelance Consultant</span>
                </div>
           </div>
        </TerminalPanel>

      </div>
    </div>
  );
};
