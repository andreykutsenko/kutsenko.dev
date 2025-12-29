import { Trash2, ExternalLink, Star, FileText, Bookmark } from 'lucide-react';
import { BookmarkItem } from '../hooks/useBookmarks';

interface BookmarksViewProps {
  bookmarks: BookmarkItem[];
  removeBookmark: (id: string) => void;
}

// Get category color
const getCategoryColor = (type: BookmarkItem['type']) => {
  switch (type) {
    case 'hn': return 'text-term-orange';
    case 'github': return 'text-term-blue';
    case 'llm': return 'text-term-purple';
    case 'lesswrong': return 'text-[#519aba]';
    default: return 'text-fg-dark-muted';
  }
};

// Get category label
const getCategoryLabel = (type: BookmarkItem['type']) => {
  switch (type) {
    case 'hn': return 'Hacker News';
    case 'github': return 'GitHub';
    case 'llm': return 'LLM News';
    case 'lesswrong': return 'LessWrong';
    default: return 'Other';
  }
};

// Format saved date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMin < 1) return 'just now';
  if (diffMin === 1) return '1 min ago';
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'yesterday';
  return `${diffDays} days ago`;
};

// Empty State Component
const EmptyState: React.FC = () => (
  <div className="h-[60vh] flex flex-col items-center justify-center text-fg-dark-muted">
    <div className="relative mb-8">
      {/* ASCII Art File */}
      <pre className="text-[10px] opacity-30 font-mono leading-tight">
{`     ┌─────────────────┐
     │  ☆  ☆  ☆  ☆  ☆ │
     │                 │
     │    (empty)      │
     │                 │
     │  ☆  ☆  ☆  ☆  ☆ │
     └─────────────────┘`}
      </pre>
      <FileText size={48} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
    </div>
    
    <div className="text-center max-w-md px-4">
      <h3 className="text-lg font-bold text-fg-light dark:text-fg-dark mb-2">
        No bookmarks found
      </h3>
      <p className="text-sm opacity-60 mb-6">
        Start by starring some items in the dashboard!
      </p>
      
      <div className="flex items-center justify-center gap-2 text-xs opacity-40">
        <span>Click the</span>
        <Star size={14} className="text-term-orange" />
        <span>icon on any item to save it here</span>
      </div>
    </div>
  </div>
);

export const BookmarksView: React.FC<BookmarksViewProps> = ({ bookmarks, removeBookmark }) => {
  if (bookmarks.length === 0) {
    return <EmptyState />;
  }

  // Group bookmarks by type
  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
    if (!acc[bookmark.type]) {
      acc[bookmark.type] = [];
    }
    acc[bookmark.type].push(bookmark);
    return acc;
  }, {} as Record<BookmarkItem['type'], BookmarkItem[]>);

  return (
    <div className="max-w-4xl">
      {/* File header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-fg-dark-muted opacity-50 text-xs font-mono">
          <span className="text-term-orange"># bookmarks.md</span> - Your saved items ({bookmarks.length})
        </div>
      </div>

      {/* Markdown-style header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bookmark size={20} className="text-term-orange" />
          <h1 className="text-xl font-bold text-fg-light dark:text-fg-dark">
            Bookmarks
          </h1>
        </div>
        <p className="text-sm text-fg-dark-muted opacity-70 border-l-2 border-accent/30 pl-4">
          Items you've starred for later. Click the trash icon to remove.
        </p>
      </div>

      {/* Bookmarks grouped by type */}
      <div className="space-y-8">
        {Object.entries(groupedBookmarks).map(([type, items]) => (
          <div key={type}>
            {/* Section header */}
            <div className={`text-sm font-bold mb-3 flex items-center gap-2 ${getCategoryColor(type as BookmarkItem['type'])}`}>
              <span>## {getCategoryLabel(type as BookmarkItem['type'])}</span>
              <span className="text-xs opacity-50">({items.length})</span>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {items.map((bookmark) => (
                <div 
                  key={bookmark.id}
                  className="group flex items-start gap-3 p-3 border border-border-light dark:border-border-dark rounded-lg hover:border-accent/40 transition-all bg-slate-50 dark:bg-white/[0.02]"
                >
                  {/* Star icon */}
                  <Star size={14} className="text-term-orange shrink-0 mt-0.5" fill="currentColor" />
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <a 
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fg-light dark:text-fg-dark hover:text-accent transition-colors font-medium text-sm block truncate"
                    >
                      {bookmark.title}
                      <ExternalLink size={10} className="inline ml-2 opacity-0 group-hover:opacity-50" />
                    </a>
                    {bookmark.description && (
                      <div className="text-[11px] text-fg-dark-muted mt-1 leading-snug line-clamp-2">
                        {bookmark.description}
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-fg-dark-muted">
                      <span className={getCategoryColor(bookmark.type)}>
                        {getCategoryLabel(bookmark.type)}
                      </span>
                      <span className="opacity-40">•</span>
                      <span className="opacity-60">saved {formatDate(bookmark.savedAt)}</span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="p-1.5 text-fg-dark-muted opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                    title="Remove bookmark"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer stats */}
      <div className="mt-8 pt-6 border-t border-border-light dark:border-border-dark">
        <div className="text-[10px] text-fg-dark-muted opacity-50 font-mono">
          ---<br />
          Total: {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''} | 
          Last updated: {bookmarks.length > 0 ? formatDate(bookmarks[bookmarks.length - 1].savedAt) : 'never'}
        </div>
      </div>
    </div>
  );
};
