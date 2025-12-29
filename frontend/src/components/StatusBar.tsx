import { GitBranch, AlertCircle, CheckCircle, RefreshCw, Clock, Bookmark } from 'lucide-react';
import { getLanguageFromFile } from './Sidebar';

interface StatusBarProps {
  currentPath: string;
  lastSync: string | null;
  isRefreshing: boolean;
  onRefresh: () => void;
  savedCount?: number;
  errors?: number;
  warnings?: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  currentPath,
  lastSync,
  isRefreshing,
  onRefresh,
  savedCount = 0,
  errors = 0,
  warnings = 0,
}) => {
  const language = getLanguageFromFile(currentPath);
  
  return (
    <footer className="h-6 flex items-center justify-between px-3 bg-accent dark:bg-[#007acc] text-white text-[11px] font-mono z-30 shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Git Branch */}
        <div className="flex items-center gap-1.5 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default">
          <GitBranch size={12} />
          <span>main</span>
        </div>
        
        {/* Errors/Warnings */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default">
            <AlertCircle size={11} />
            <span>{errors}</span>
          </span>
          <span className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default">
            <CheckCircle size={11} />
            <span>{warnings}</span>
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Saved Count */}
        <div className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded cursor-default ${
          savedCount > 0 ? 'bg-white/10' : 'opacity-60'
        }`}>
          <Bookmark size={10} fill={savedCount > 0 ? 'currentColor' : 'none'} />
          <span>Saved: {savedCount}</span>
        </div>

        {/* Separator */}
        <div className="h-3 w-px bg-white/20"></div>

        {/* Last Sync */}
        {lastSync && (
          <div className="hidden sm:flex items-center gap-1.5 opacity-80">
            <Clock size={10} />
            <span>synced: {lastSync}</span>
          </div>
        )}

        {/* Refresh Button */}
        <button 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 hover:bg-white/10 px-2 py-0.5 rounded transition-colors disabled:opacity-50"
          title="Refresh data"
        >
          <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Separator */}
        <div className="h-3 w-px bg-white/20"></div>

        {/* Encoding */}
        <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default hidden md:inline">
          UTF-8
        </span>
        
        {/* Language */}
        <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-default">
          {language}
        </span>
      </div>
    </footer>
  );
};
