import { useState, useEffect } from 'react';

export interface SearchHistoryItem {
  username: string;
  avatar?: string;
  lastSearched: string;
}

const STORAGE_KEY = 'leetcode-search-history';
const MAX_HISTORY = 5;

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
  }, []);

  const addToHistory = (username: string, avatar?: string) => {
    const normalizedUsername = username.toLowerCase();
    
    setHistory((prev) => {
      // Remove existing entry if present
      const filtered = prev.filter(
        (item) => item.username.toLowerCase() !== normalizedUsername
      );
      
      // Add to front
      const newHistory = [
        { username, avatar, lastSearched: new Date().toISOString() },
        ...filtered,
      ].slice(0, MAX_HISTORY);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  const removeFromHistory = (username: string) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => item.username.toLowerCase() !== username.toLowerCase()
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return filtered;
    });
  };

  return { history, addToHistory, clearHistory, removeFromHistory };
};
