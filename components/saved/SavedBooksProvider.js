"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "bookverse:saved";
const SavedBooksContext = createContext(null);

export function SavedBooksProvider({ children }) {
  const [items, setItems] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {
        setItems({});
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const save = useCallback((book, status = "want") => {
    if (!book?.id) return;
    setItems((current) => ({
      ...current,
      [book.id]: {
        id: book.id,
        title: book.title,
        subtitle: book.subtitle || "",
        authors: book.authors || [],
        cover: book.cover || "",
        covers: book.covers || [],
        isbn10: book.isbn10 || "",
        isbn13: book.isbn13 || "",
        sources: book.sources || {},
        coverId: book.coverId || 0,
        coverEditionKey: book.coverEditionKey || "",
        archiveId: book.archiveId || "",
        gutenbergId: book.gutenbergId || "",
        firstPublishedYear: book.firstPublishedYear || null,
        availability: book.availability || null,
        status,
        savedAt: Date.now(),
      },
    }));
  }, []);

  const remove = useCallback((id) => {
    setItems((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

  const setStatus = useCallback((id, status) => {
    setItems((current) => {
      if (!current[id]) return current;
      return { ...current, [id]: { ...current[id], status } };
    });
  }, []);

  const value = useMemo(
    () => ({
      items,
      list: Object.values(items).sort((a, b) => b.savedAt - a.savedAt),
      ready,
      save,
      remove,
      setStatus,
      isSaved: (id) => Boolean(items[id]),
      getStatus: (id) => items[id]?.status || "",
      count: Object.keys(items).length,
    }),
    [items, ready, save, remove, setStatus]
  );

  return <SavedBooksContext.Provider value={value}>{children}</SavedBooksContext.Provider>;
}

export function useSavedBooks() {
  const context = useContext(SavedBooksContext);
  if (!context) {
    throw new Error("useSavedBooks must be used within SavedBooksProvider");
  }
  return context;
}
