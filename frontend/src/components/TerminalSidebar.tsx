import { NavLink } from 'react-router-dom';
import { Lang, Theme } from '../types';
import { Home, User, Mail } from 'lucide-react';

interface TerminalSidebarProps {
  theme: Theme;
  lang: Lang;
  t: (key: string) => string;
}

export const TerminalSidebar: React.FC<TerminalSidebarProps> = ({ t }) => {
  return (
    <aside className="w-14 lg:w-56 border-r border-border-light dark:border-border-dark bg-panel-light dark:bg-bg-dark flex flex-col justify-between z-20 shadow-xl shadow-black/5 dark:shadow-none">
      
      {/* Navigation */}
      <nav className="flex-1 py-4 flex flex-col">
        {/* Section header */}
        <div className="px-3 lg:px-4 mb-2 hidden lg:block text-[9px] uppercase font-mono text-fg-dark-muted/50 tracking-wider">
           drwxr-xr-x ./
        </div>
        
        <TerminalNavItem to="/" label={t('nav.home')} icon={<Home size={16} />} shortLabel="~" />
        <TerminalNavItem to="/about" label={t('nav.about')} icon={<User size={16} />} shortLabel="?" />
        
        <div className="my-4 border-t border-border-light dark:border-border-dark mx-3 lg:mx-4 opacity-30"></div>
        
        {/* External links header */}
        <div className="px-3 lg:px-4 mb-2 hidden lg:block text-[9px] uppercase font-mono text-fg-dark-muted/50 tracking-wider">
           lrwxr-xr-x @
        </div>
        
        <a 
          href="mailto:kutsenko@gmail.com" 
          className="flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-2.5 text-xs text-fg-dark-muted hover:text-accent-light dark:hover:text-accent transition-colors group"
        >
          <Mail size={16} />
          <span className="hidden lg:block font-mono">{t('nav.contact')}</span>
        </a>
      </nav>

      {/* Footer */}
      <div className="p-3 lg:p-4 border-t border-border-light dark:border-border-dark">
         <div className="flex items-center justify-center lg:justify-start text-[9px] text-fg-dark-muted/40 font-mono">
            <span className="hidden lg:block">v1.0</span>
         </div>
      </div>
    </aside>
  );
};

interface TerminalNavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  shortLabel: string;
}

const TerminalNavItem: React.FC<TerminalNavItemProps> = ({ to, label, icon, shortLabel }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-2.5 transition-all text-xs font-mono group ${
        isActive 
          ? 'text-accent-light dark:text-accent bg-accent/5' 
          : 'text-fg-dark-muted hover:text-fg-light dark:hover:text-fg-dark hover:bg-white/5'
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span className="lg:hidden">{icon}</span>
        <span className="hidden lg:flex items-center gap-2">
          <span className={isActive ? 'text-accent' : 'text-fg-dark-muted/50'}>{'>'}</span>
          <span>{label}</span>
        </span>
        <span className="hidden lg:block ml-auto text-[10px] opacity-30">{shortLabel}</span>
      </>
    )}
  </NavLink>
);
