import { Monitor, Terminal } from 'lucide-react';

export type ViewMode = 'ide' | 'terminal';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ mode, onChange }) => {
  return (
    <div className="flex items-center gap-0.5 p-0.5 border border-border-light dark:border-border-dark rounded-full bg-black/5 dark:bg-white/5">
      <button
        onClick={() => onChange('ide')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
          mode === 'ide'
            ? 'bg-accent text-black shadow-sm'
            : 'text-fg-dark-muted hover:text-fg-light dark:hover:text-fg-dark'
        }`}
        title="IDE View"
      >
        <Monitor size={11} />
        <span className="hidden sm:inline">IDE</span>
      </button>
      <button
        onClick={() => onChange('terminal')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
          mode === 'terminal'
            ? 'bg-accent text-black shadow-sm'
            : 'text-fg-dark-muted hover:text-fg-light dark:hover:text-fg-dark'
        }`}
        title="Terminal View"
      >
        <Terminal size={11} />
        <span className="hidden sm:inline">Terminal</span>
      </button>
    </div>
  );
};
