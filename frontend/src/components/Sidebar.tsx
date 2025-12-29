import { NavLink, useLocation } from 'react-router-dom';
import { Lang, Theme } from '../types';
import { 
  FileJson, 
  FileCode, 
  FileText, 
  ChevronRight, 
  ChevronDown,
  Folder, 
  FolderOpen,
  Files,
  Search,
  GitBranch,
  Settings,
  Bookmark,
  Zap,
  Trophy,
  FlaskConical,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  theme: Theme;
  lang: Lang;
  t: (key: string) => string;
}

// File type icons based on extension
const getFileIcon = (ext: string) => {
  switch (ext) {
    case 'json':
      return <FileJson size={14} className="text-term-orange" />;
    case 'ts':
    case 'tsx':
      return <FileCode size={14} className="text-term-blue" />;
    case 'py':
      return <FileCode size={14} className="text-term-purple" />;
    case 'md':
      return <FileText size={14} className="text-[#519aba]" />;
    default:
      return <FileText size={14} className="text-fg-dark-muted" />;
  }
};

// Get "language" for status bar based on file
export const getLanguageFromFile = (pathname: string) => {
  if (pathname === '/') return 'TypeScript React';
  if (pathname === '/github') return 'JSON';
  if (pathname === '/llm') return 'Python';
  if (pathname === '/hn') return 'TypeScript';
  if (pathname === '/lesswrong') return 'Markdown';
  if (pathname === '/about') return 'Markdown';
  if (pathname === '/bookmarks') return 'Markdown';
  return 'Plain Text';
};

export const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const [dashboardOpen, setDashboardOpen] = useState(true);

  return (
    <aside className="w-12 md:w-14 lg:w-64 border-r border-border-light dark:border-border-dark bg-slate-50 dark:bg-[#0d1117] flex flex-col z-20 transition-all">
      
      {/* Activity Bar (VS Code left icons) - hidden on large, shown on mobile */}
      <div className="lg:hidden flex flex-col items-center py-3 gap-4 border-b border-border-light dark:border-border-dark">
        <button className="p-2 text-fg-dark-muted hover:text-accent transition-colors">
          <Files size={20} />
        </button>
        <button className="p-2 text-fg-dark-muted hover:text-accent transition-colors opacity-40">
          <Search size={20} />
        </button>
        <button className="p-2 text-fg-dark-muted hover:text-accent transition-colors opacity-40">
          <GitBranch size={20} />
        </button>
      </div>

      {/* Explorer Header */}
      <div className="hidden lg:flex items-center justify-between px-4 py-2 border-b border-border-light dark:border-border-dark">
        <span className="text-[10px] font-bold text-fg-dark-muted uppercase tracking-widest">Explorer</span>
        <button className="text-fg-dark-muted hover:text-accent transition-colors opacity-50 hover:opacity-100">
          <Settings size={12} />
        </button>
      </div>
      
      {/* File Tree */}
      <nav className="flex-1 py-2 flex flex-col overflow-y-auto scrollbar-hide">
        
        {/* Project Root */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold text-fg-dark-muted hover:bg-white/5 cursor-pointer select-none"
             onClick={() => setDashboardOpen(!dashboardOpen)}>
          {dashboardOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {dashboardOpen ? <FolderOpen size={14} className="text-term-blue" /> : <Folder size={14} className="text-term-blue" />}
          <span>kts-workspace</span>
        </div>

        {/* Dashboard folder */}
        {dashboardOpen && (
          <div className="lg:ml-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 text-[11px] text-fg-dark-muted">
              <ChevronDown size={10} className="opacity-50" />
              <Folder size={12} className="text-term-orange opacity-70" />
              <span className="opacity-60">dashboard</span>
            </div>

            <div className="lg:ml-4">
              <FileItem 
                to="/" 
                icon={getFileIcon('ts')} 
                label="hacker_news.ts" 
                isActive={location.pathname === '/' || location.pathname === '/hn'}
              />
              <FileItem 
                to="/github" 
                icon={getFileIcon('json')} 
                label="github.json" 
                isActive={location.pathname === '/github'}
              />
              <FileItem 
                to="/llm" 
                icon={getFileIcon('py')} 
                label="llm.py" 
                isActive={location.pathname === '/llm'}
              />
              <FileItem 
                to="/lesswrong" 
                icon={getFileIcon('md')} 
                label="less_wrong.md" 
                isActive={location.pathname === '/lesswrong'}
              />
            </div>
          </div>
        )}

        {/* AI Signals folder */}
        {dashboardOpen && (
          <div className="lg:ml-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 text-[11px] text-fg-dark-muted">
              <ChevronDown size={10} className="opacity-50" />
              <Folder size={12} className="text-accent opacity-70" />
              <span className="opacity-60">ai_signals</span>
            </div>

            <div className="lg:ml-4">
              <FileItem 
                to="/arena" 
                icon={<Trophy size={14} className="text-term-orange" />} 
                label="lmsys_arena.json" 
                isActive={location.pathname === '/arena'}
              />
              <FileItem 
                to="/papers" 
                icon={<FlaskConical size={14} className="text-term-purple" />} 
                label="papers.py" 
                isActive={location.pathname === '/papers'}
              />
              <FileItem 
                to="/tool" 
                icon={<Zap size={14} className="text-accent" />} 
                label="tool_of_day.md" 
                isActive={location.pathname === '/tool'}
              />
              <FileItem 
                to="/prices" 
                icon={<DollarSign size={14} className="text-term-green" />} 
                label="token_prices.json" 
                isActive={location.pathname === '/prices'}
              />
            </div>
          </div>
        )}

        <div className="hidden lg:block my-3 border-t border-border-light dark:border-border-dark mx-3 opacity-30"></div>

        {/* Root level files */}
        <div className={dashboardOpen ? 'lg:ml-4' : ''}>
          <FileItem 
            to="/bookmarks" 
            icon={<Bookmark size={14} className="text-term-orange" />} 
            label="bookmarks.md" 
            isActive={location.pathname === '/bookmarks'}
          />
          <FileItem 
            to="/about" 
            icon={getFileIcon('md')} 
            label="about_me.md" 
            isActive={location.pathname === '/about'}
          />
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="hidden lg:block p-2 border-t border-border-light dark:border-border-dark bg-slate-100 dark:bg-black/20">
        <div className="flex items-center gap-2 text-[9px] text-fg-dark-muted font-mono px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
          <span>LSP Ready</span>
        </div>
      </div>
    </aside>
  );
};

interface FileItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const FileItem: React.FC<FileItemProps> = ({ to, icon, label, isActive }) => (
  <NavLink 
    to={to} 
    className={`relative flex items-center gap-2 px-3 lg:px-4 py-1.5 transition-all text-[11px] group ${
      isActive 
        ? 'bg-accent/10 text-fg-light dark:text-fg-dark' 
        : 'text-fg-dark-muted hover:bg-white/5 hover:text-fg-dark'
    }`}
  >
    {/* Active indicator */}
    {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent"></div>}
    
    <span className="shrink-0">{icon}</span>
    <span className="hidden lg:block flex-1 truncate font-mono">{label}</span>
  </NavLink>
);
