import type { ReactNode } from "react";
import { Header } from "./Header";
import { NavBar } from "./NavBar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <NavBar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
      <footer className="border-t border-[var(--border-subtle)] px-4 py-4 text-center text-xs text-[var(--text-muted)]">
        History Guessr · Circles miniapp
      </footer>
    </div>
  );
}
