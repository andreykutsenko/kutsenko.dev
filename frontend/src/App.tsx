import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import type { Theme, Lang } from './types';
import { I18N } from './constants';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage, DashboardPage, AgentsPage } from './pages';

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'dark';
  });
  
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('lang');
    return (saved as Lang) || 'en';
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'en' ? 'ru' : 'en');
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Translation helper
  const t = useCallback((key: string): string => {
    return I18N[lang]?.[key] || I18N['en']?.[key] || key;
  }, [lang]);

  return (
    <div className="app-shell">
      {/* Scanlines overlay for terminal effect */}
      <div className="scanlines" aria-hidden="true" />

      {/* Left Sidebar */}
      <Sidebar 
        theme={theme}
        lang={lang}
        t={t}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header Bar */}
        <Header
          theme={theme}
          lang={lang}
          t={t}
          onToggleTheme={toggleTheme}
          onToggleLang={toggleLang}
          onToggleSidebar={toggleSidebar}
        />

        {/* Page Content */}
        <div className="page-container">
          <Routes>
            <Route path="/" element={<HomePage lang={lang} t={t} />} />
            <Route path="/dashboard" element={<DashboardPage lang={lang} t={t} />} />
            <Route path="/agents" element={<AgentsPage lang={lang} t={t} />} />
            {/* TODO: Add more routes as needed (e.g., /about, individual agent pages) */}
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;

