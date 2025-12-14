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
    <div className={`border border-border-light dark:border-border-dark bg-panel-light dark:bg-panel-dark flex flex-col h-full rounded-lg overflow-hidden shadow-sm dark:shadow-black/40 ${className}`}>
      <div className="px-4 py-3 bg-slate-50 dark:bg-[#1f242e] border-b border-border-light dark:border-border-dark shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
           {/* Window Controls */}
           <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
           </div>
           <h3 className="text-xs font-semibold text-slate-500 dark:text-fg-dark-muted ml-2 font-mono flex items-center gap-2">
              {icon}
              {title}
           </h3>
        </div>
      </div>
      <div className="p-5 overflow-y-auto scrollbar-hide flex-1">
        {children}
      </div>
    </div>
  );

const Prompt: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex items-start gap-2 font-mono text-sm mb-2">
        <span className="text-accent select-none mt-0.5">➜</span>
        <span className="text-accent-light dark:text-term-cyan select-none mt-0.5">~</span>
        <span className="text-fg-light dark:text-fg-dark font-medium break-all">{children}</span>
    </div>
);

interface OutputProps {
  children: React.ReactNode;
  isLink?: boolean;
}

const Output: React.FC<OutputProps> = ({ children, isLink }) => (
    <div className={`pl-6 mb-4 text-sm font-mono ${isLink ? 'hover:bg-slate-50 dark:hover:bg-white/5 -ml-2 p-2 rounded w-fit' : ''}`}>
       <div className="text-slate-600 dark:text-fg-dark-muted leading-relaxed">
         {children}
       </div>
    </div>
);

export const About: React.FC<AboutProps> = () => {
  return (
    <div className="pb-12 font-mono">
      <div className="mb-8 pl-1">
            <h1 className="text-2xl font-bold text-fg-light dark:text-fg-dark mb-2 tracking-tight">
                Andrey Kutsenko
            </h1>
            <p className="text-sm text-slate-500 dark:text-fg-dark-muted max-w-2xl border-l-2 border-accent pl-4">
                Software engineer building automation tools and AI agents.
            </p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Summary */}
        <TerminalPanel title="whoami" icon={<User size={12} />}>
            <Prompt>cat ./profile.txt</Prompt>
            <Output>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="opacity-50">Role:</span> <span>Software Engineer</span>
                    <span className="opacity-50">Focus:</span> <span>Automation & LLM Ops</span>
                    <span className="opacity-50">Location:</span> <span>San Francisco, CA</span>
                    <span className="opacity-50">Founder:</span> 
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
        <TerminalPanel title="contact_uplink" icon={<TerminalIcon size={12} />}>
             <Prompt>ls -la /contact</Prompt>
             <div className="space-y-1 mt-2">
                 <Output isLink><a href="mailto:kutsenko@gmail.com" className="text-accent-light dark:text-accent hover:underline">kutsenko@gmail.com</a></Output>
                 <Output isLink><a href="https://www.linkedin.com/in/andreykutsenko/" target="_blank" rel="noopener noreferrer" className="text-accent-light dark:text-accent hover:underline">linkedin/andreykutsenko</a></Output>
                 <Output isLink><a href="https://t.me/kutsenko_dev" target="_blank" rel="noopener noreferrer" className="text-accent-light dark:text-accent hover:underline">t.me/kutsenko_dev</a></Output>
             </div>
        </TerminalPanel>

        {/* Tech Stack */}
        <TerminalPanel title="skills.conf" icon={<Server size={12} />} className="md:col-span-2">
                 <Prompt>grep -r "Expertise" .</Prompt>
                 <div className="pl-6 pt-2 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 dark:text-fg-dark-muted">
                    <div className="space-y-1">
                        <div className="text-fg-light dark:text-fg-dark font-bold mb-2 pb-1 border-b border-border-light dark:border-white/10 w-fit">Core Stack</div>
                        <div>Python, TypeScript</div>
                        <div>Rust Tooling</div>
                        <div>SQL (Postgres/CH)</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-fg-light dark:text-fg-dark font-bold mb-2 pb-1 border-b border-border-light dark:border-white/10 w-fit">Automation</div>
                        <div>n8n Orchestration</div>
                        <div>CRM Integrations</div>
                        <div>Data Parsing</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-fg-light dark:text-fg-dark font-bold mb-2 pb-1 border-b border-border-light dark:border-white/10 w-fit">Infrastructure</div>
                        <div>Cloudflare Workers</div>
                        <div>LLM Evals/Ops</div>
                        <div>Docker/Linux</div>
                    </div>
                </div>
        </TerminalPanel>
        
        {/* Career Log */}
        <TerminalPanel title="career.log" className="md:col-span-2">
           <Prompt>tail -n 10 career_history.log</Prompt>
           <div className="pl-6 mt-3 space-y-3 text-xs font-mono">
                <div className="flex gap-4">
                    <span className="text-accent whitespace-nowrap">[2023-NOW]</span>
                    <span className="text-fg-light dark:text-fg-dark">Software Engineer @ InfoIMAGE</span>
                </div>
                <div className="flex gap-4">
                    <span className="text-accent whitespace-nowrap">[2023-NOW]</span>
                    <span className="text-fg-light dark:text-fg-dark">CEO & Founder @ SIMPLE PROCESS LLC</span>
                </div>
                <div className="flex gap-4 opacity-70">
                    <span className="text-slate-400 whitespace-nowrap">[2022-2023]</span>
                    <span>QA Engineer @ InfoIMAGE</span>
                </div>
                <div className="flex gap-4 opacity-70">
                    <span className="text-slate-400 whitespace-nowrap">[2017-2021]</span>
                    <span>Freelance Software Consultant</span>
                </div>
                <div className="flex gap-4 opacity-50">
                    <span className="text-slate-500 whitespace-nowrap">[2013-2015]</span>
                    <span>Deputy Head of Credit Admin @ JSC "BPS-Sberbank"</span>
                </div>
           </div>
        </TerminalPanel>

      </div>
    </div>
  );
};
