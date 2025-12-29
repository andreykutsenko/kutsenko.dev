import { useLocation, useNavigate } from 'react-router-dom';
import { FileJson, FileCode, FileText, X } from 'lucide-react';

// Tab configuration
const TABS = [
  { path: '/', label: 'hacker_news.ts', ext: 'ts' },
  { path: '/github', label: 'github.json', ext: 'json' },
  { path: '/llm', label: 'llm.py', ext: 'py' },
  { path: '/lesswrong', label: 'less_wrong.md', ext: 'md' },
  { path: '/about', label: 'about_me.md', ext: 'md' },
];

const getFileIcon = (ext: string, size = 12) => {
  switch (ext) {
    case 'json':
      return <FileJson size={size} className="text-term-orange" />;
    case 'ts':
    case 'tsx':
      return <FileCode size={size} className="text-term-blue" />;
    case 'py':
      return <FileCode size={size} className="text-term-purple" />;
    case 'md':
      return <FileText size={size} className="text-[#519aba]" />;
    default:
      return <FileText size={size} className="text-fg-dark-muted" />;
  }
};

interface EditorTabsProps {
  openTabs: string[];
  onCloseTab: (path: string) => void;
}

export const EditorTabs: React.FC<EditorTabsProps> = ({ openTabs, onCloseTab }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get tab info by path
  const getTabInfo = (path: string) => TABS.find(t => t.path === path) || TABS[0];

  return (
    <div className="flex items-end bg-slate-100 dark:bg-[#0d1117] border-b border-border-light dark:border-border-dark overflow-x-auto scrollbar-hide">
      {openTabs.map((tabPath) => {
        const tab = getTabInfo(tabPath);
        const isActive = location.pathname === tabPath;
        
        return (
          <div
            key={tabPath}
            className={`group flex items-center gap-2 px-3 py-2 cursor-pointer border-r border-border-light dark:border-border-dark transition-colors min-w-0 ${
              isActive
                ? 'bg-panel-light dark:bg-panel-dark text-fg-light dark:text-fg-dark border-t-2 border-t-accent -mb-px'
                : 'text-fg-dark-muted hover:bg-white/5 border-t-2 border-t-transparent'
            }`}
            onClick={() => navigate(tabPath)}
          >
            {getFileIcon(tab.ext)}
            <span className="text-[11px] font-mono truncate max-w-[100px]">{tab.label}</span>
            
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tabPath);
              }}
              className={`p-0.5 rounded hover:bg-white/10 transition-opacity ${
                isActive ? 'opacity-60 hover:opacity-100' : 'opacity-0 group-hover:opacity-60 hover:opacity-100'
              }`}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
      
      {/* Empty space filler */}
      <div className="flex-1 border-b border-transparent"></div>
    </div>
  );
};

export { TABS, getFileIcon };

