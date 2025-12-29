import { useState, useEffect, useCallback } from 'react';

export interface BookmarkItem {
  id: string;
  type: 'hn' | 'github' | 'llm' | 'lesswrong';
  title: string;
  url: string;
  savedAt: string;
}

const STORAGE_KEY = 'kts-bookmarks';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load bookmarks:', e);
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks:', e);
    }
  }, [bookmarks]);

  const isBookmarked = useCallback((id: string) => {
    return bookmarks.some(b => b.id === id);
  }, [bookmarks]);

  const toggleBookmark = useCallback((item: Omit<BookmarkItem, 'savedAt'>) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === item.id);
      if (exists) {
        return prev.filter(b => b.id !== item.id);
      } else {
        return [...prev, { ...item, savedAt: new Date().toISOString() }];
      }
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, []);

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
  }, []);

  return {
    bookmarks,
    count: bookmarks.length,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearBookmarks,
  };
};
