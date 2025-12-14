import { NavLink } from 'react-router-dom';
import { Lang, Theme } from '../types';
import { SquareTerminal, ExternalLink } from 'lucide-react';

interface SidebarProps {
  theme: Theme;
  lang: Lang;
  t: (key: string) => string;
}

export const Sidebar: React.FC<SidebarProps> = ({ t }) => {
  return (
    <aside className="w-14 lg:w-60 border-r border-border-light dark:border-border-dark bg-panel-light dark:bg-bg-dark flex flex-col justify-between z-20 shadow-xl shadow-black/5 dark:shadow-none">
      
      {/* Identity Block */}
      <div className="h-16 flex items-center px-4 lg:px-6 border-b border-border-light dark:border-border-dark">
          <div className="hidden lg:flex items-center gap-2 font-bold text-sm tracking-tight text-fg-light dark:text-fg-dark">
             <span className="text-accent-light dark:text-accent">$</span>
             <span>root@kutsenko</span>
             <span className="animate-blink bg-fg-light dark:bg-accent w-2 h-4 block ml-1"></span>
          </div>
          <div className="lg:hidden w-full flex justify-center text-fg-light dark:text-fg-dark">
             <SquareTerminal size={22} />
          </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 flex flex-col gap-1 px-0 lg:px-0">
        <div className="px-4 lg:px-6 mb-2 hidden lg:block text-[10px] uppercase font-bold text-fg-dark-muted opacity-50 tracking-wider">
           Explorer
        </div>
        <NavItem to="/" label={t('nav.home')} shortcut="~/dash" />
        <NavItem to="/about" label={t('nav.about')} shortcut="~/profile" />
        
        <div className="my-6 border-t border-border-light dark:border-border-dark mx-4 opacity-50"></div>
        
        <div className="px-4 lg:px-6 mb-2 hidden lg:block text-[10px] uppercase font-bold text-fg-dark-muted opacity-50 tracking-wider">
           External
        </div>
        <a href="mailto:kutsenko@gmail.com" className="relative flex items-center justify-between px-4 lg:px-6 py-2 text-xs text-fg-dark-muted hover:text-fg-light dark:hover:text-fg-dark transition-colors group">
            <span className="hidden lg:block font-medium">{t('nav.contact')}</span>
            <ExternalLink size={14} className="opacity-50 group-hover:opacity-100" />
        </a>
      </nav>

      {/* Footer / System Status */}
      <div className="p-4 lg:p-6 border-t border-border-light dark:border-border-dark">
         <div className="flex items-center gap-2 text-[10px] text-fg-dark-muted font-mono opacity-80">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <div className="hidden lg:block">ONLINE :: 12ms</div>
         </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  label: string;
  shortcut: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, shortcut }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `relative flex items-center justify-between px-4 lg:px-6 py-2.5 transition-all text-xs font-medium group border-l-2 ${
        isActive 
          ? 'bg-slate-100 dark:bg-white/5 text-fg-light dark:text-fg-dark border-accent-light dark:border-accent' 
          : 'border-transparent text-slate-500 dark:text-fg-dark-muted hover:text-fg-light dark:hover:text-fg-dark hover:bg-slate-50 dark:hover:bg-white/[0.02]'
      }`
    }
  >
    <span className="hidden lg:block">{label}</span>
    <span className="lg:hidden text-center w-full">{shortcut.replace('~/', '')}</span>
    <span className="hidden lg:block opacity-30 font-mono text-[10px]">{shortcut}</span>
  </NavLink>
);
