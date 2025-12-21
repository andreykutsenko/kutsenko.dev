import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Lang, Theme } from './types';
import { I18N } from './constants';
import { Sidebar } from './components/Sidebar';
import { TerminalSidebar } from './components/TerminalSidebar';
import { ViewToggle, ViewMode } from './components/ViewToggle';
import { Dashboard } from './pages/Dashboard';
import { TerminalDashboard } from './pages/TerminalDashboard';
import { TerminalAbout } from './pages/TerminalAbout';
import { About } from './pages/About';
import { Moon, Sun, Command, SquareTerminal } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'dark');
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'en');
  const [viewMode, setViewMode] = useState<ViewMode>(() => (localStorage.getItem('viewMode') as ViewMode) || 'ide');
  const [uptime, setUptime] = useState(0);

  // Uptime counter for Terminal mode
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(prev => prev === 'en' ? 'ru' : 'en');

  const t = (key: string) => I18N[lang][key] || key;

  // Format uptime
  const formatUptime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Terminal View
  if (viewMode === 'terminal') {
    return (
      <div className="flex flex-col h-screen w-full font-mono overflow-hidden transition-colors duration-200 bg-bg-light text-fg-light dark:bg-bg-dark dark:text-fg-dark-muted selection:bg-accent selection:text-black dark:selection:bg-accent dark:selection:text-black">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none bg-grid opacity-10 dark:opacity-5 z-0"></div>

        {/* Unified Top Bar - spans full width */}
        <header className="h-12 flex items-center justify-between px-4 border-b border-border-light dark:border-border-dark bg-panel-light dark:bg-[#0d1117] z-20 shrink-0">
          {/* Left: Logo/Identity */}
          <div className="flex items-center gap-3">
            <SquareTerminal size={16} className="text-accent" />
            <div className="flex items-center gap-1.5 font-mono text-xs text-fg-light dark:text-fg-dark">
              <span className="text-accent">$</span>
              <span className="opacity-70">root@kts</span>
              <span className="animate-blink text-accent">█</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-4 text-[10px] font-mono text-fg-dark-muted">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="opacity-60">{formatUptime(uptime)}</span>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <ViewToggle mode={viewMode} onChange={setViewMode} />
            <button 
              onClick={toggleLang}
              className="text-[10px] md:text-xs font-mono hover:text-accent-light dark:hover:text-accent transition-colors uppercase px-2 py-1 rounded hover:bg-white/5"
            >
              [{lang}]
            </button>
            <button 
              onClick={toggleTheme}
              className="hover:text-accent-light dark:hover:text-accent transition-colors p-1.5 rounded hover:bg-white/5"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
            </button>
          </div>
        </header>

        {/* Content Area: Sidebar + Main */}
        <div className="flex flex-1 overflow-hidden z-10">
          {/* Left Sidebar */}
          <TerminalSidebar theme={theme} lang={lang} t={t} />

          {/* Main Viewport */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <Routes>
              <Route path="/" element={<div className="p-4 md:p-8 max-w-7xl mx-auto"><TerminalDashboard lang={lang} t={t} /></div>} />
              <Route path="/about" element={<div className="p-4 md:p-8 max-w-5xl mx-auto"><TerminalAbout lang={lang} t={t} /></div>} />
            </Routes>
          </main>
        </div>
      </div>
    );
  }

  // IDE View
  return (
    <div className="flex flex-col h-screen w-full font-mono overflow-hidden transition-colors duration-200 bg-bg-light text-fg-light dark:bg-bg-dark dark:text-fg-dark-muted selection:bg-accent selection:text-black">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-grid opacity-10 dark:opacity-5 z-0"></div>

      {/* Unified Top Bar - spans full width */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-border-light dark:border-border-dark bg-panel-light dark:bg-[#0d1117] z-20 shrink-0">
        {/* Left: Logo/Identity */}
        <div className="flex items-center gap-3">
          <Command size={16} className="text-accent" />
          <span className="text-xs font-bold tracking-widest text-fg-dark-muted uppercase">kts</span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          <ViewToggle mode={viewMode} onChange={setViewMode} />
          <button 
            onClick={toggleLang}
            className="text-xs font-bold hover:text-accent-light dark:hover:text-accent transition-colors uppercase"
          >
            [{lang}]
          </button>
          <button 
            onClick={toggleTheme}
            className="text-xs font-bold hover:text-accent-light dark:hover:text-accent transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
      </header>

      {/* Content Area: Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden z-10">
        {/* Left Sidebar */}
        <Sidebar theme={theme} lang={lang} t={t} />

        {/* Main Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="/" element={<div className="p-4 md:p-8 max-w-7xl mx-auto"><Dashboard lang={lang} t={t} /></div>} />
            <Route path="/about" element={<div className="p-4 md:p-8 max-w-5xl mx-auto"><About lang={lang} t={t} /></div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
