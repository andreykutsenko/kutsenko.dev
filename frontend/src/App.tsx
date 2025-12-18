import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Lang, Theme } from './types';
import { I18N } from './constants';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';
import { Moon, Sun, Terminal, Wifi } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'dark');
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'en');
  const [uptime, setUptime] = useState(0);

  // Uptime counter
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

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(prev => prev === 'en' ? 'ru' : 'en');

  // Translation helper
  const t = (key: string) => I18N[lang][key] || key;

  // Format uptime
  const formatUptime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen w-full font-mono overflow-hidden transition-colors duration-200 bg-bg-light text-fg-light dark:bg-bg-dark dark:text-fg-dark-muted selection:bg-accent selection:text-black dark:selection:bg-accent dark:selection:text-black">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-grid opacity-10 dark:opacity-5 z-0"></div>

      {/* Scanlines effect (subtle) */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.02] dark:opacity-[0.03]" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px)'
      }}></div>

      {/* Left Sidebar */}
      <Sidebar theme={theme} lang={lang} t={t} />

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden z-10">
        
        {/* Terminal-style Header */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border-light dark:border-border-dark bg-bg-light/95 dark:bg-bg-dark/95 backdrop-blur-sm z-10 shrink-0">
           <div className="flex items-center gap-3 text-[10px] md:text-xs font-mono">
              {/* Status indicator */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <div className="w-2 h-2 bg-accent rounded-full absolute inset-0 animate-ping opacity-75"></div>
                </div>
                <span className="text-accent font-bold hidden sm:inline">ONLINE</span>
              </div>
              
              <span className="text-fg-dark-muted hidden md:inline">│</span>
              
              {/* Terminal prompt */}
              <div className="hidden md:flex items-center gap-1 text-fg-dark-muted">
                <Terminal size={12} />
                <span className="text-accent-light dark:text-accent">$</span>
                <span>kutsenko.dev</span>
                <span className="animate-blink">█</span>
              </div>
              
              <span className="text-fg-dark-muted hidden lg:inline">│</span>
              
              {/* Uptime */}
              <div className="hidden lg:flex items-center gap-1.5 text-fg-dark-muted">
                <Wifi size={10} />
                <span>uptime: {formatUptime(uptime)}</span>
              </div>
           </div>

           <div className="flex items-center gap-2 md:gap-4">
             <button 
                onClick={toggleLang}
                className="text-[10px] md:text-xs font-bold hover:text-accent-light dark:hover:text-accent transition-colors uppercase px-2 py-1 rounded hover:bg-white/5"
              >
                [{lang}]
              </button>
              <button 
                onClick={toggleTheme}
                className="text-[10px] md:text-xs font-bold hover:text-accent-light dark:hover:text-accent transition-colors p-1.5 rounded hover:bg-white/5"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              </button>
           </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-0">
           <Routes>
             <Route path="/" element={<div className="p-4 md:p-8 max-w-7xl mx-auto"><Dashboard lang={lang} t={t} /></div>} />
             <Route path="/about" element={<div className="p-4 md:p-8 max-w-5xl mx-auto"><About lang={lang} /></div>} />
           </Routes>
        </div>

      </main>
    </div>
  );
}

export default App;
