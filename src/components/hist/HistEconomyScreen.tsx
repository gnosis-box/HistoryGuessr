// src/components/hist/HistEconomyScreen.tsx
import { useState, type ReactNode } from "react";
import { BuilderResourcesPanel } from "@/components/BuilderResourcesPanel";
import { CirclesSetupPanel } from "@/components/circles/CirclesSetupPanel";
import { HistCurrencyCard } from "@/components/circles/HistCurrencyCard";
import { histCurrencyContent } from "@/lib/circles/histCurrencyContent";
import { HistFlywheel } from "./HistFlywheel";

type EconomyTab = "learn" | "wallet" | "builder";

const tabs: { id: EconomyTab; label: string }[] = [
  { id: "learn", label: "How it works" },
  { id: "wallet", label: "Your HIST" },
  { id: "builder", label: "Builder" },
];

export function HistEconomyScreen() {
  const [tab, setTab] = useState<EconomyTab>("learn");

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-up pb-8">
      <header className="glass-card relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--gold)]/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--gold)]/40 bg-[var(--bg-card)] font-display text-xl font-bold text-[var(--gold-soft)]">
            {histCurrencyContent.symbol}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Circles economy
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-[var(--text-primary)]">
              {histCurrencyContent.name} currency
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)]">
              {histCurrencyContent.tagline}. Learn the loop, track your balance,
              or open builder tools.
            </p>
          </div>
        </div>
      </header>

      <nav
        className="flex gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-panel)]/80 p-1"
        aria-label="HIST sections"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition sm:text-sm ${
              tab === t.id
                ? "bg-[var(--gold)] text-[var(--bg-main)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "learn" && <LearnTab />}
      {tab === "wallet" && <WalletTab />}
      {tab === "builder" && <BuilderTab />}
    </div>
  );
}

function LearnTab() {
  const c = histCurrencyContent;

  return (
    <div className="space-y-6">
      <HistFlywheel />

      <ContentSection title={c.whatHistIs.title}>
        {c.whatHistIs.paragraphs.map((p) => (
          <p
            key={p.slice(0, 24)}
            className="text-sm leading-relaxed text-[var(--text-secondary)]"
          >
            {p}
          </p>
        ))}
      </ContentSection>

      <ContentSection title={c.givingHist.title}>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          {c.givingHist.intro}
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {c.givingHist.effects.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/40 px-4 py-3"
            >
              <p className="font-medium text-[var(--text-primary)]">
                {item.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </ContentSection>

      <ContentSection title={c.crcRelationship.title}>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          {c.crcRelationship.summary}
        </p>
        <ol className="mt-4 space-y-3">
          {c.crcRelationship.steps.map((step, i) => (
            <li key={step.label} className="flex gap-3 text-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--map-green)]/20 font-display text-xs font-semibold text-[var(--honor-soft)]">
                {i + 1}
              </span>
              <div>
                <p className="font-medium text-[var(--text-primary)]">
                  {step.label}
                </p>
                <p className="text-[var(--text-secondary)]">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-[var(--text-muted)]">
          {c.personalCrcNote}{" "}
          <a
            href={c.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--gold-soft)] underline"
          >
            Read Circles group currencies
          </a>
        </p>
      </ContentSection>

      <ContentSection title={c.limits.title}>
        <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--text-secondary)]">
          {c.limits.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ContentSection>
    </div>
  );
}

function WalletTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-secondary)]">
        Live balance from your sessions. Claim when connected in the Circles
        host and the on-chain group is configured on this deployment.
      </p>
      <HistCurrencyCard variant="wallet" />
    </div>
  );
}

function BuilderTab() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-dashed border-[var(--gold)]/30 bg-[var(--bg-card)]/30 px-5 py-4">
        <p className="text-sm text-[var(--text-secondary)]">
          {histCurrencyContent.builderIntro}
        </p>
      </section>
      <CirclesSetupPanel />
      <BuilderResourcesPanel />
    </div>
  );
}

function ContentSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="glass-card space-y-3 rounded-2xl p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-[var(--gold-soft)]">
        {title}
      </h2>
      {children}
    </section>
  );
}
