import { Lang } from '../types';
import { User, Server, Terminal as TerminalIcon, GraduationCap } from 'lucide-react';

interface TerminalAboutProps {
  lang: Lang;
  t: (key: string) => string;
}

interface TerminalPanelProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ title, children, icon, className }) => (
    <div className={`border border-border-light dark:border-border-dark bg-panel-light dark:bg-panel-dark flex flex-col h-full rounded-lg overflow-hidden shadow-sm dark:shadow-black/40 relative ${className}`}>
      {/* Corner decorations */}
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

export const TerminalAbout: React.FC<TerminalAboutProps> = ({ t }) => {
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
            {t('hero.tagline')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Summary */}
        <TerminalPanel title="whoami" icon={<User size={12} className="text-cyan-400" />}>
            <Prompt>cat ./profile.txt</Prompt>
            <Output>
                <div className="grid grid-cols-[90px_1fr] gap-2 text-xs">
                    <span className="opacity-50">Name</span> <span>Andrey Kutsenko</span>
                    <span className="opacity-50">Role</span> <span>Software Engineer</span>
                    <span className="opacity-50">Focus</span> <span>Banking Systems & Data Processing</span>
                    <span className="opacity-50">Location</span> <span>San Francisco, CA 94122</span>
                    <span className="opacity-50">Phone</span> <span>929-273-8787</span>
                    <span className="opacity-50">Company</span> 
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
                 <Output isLink><a href="tel:929-273-8787" className="text-accent-light dark:text-accent hover:underline">→ 929-273-8787</a></Output>
                 <Output isLink><a href="https://www.linkedin.com/in/andreykutsenko/" target="_blank" rel="noopener noreferrer" className="text-accent-light dark:text-accent hover:underline">→ linkedin/andreykutsenko</a></Output>
                 <Output isLink><a href="https://t.me/kutsenko_dev" target="_blank" rel="noopener noreferrer" className="text-accent-light dark:text-accent hover:underline">→ t.me/kutsenko_dev</a></Output>
             </div>
        </TerminalPanel>

        {/* Tech Stack */}
        <TerminalPanel title="stack.conf" icon={<Server size={12} className="text-purple-400" />} className="md:col-span-2">
                 <Prompt>grep -r "skill" ./</Prompt>
                 <div className="pl-5 pt-2 grid grid-cols-1 md:grid-cols-4 gap-6 text-xs text-slate-600 dark:text-fg-dark-muted">
                    <div className="space-y-1">
                        <div className="text-fg-light dark:text-fg-dark font-bold mb-2 pb-1 border-b border-border-light dark:border-white/10 w-fit text-[10px] uppercase tracking-wider">Languages</div>
                        <div>Python, TypeScript</div>
                        <div>SQL, Shell Script</div>
                        <div>Rust</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-fg-light dark:text-fg-dark font-bold mb-2 pb-1 border-b border-border-light dark:border-white/10 w-fit text-[10px] uppercase tracking-wider">Automation</div>
                        <div>n8n, CRM integrations</div>
                        <div>HubSpot, Salesforce</div>
                        <div>Data parsing & extraction</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-fg-light dark:text-fg-dark font-bold mb-2 pb-1 border-b border-border-light dark:border-white/10 w-fit text-[10px] uppercase tracking-wider">Database</div>
                        <div>Oracle, MS SQL Server</div>
                        <div>PostgreSQL</div>
                        <div>REST API testing</div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-fg-light dark:text-fg-dark font-bold mb-2 pb-1 border-b border-border-light dark:border-white/10 w-fit text-[10px] uppercase tracking-wider">Infra</div>
                        <div>Docker, Cloudflare</div>
                        <div>Unix/Linux admin</div>
                        <div>CI/CD pipelines</div>
                    </div>
                </div>
        </TerminalPanel>
        
        {/* Career Log */}
        <TerminalPanel title="career.log" className="md:col-span-2">
           <Prompt>tail -n 10 career.log</Prompt>
           <div className="pl-5 mt-2 space-y-2 text-xs font-mono">
                <div className="flex gap-3">
                    <span className="text-accent shrink-0">[09/2023-NOW]</span>
                    <span className="text-fg-light dark:text-fg-dark">Software Engineer @ InfoIMAGE</span>
                </div>
                <div className="flex gap-3">
                    <span className="text-accent shrink-0">[05/2023-NOW]</span>
                    <span className="text-fg-light dark:text-fg-dark">CEO & Co-founder @ SIMPLE PROCESS LLC</span>
                </div>
                <div className="flex gap-3 opacity-80">
                    <span className="shrink-0">[01/2022-09/2023]</span>
                    <span>QA Engineer @ InfoIMAGE</span>
                </div>
                <div className="flex gap-3 opacity-60">
                    <span className="shrink-0">[03/2017-12/2021]</span>
                    <span>Freelance Software Consultant</span>
                </div>
                <div className="flex gap-3 opacity-50">
                    <span className="shrink-0">[05/2013-10/2015]</span>
                    <span>Deputy Head, Credit Admin @ BPS-Sberbank</span>
                </div>
                <div className="flex gap-3 opacity-40">
                    <span className="shrink-0">[12/2010-04/2013]</span>
                    <span>Head of Standards @ BPS-Sberbank</span>
                </div>
                <div className="flex gap-3 opacity-30">
                    <span className="shrink-0">[12/2004-12/2010]</span>
                    <span>Chief Engineer-Programmer @ BPS-Sberbank</span>
                </div>
           </div>
        </TerminalPanel>

        {/* Education */}
        <TerminalPanel title="education.log" icon={<GraduationCap size={12} className="text-blue-400" />} className="md:col-span-2">
           <Prompt>cat ~/education.txt</Prompt>
           <div className="pl-5 mt-2 space-y-3 text-xs font-mono">
                <div>
                    <div className="flex gap-3 items-center">
                        <span className="text-accent shrink-0">[2005]</span>
                        <span className="text-fg-light dark:text-fg-dark font-bold">Master's Degree in Management</span>
                    </div>
                    <div className="pl-16 text-fg-dark-muted opacity-70">Gomel State Technical University, Belarus</div>
                </div>
                <div>
                    <div className="flex gap-3 items-center">
                        <span className="text-accent shrink-0">[1999]</span>
                        <span className="text-fg-light dark:text-fg-dark font-bold">Master's Degree in Industrial Electronics</span>
                    </div>
                    <div className="pl-16 text-fg-dark-muted opacity-70">Gomel State Technical University Pavel Sukhoi, Belarus</div>
                </div>
           </div>
        </TerminalPanel>

      </div>
    </div>
  );
};
