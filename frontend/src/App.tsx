import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Lang, Theme } from './types';
import { I18N } from './constants';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';
import { Moon, Sun, Command } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'dark');
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'en');

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

  return (
    <div className="flex h-screen w-full font-mono overflow-hidden transition-colors duration-200 bg-bg-light text-fg-light dark:bg-bg-dark dark:text-fg-dark-muted selection:bg-accent selection:text-black dark:selection:bg-accent dark:selection:text-black">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-grid opacity-10 dark:opacity-5 z-0"></div>

      {/* Left Sidebar */}
      <Sidebar theme={theme} lang={lang} t={t} />

      {/* Main Viewport */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden z-10">
        
        {/* Minimal Status Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border-light dark:border-border-dark bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-sm z-10 shrink-0">
           <div className="flex items-center gap-2 text-xs font-bold tracking-widest opacity-60">
              <Command size={14} />
              <span>KUTSENKO.DEV</span>
           </div>

           <div className="flex items-center gap-4">
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
