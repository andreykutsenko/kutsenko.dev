import { Lang } from '../types';
import { Server, Terminal as TerminalIcon, GitBranch, Mail, Linkedin, Send, FileJson, History, MapPin } from 'lucide-react';

interface AboutProps {
  lang: Lang;
  t: (key: string) => string;
}

interface IDEPanelProps {
  title: string;
  path: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  footerStatus?: string;
}

const IDEPanel: React.FC<IDEPanelProps> = ({ title, path, children, icon, className, footerStatus }) => (
    <div className={`border border-border-light dark:border-border-dark bg-panel-light dark:bg-panel-dark flex flex-col h-full rounded shadow-2xl transition-all hover:border-accent/40 ${className || ''}`}>
      {/* IDE Tab */}
      <div className="flex bg-slate-100 dark:bg-[#0d1117] border-b border-border-light dark:border-border-dark">
          <div className="px-4 py-2 bg-panel-light dark:bg-panel-dark border-r border-border-light dark:border-border-dark flex items-center gap-2 text-[11px] font-bold text-accent">
             {icon}
             <span>{title}</span>
          </div>
          <div className="flex-1 flex items-center justify-end px-3 gap-1.5 opacity-30">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
      </div>
      
      {/* File Path Bar */}
      <div className="px-4 py-1 bg-slate-50 dark:bg-[#161b22] border-b border-border-light dark:border-border-dark flex items-center gap-2 text-[10px] text-fg-dark-muted font-mono overflow-x-auto">
         <span className="opacity-40">root</span>
         <span>/</span>
         <span className="opacity-40">src</span>
         <span>/</span>
         <span className="text-fg-light dark:text-fg-dark">{path}</span>
      </div>

      <div className="p-6 overflow-y-auto scrollbar-hide flex-1 font-mono text-sm leading-relaxed">
        {children}
      </div>

      {footerStatus && (
        <div className="px-4 py-1 bg-accent text-black flex justify-between items-center text-[9px] font-bold uppercase tracking-wider">
           <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><GitBranch size={10} /> main*</span>
              <span>{footerStatus}</span>
           </div>
           <div>UTF-8</div>
        </div>
      )}
    </div>
  );

interface ContactItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, label, value, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-3 border border-white/5 bg-white/[0.02] hover:bg-accent/5 hover:border-accent/40 transition-all rounded">
        <span className="text-fg-dark-muted group-hover:text-accent transition-colors">{icon}</span>
        <div className="flex-1">
            <div className="text-[10px] uppercase font-bold text-fg-dark-muted group-hover:text-accent/60 tracking-wider mb-0.5">{label}</div>
            <div className="text-xs text-fg-light dark:text-fg-dark group-hover:text-accent font-bold">{value}</div>
        </div>
    </a>
);

interface GitCommitProps {
  hash: string;
  date: string;
  branch: string;
  role: string;
  company: string;
  desc: string;
  isCurrent?: boolean;
}

const GitCommit: React.FC<GitCommitProps> = ({ hash, date, branch, role, company, desc, isCurrent }) => (
    <div className="flex gap-6 group">
        <div className="flex flex-col items-center">
            <div className={`w-3.5 h-3.5 rounded-full border-2 z-10 ${isCurrent ? 'bg-accent border-accent animate-pulse' : 'border-border-dark bg-bg-dark'}`}></div>
            <div className="w-px flex-1 bg-border-dark group-last:hidden"></div>
        </div>
        <div className="pb-8">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1.5">
                <span className="text-term-purple font-bold text-[11px]">{hash}</span>
                <span className="text-accent text-[9px] font-mono px-2 py-0.5 border border-accent/20 rounded-full uppercase tracking-tighter">{branch}</span>
                <span className="text-fg-dark-muted text-[10px] opacity-60">{date}</span>
            </div>
            <div className="text-base font-bold text-fg-light dark:text-fg-dark group-hover:text-accent transition-colors">
                {role} <span className="text-term-blue mx-1 opacity-50">@</span> {company}
            </div>
            <p className="text-xs text-fg-dark-muted mt-1 leading-relaxed max-w-2xl opacity-80 italic">
                {desc}
            </p>
        </div>
    </div>
);

export const About: React.FC<AboutProps> = () => {
  return (
    <div className="pb-12 space-y-8">
      
      {/* Identity Header */}
      <div className="border-l-4 border-accent pl-6 py-2">
            <div className="flex flex-wrap items-center gap-4 mb-2">
                <h1 className="text-2xl md:text-4xl font-black text-fg-light dark:text-fg-dark tracking-tighter">
                    ANDREY KUTSENKO
                </h1>
                <div className="h-6 w-px bg-border-dark hidden md:block"></div>
                <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[10px] font-bold border border-accent/20 uppercase tracking-widest">Software Engineer</span>
            </div>
            <p className="text-sm md:text-lg text-slate-500 dark:text-fg-dark-muted max-w-2xl font-mono italic">
                Specializing in <span className="text-term-orange underline decoration-accent/30 underline-offset-4">banking systems</span>, data processing, and automation.
            </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Details Panel */}
        <div className="lg:col-span-7">
            <IDEPanel title="profile.json" path="identity/profile.json" icon={<FileJson size={12} />} footerStatus="OBJECT">
                <div className="space-y-1 text-xs md:text-sm">
                    <div><span className="text-term-purple">const</span> <span className="text-term-blue">developer</span> = &#123;</div>
                    <div className="pl-4 md:pl-6"><span className="text-term-orange">"name"</span>: <span className="text-accent">"Andrey Kutsenko"</span>,</div>
                    <div className="pl-4 md:pl-6"><span className="text-term-orange">"role"</span>: <span className="text-accent">"Software Engineer"</span>,</div>
                    <div className="pl-4 md:pl-6"><span className="text-term-orange">"location"</span>: <span className="text-accent">"San Francisco, CA"</span>,</div>
                    <div className="pl-4 md:pl-6"><span className="text-term-orange">"focus"</span>: [</div>
                    <div className="pl-8 md:pl-12"><span className="text-accent">"Banking Systems"</span>,</div>
                    <div className="pl-8 md:pl-12"><span className="text-accent">"Data Processing & Parsing"</span>,</div>
                    <div className="pl-8 md:pl-12"><span className="text-accent">"Automation Development"</span>,</div>
                    <div className="pl-8 md:pl-12"><span className="text-accent">"Test Automation & QA"</span></div>
                    <div className="pl-4 md:pl-6">],</div>
                    <div className="pl-4 md:pl-6"><span className="text-term-orange">"company"</span>: <span className="text-accent">"InfoIMAGE + SIMPLE PROCESS LLC"</span></div>
                    <div>&#125;;</div>
                </div>
            </IDEPanel>
        </div>

        {/* Contact Panel */}
        <div className="lg:col-span-5">
            <IDEPanel title="contact.sh" path="uplink/contact.sh" icon={<TerminalIcon size={12} />} footerStatus="BASH">
                <div className="text-fg-dark-muted mb-4 opacity-50 italic text-xs"># Initialize communication channels...</div>
                <div className="space-y-4">
                    <ContactItem icon={<Mail size={14} />} label="Email" value="kutsenko@gmail.com" href="mailto:kutsenko@gmail.com" />
                    <ContactItem icon={<Linkedin size={14} />} label="LinkedIn" value="andreykutsenko" href="https://www.linkedin.com/in/andreykutsenko/" />
                    <ContactItem icon={<Send size={14} />} label="Telegram" value="@kutsenko_dev" href="https://t.me/kutsenko_dev" />
                    <ContactItem icon={<MapPin size={14} />} label="Location" value="San Francisco, CA" href="https://maps.google.com/?q=San+Francisco+CA" />
                </div>
            </IDEPanel>
        </div>

        {/* Stack Panel */}
        <div className="lg:col-span-12">
            <IDEPanel title="stack.yaml" path="config/stack.yaml" icon={<Server size={12} />} footerStatus="YAML">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
                    <section>
                        <div className="text-term-purple mb-3 font-bold text-[11px] uppercase tracking-widest border-b border-white/5 pb-1">Languages:</div>
                        <ul className="space-y-2 pl-4 border-l border-accent/20 text-xs">
                            <li><span className="text-term-orange">Python</span></li>
                            <li><span className="text-term-orange">TypeScript</span></li>
                            <li><span className="text-term-orange">SQL</span></li>
                            <li><span className="text-term-orange">Rust</span></li>
                        </ul>
                    </section>
                    <section>
                        <div className="text-term-purple mb-3 font-bold text-[11px] uppercase tracking-widest border-b border-white/5 pb-1">Automation:</div>
                        <ul className="space-y-2 pl-4 border-l border-accent/20 text-xs">
                            <li><span className="text-term-orange">n8n</span></li>
                            <li><span className="text-term-orange">CRM integrations</span></li>
                            <li><span className="text-term-orange">Data parsing</span></li>
                        </ul>
                    </section>
                    <section>
                        <div className="text-term-purple mb-3 font-bold text-[11px] uppercase tracking-widest border-b border-white/5 pb-1">Database:</div>
                        <ul className="space-y-2 pl-4 border-l border-accent/20 text-xs">
                            <li><span className="text-term-orange">Oracle</span></li>
                            <li><span className="text-term-orange">MS SQL Server</span></li>
                            <li><span className="text-term-orange">PostgreSQL</span></li>
                        </ul>
                    </section>
                    <section>
                        <div className="text-term-purple mb-3 font-bold text-[11px] uppercase tracking-widest border-b border-white/5 pb-1">Infra:</div>
                        <ul className="space-y-2 pl-4 border-l border-accent/20 text-xs">
                            <li><span className="text-term-orange">Docker</span></li>
                            <li><span className="text-term-orange">Cloudflare</span></li>
                            <li><span className="text-term-orange">LLM Evals/Ops</span></li>
                        </ul>
                    </section>
                </div>
            </IDEPanel>
        </div>

        {/* Git Career Log */}
        <div className="lg:col-span-12">
            <IDEPanel title="git_log" path="history/career.log" icon={<History size={12} />} footerStatus="LOG">
                <div className="space-y-0">
                    <GitCommit 
                        hash="ef42a1" 
                        date="09/2023-Present" 
                        branch="main" 
                        role="Software Engineer" 
                        company="InfoIMAGE" 
                        desc="Data parsing, extraction, and multi-platform software optimization for fintech operations."
                        isCurrent
                    />
                    <GitCommit 
                        hash="9d11b5" 
                        date="05/2023-Present" 
                        branch="feature/ceo" 
                        role="CEO & Co-founder" 
                        company="SIMPLE PROCESS LLC" 
                        desc="Business process optimization, CRM integrations (HubSpot, Salesforce), and AI-driven sales engines."
                        isCurrent
                    />
                    <GitCommit 
                        hash="3c88a2" 
                        date="01/2022-09/2023" 
                        branch="main" 
                        role="QA Engineer" 
                        company="InfoIMAGE" 
                        desc="Automated test scripts with Python & Shell, Page Object pattern, REST API testing with Postman."
                    />
                    <GitCommit 
                        hash="a102bc" 
                        date="03/2017-12/2021" 
                        branch="master" 
                        role="Freelance Consultant" 
                        company="Remote" 
                        desc="Data parsing, extraction, and transformation. 20% operational efficiency improvement for clients."
                    />
                    <GitCommit 
                        hash="b5c9d1" 
                        date="05/2013-10/2015" 
                        branch="banking" 
                        role="Deputy Head" 
                        company="BPS-Sberbank" 
                        desc="Credit administration, operational risk management, BI reporting, and SLA compliance."
                    />
                    <GitCommit 
                        hash="c7a3e2" 
                        date="12/2010-04/2013" 
                        branch="banking" 
                        role="Head of Standards" 
                        company="BPS-Sberbank" 
                        desc="BPMN process optimization, TOF project coordination, KPI development."
                    />
                    <GitCommit 
                        hash="d8f4b3" 
                        date="12/2004-12/2010" 
                        branch="dev" 
                        role="Chief Engineer-Programmer" 
                        company="BPS-Sberbank" 
                        desc="Remote Banking Service development with JavaScript, HTML, CSS, Oracle, MS SQL Server."
                    />
                </div>
            </IDEPanel>
        </div>

      </div>
    </div>
  );
};
