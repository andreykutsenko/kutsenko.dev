import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Terminal } from 'lucide-react';
import { BookmarkItem } from '../hooks/useBookmarks';

interface IntegratedTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkItem[];
}

interface TerminalLine {
  type: 'input' | 'output' | 'ascii' | 'error';
  content: string;
}

const ASCII_WELCOME = `
 ██╗  ██╗████████╗███████╗
 ██║ ██╔╝╚══██╔══╝██╔════╝
 █████╔╝    ██║   ███████╗
 ██╔═██╗    ██║   ╚════██║
 ██║  ██╗   ██║   ███████║
 ╚═╝  ╚═╝   ╚═╝   ╚══════╝
`;

const ABOUT_TEXT = `
┌─────────────────────────────────────────────────────────────┐
│  Andrey Kutsenko                                            │
│  Software engineer building automation tools and AI agents. │
│  Location: Tashkent, Uzbekistan                             │
│                                                             │
│  Expertise: Python, TypeScript, Infrastructure, LLMs       │
│  Focus: AI agents, automation, data pipelines              │
│                                                             │
│  linkedin.com/in/andreykutsenko | kutsenko@gmail.com        │
└─────────────────────────────────────────────────────────────┘
`;

const HELP_TEXT = `
Available commands:
  help       Show this help message
  ls         List available sections
  about      Display information about me
  bookmarks  Show saved bookmarks
  clear      Clear terminal history
  exit       Close terminal (or press Esc)
  gui        Close terminal and return to IDE
`;

const LS_OUTPUT = `
drwxr-xr-x  dashboard/
  -rw-r--r--  hacker_news.ts
  -rw-r--r--  github.json
  -rw-r--r--  llm.py
  -rw-r--r--  less_wrong.md
-rw-r--r--  bookmarks.md
-rw-r--r--  about_me.md
`;

export const IntegratedTerminal: React.FC<IntegratedTerminalProps> = ({ isOpen, onClose, bookmarks }) => {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Show welcome message on first open
  useEffect(() => {
    if (isOpen && !hasShownWelcome) {
      setHistory([
        { type: 'ascii', content: ASCII_WELCOME },
        { type: 'output', content: "Welcome to the system. Type 'help' for commands." },
        { type: 'output', content: '' },
      ]);
      setHasShownWelcome(true);
    }
  }, [isOpen, hasShownWelcome]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    
    const newHistory: TerminalLine[] = [
      ...history,
      { type: 'input', content: `guest@kutsenko.dev:~$ ${cmd}` },
    ];

    switch (trimmed) {
      case 'help':
        newHistory.push({ type: 'output', content: HELP_TEXT });
        break;
      
      case 'ls':
        newHistory.push({ type: 'output', content: LS_OUTPUT });
        break;
      
      case 'about':
        newHistory.push({ type: 'output', content: ABOUT_TEXT });
        break;
      
      case 'bookmarks':
        if (bookmarks.length === 0) {
          newHistory.push({ type: 'output', content: '\nNo bookmarks saved. Star items in the dashboard to save them.\n' });
        } else {
          const bookmarksList = bookmarks.map((b, i) => 
            `  ${i + 1}. [${b.type.toUpperCase()}] ${b.title}`
          ).join('\n');
          newHistory.push({ type: 'output', content: `\nSaved bookmarks (${bookmarks.length}):\n${bookmarksList}\n` });
        }
        break;
      
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      
      case 'exit':
      case 'gui':
        onClose();
        return;
      
      case '':
        break;
      
      default:
        newHistory.push({ type: 'error', content: `Command not found: ${cmd}. Type 'help' for available commands.` });
    }

    setHistory(newHistory);
    setInput('');
  }, [history, bookmarks, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(input);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ height: '40vh', minHeight: '250px' }}
    >
      {/* Terminal Header */}
      <div className="h-8 flex items-center justify-between px-3 bg-[#1a1a2e] border-t border-b border-accent/30">
        <div className="flex items-center gap-2 text-[11px] text-fg-dark-muted font-mono">
          <Terminal size={12} className="text-accent" />
          <span className="text-accent">TERMINAL</span>
          <span className="opacity-50">— bash</span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 text-fg-dark-muted hover:text-accent hover:bg-white/5 rounded transition-colors"
          title="Close terminal (Esc)"
        >
          <X size={14} />
        </button>
      </div>

      {/* Terminal Body */}
      <div 
        ref={terminalRef}
        className="h-[calc(100%-2rem)] bg-[#0d0d1a] overflow-y-auto p-4 font-mono text-[12px] leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {/* History */}
        {history.map((line, i) => (
          <div 
            key={i} 
            className={`whitespace-pre-wrap ${
              line.type === 'input' ? 'text-accent' : 
              line.type === 'error' ? 'text-red-400' :
              line.type === 'ascii' ? 'text-term-green' :
              'text-fg-dark-muted'
            }`}
          >
            {line.content}
          </div>
        ))}

        {/* Input Line */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-term-green shrink-0">guest@kutsenko.dev:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-fg-dark font-mono text-[12px] caret-accent"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="animate-blink text-accent">█</span>
        </div>
      </div>
    </div>
  );
};
