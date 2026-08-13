"use client";

import { SavedBooksProvider } from "@/components/saved/SavedBooksProvider";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <SavedBooksProvider>{children}</SavedBooksProvider>
    </ThemeProvider>
  );
}
