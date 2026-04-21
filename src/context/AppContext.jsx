import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [lastVisited, setLastVisited] = useState(() => localStorage.getItem('lastPage') || '/');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(globalSearch), 300);
    return () => clearTimeout(timer);
  }, [globalSearch]);

  const updateLastVisited = useCallback((path) => {
    setLastVisited(path);
    localStorage.setItem('lastPage', path);
  }, []);

  return (
    <AppContext.Provider value={{
      darkMode, setDarkMode,
      sidebarOpen, setSidebarOpen,
      globalSearch, setGlobalSearch,
      debouncedSearch,
      lastVisited, updateLastVisited,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
