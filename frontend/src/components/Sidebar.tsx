import { NavLink } from 'react-router-dom';
import { Lang, Theme } from '../types';
import { FileJson, FileCode, FileText, ChevronRight, Folder, Github } from 'lucide-react';

interface SidebarProps {
  theme: Theme;
  lang: Lang;
  t: (key: string) => string;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <aside className="w-14 lg:w-64 border-r border-border-light dark:border-border-dark bg-slate-50 dark:bg-[#0d1117] flex flex-col justify-between z-20 transition-all">
      
      {/* Explorer Tree */}
      <nav className="flex-1 py-4 flex flex-col overflow-y-auto scrollbar-hide">
        <div className="px-4 mb-2 hidden lg:flex items-center gap-1 text-[10px] font-bold text-fg-dark-muted uppercase opacity-40">
           <ChevronRight size={12} className="rotate-90" />
           <span>Explorer</span>
        </div>
        
        {/* Project Folder */}
        <div className="hidden lg:flex items-center gap-2 px-6 py-1 text-[11px] font-bold text-fg-dark-muted/80">
            <Folder size={14} className="text-term-blue" />
            <span>src/web/pages</span>
        </div>

        <div className="flex flex-col gap-0.5 mt-1">
            <ExplorerItem to="/" icon={<FileCode size={14} className="text-term-purple" />} label="dashboard.tsx" />
            <ExplorerItem to="/about" icon={<FileJson size={14} className="text-term-orange" />} label="profile.json" />
        </div>

        <div className="my-6 border-t border-border-light dark:border-border-dark mx-4 opacity-50"></div>
        
        <div className="px-4 mb-2 hidden lg:block text-[10px] uppercase font-bold text-fg-dark-muted opacity-40 tracking-wider">
           Uplinks
        </div>
        <a href="mailto:kutsenko@gmail.com" className="flex items-center gap-3 px-6 py-2 text-[12px] text-fg-dark-muted hover:text-accent hover:bg-accent/5 transition-all">
            <FileText size={14} />
            <span className="hidden lg:block">contact.log</span>
        </a>
        <a href="https://github.com/andreykutsenko" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-2 text-[12px] text-fg-dark-muted hover:text-accent hover:bg-accent/5 transition-all">
            <Github size={14} />
            <span className="hidden lg:block">github.com</span>
        </a>
      </nav>

      {/* Footer System Status */}
      <div className="p-3 border-t border-border-light dark:border-border-dark bg-slate-100 dark:bg-black/20">
         <div className="flex items-center gap-3 text-[9px] text-fg-dark-muted font-mono">
            <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                <span className="hidden lg:block">LSP: ACTIVE</span>
            </div>
            <div className="hidden lg:block border-l border-white/10 pl-3">
                UTF-8
            </div>
         </div>
      </div>
    </aside>
  );
};

interface ExplorerItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const ExplorerItem: React.FC<ExplorerItemProps> = ({ to, icon, label }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `relative flex items-center gap-3 px-6 lg:pl-10 py-2 transition-all text-[12px] group ${
        isActive 
          ? 'bg-accent/10 text-fg-light dark:text-fg-dark border-r-2 border-accent' 
          : 'text-fg-dark-muted hover:bg-white/5 hover:text-fg-dark'
      }`
    }
  >
    <span className="shrink-0">{icon}</span>
    <span className="hidden lg:block flex-1 truncate">{label}</span>
  </NavLink>
);
