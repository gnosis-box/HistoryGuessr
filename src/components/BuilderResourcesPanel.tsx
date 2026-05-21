const resources = [
  {
    label: "Garage — submit mini-app",
    href: "https://garage.aboutcircles.com/register",
  },
  {
    label: "Circles playground (test iframe)",
    href: "https://circles.gnosis.io/playground",
  },
  {
    label: "SDK on npm",
    href: "https://www.npmjs.com/package/@aboutcircles/sdk",
  },
  {
    label: "RPC Query Builder — search profiles",
    href: "https://aboutcircles.github.io/CirclesTools/rpcQueryView.html?method=circles_searchProfiles",
  },
  {
    label: "Kickoff workshop PDF",
    href: "https://garage.aboutcircles.com/circles-kickoff-workshop-may19.pdf",
  },
  {
    label: "Trust analytics API",
    href: "https://squid-app-3gxnl.ondigitalocean.app/aboutcircles-advanced-analytics2/docs",
  },
];

export function BuilderResourcesPanel() {
  return (
    <section className="glass-card rounded-2xl p-5 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
        Builder resources
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
        Garage cycle 01 · HIST group currency · deploy on{" "}
        <code className="rounded bg-[var(--bg-card)] px-1.5 py-0.5 text-[var(--gold-soft)]">
          *.thp.gnosis.box
        </code>
      </p>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((r) => (
          <li key={r.href}>
            <a
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 px-4 py-3 text-sm text-[var(--gold-soft)] transition hover:border-[var(--gold)]/35 hover:bg-[var(--bg-card)]"
            >
              {r.label} ↗
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs text-[var(--text-muted)]">
        On-chain HIST: see{" "}
        <code className="text-[var(--gold-soft)]/80">scripts/setup-hist-group.md</code>
        {" · "}
        set <code className="text-[var(--gold-soft)]/80">VITE_HIST_GROUP_ADDRESS</code>{" "}
        after group creation.
      </p>
    </section>
  );
}
