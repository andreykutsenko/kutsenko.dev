import { Moon, Sun, Globe, Menu } from 'lucide-react';
import type { Theme, Lang } from '../types';
import './Header.css';

interface HeaderProps {
  theme: Theme;
  lang: Lang;
  t: (key: string) => string;
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onToggleSidebar: () => void;
}

export function Header({ 
  theme, 
  lang, 
  t, 
  onToggleTheme, 
  onToggleLang,
  onToggleSidebar 
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        {/* Mobile menu button */}
        <button 
          className="header-menu-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        {/* Status indicator */}
        <div className="status-line">
          <span className="status-pill">
            <span className="status-dot" />
            <span>{t('status.online')}</span>
          </span>
          <span className="build-id">SYS.VER.2025.12.08A</span>
        </div>
      </div>

      <div className="header-controls">
        {/* Language toggle */}
        <button 
          className="chip"
          onClick={onToggleLang}
          aria-label="Toggle language"
        >
          <Globe size={14} />
          <span>{lang.toUpperCase()}</span>
        </button>
        
        {/* Theme toggle */}
        <button 
          className="chip"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
          <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </header>
  );
}

