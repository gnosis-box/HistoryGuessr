import type { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
      <footer className="border-t border-white/5 px-4 py-4 text-center text-xs text-[var(--text-secondary)]">
        History Guessr · Front-only MVP · Circles integration prepared in{" "}
        <code className="text-[var(--accent-soft)]">src/lib/circles</code>
      </footer>
    </div>
  );
}
