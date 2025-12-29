import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Lang, Theme } from './types';
import { I18N } from './constants';
import { Sidebar } from './components/Sidebar';
import { EditorTabs } from './components/EditorTabs';
import { StatusBar } from './components/StatusBar';
import { IntegratedTerminal } from './components/IntegratedTerminal';
import { HackerNewsView, GithubView, LLMView, LessWrongView } from './pages/Dashboard';
import { About } from './pages/About';
import { BookmarksView } from './pages/BookmarksView';
import { useBookmarks } from './hooks/useBookmarks';
import { Moon, Sun, Command } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'dark');
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'en');
  const [openTabs, setOpenTabs] = useState<string[]>(['/']);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Bookmarks system
  const { bookmarks, count: savedCount, isBookmarked, toggleBookmark, removeBookmark } = useBookmarks();

  // Hotkey for terminal (~ / backtick)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Allow Escape to close terminal even when in input
        if (e.key === 'Escape' && isTerminalOpen) {
          setIsTerminalOpen(false);
          e.preventDefault();
        }
        return;
      }

      // Toggle terminal with ~ or ` key
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
      
      // Close terminal with Escape
      if (e.key === 'Escape' && isTerminalOpen) {
        e.preventDefault();
        setIsTerminalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTerminalOpen]);

  // Add current path to open tabs if not already there
  useEffect(() => {
    setOpenTabs(prev => {
      if (prev.includes(location.pathname)) return prev;
      return [...prev, location.pathname];
    });
  }, [location.pathname]);

  // Handle tab close
  const handleCloseTab = useCallback((path: string) => {
    const newTabs = openTabs.filter(t => t !== path);
    if (newTabs.length === 0) {
      newTabs.push('/');
    }
    setOpenTabs(newTabs);
    
    // If closing current tab, navigate to last tab
    if (location.pathname === path) {
      navigate(newTabs[newTabs.length - 1]);
    }
  }, [openTabs, location.pathname, navigate]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsRefreshing(false);
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

  const t = (key: string) => I18N[lang][key] || key;

  return (
    <div className="flex flex-col h-screen w-full font-mono overflow-hidden transition-colors duration-200 bg-bg-light text-fg-light dark:bg-bg-dark dark:text-fg-dark-muted selection:bg-accent selection:text-black">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-grid opacity-10 dark:opacity-5 z-0"></div>

      {/* Unified Top Bar */}
      <header className="h-10 flex items-center justify-between px-4 border-b border-border-light dark:border-border-dark bg-panel-light dark:bg-[#0d1117] z-20 shrink-0">
        {/* Left: Logo/Identity */}
        <div className="flex items-center gap-3">
          <Command size={14} className="text-accent" />
          <span className="text-[11px] font-bold tracking-widest text-fg-dark-muted uppercase">kts</span>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          {/* Terminal hint */}
          <span className="text-[9px] text-fg-dark-muted opacity-50 hidden md:block font-mono">
            Press <kbd className="px-1 py-0.5 bg-black/20 rounded text-accent">`</kbd> for terminal
          </span>
          <button 
            onClick={toggleLang}
            className="text-[10px] font-bold hover:text-accent-light dark:hover:text-accent transition-colors uppercase"
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

      {/* Content Area: Sidebar + Editor */}
      <div className="flex flex-1 overflow-hidden z-10">
        {/* Left Sidebar - File Explorer */}
        <Sidebar theme={theme} lang={lang} t={t} />

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Editor Tabs */}
          <EditorTabs openTabs={openTabs} onCloseTab={handleCloseTab} />

          {/* Editor Content */}
          <main className={`flex-1 overflow-y-auto overflow-x-hidden bg-panel-light dark:bg-panel-dark transition-all ${
            isTerminalOpen ? 'pb-[40vh]' : ''
          }`}>
            <Routes>
              <Route path="/" element={
                <div className="p-4 md:p-6">
                  <HackerNewsView lang={lang} t={t} refreshTrigger={refreshTrigger} onSyncUpdate={setLastSync} isBookmarked={isBookmarked} toggleBookmark={toggleBookmark} />
                </div>
              } />
              <Route path="/github" element={
                <div className="p-4 md:p-6">
                  <GithubView lang={lang} t={t} refreshTrigger={refreshTrigger} onSyncUpdate={setLastSync} isBookmarked={isBookmarked} toggleBookmark={toggleBookmark} />
                </div>
              } />
              <Route path="/llm" element={
                <div className="p-4 md:p-6">
                  <LLMView lang={lang} t={t} refreshTrigger={refreshTrigger} onSyncUpdate={setLastSync} isBookmarked={isBookmarked} toggleBookmark={toggleBookmark} />
                </div>
              } />
              <Route path="/lesswrong" element={
                <div className="p-4 md:p-6">
                  <LessWrongView lang={lang} t={t} refreshTrigger={refreshTrigger} onSyncUpdate={setLastSync} isBookmarked={isBookmarked} toggleBookmark={toggleBookmark} />
                </div>
              } />
              <Route path="/bookmarks" element={
                <div className="p-4 md:p-6">
                  <BookmarksView bookmarks={bookmarks} removeBookmark={removeBookmark} />
                </div>
              } />
              <Route path="/about" element={
                <div className="p-4 md:p-8 max-w-5xl mx-auto">
                  <About lang={lang} t={t} />
                </div>
              } />
            </Routes>
          </main>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar 
        currentPath={location.pathname}
        lastSync={lastSync}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        savedCount={savedCount}
      />

      {/* Integrated Terminal (Easter Egg) */}
      <IntegratedTerminal 
        isOpen={isTerminalOpen} 
        onClose={() => setIsTerminalOpen(false)}
        bookmarks={bookmarks}
      />
    </div>
  );
}

export default App;
