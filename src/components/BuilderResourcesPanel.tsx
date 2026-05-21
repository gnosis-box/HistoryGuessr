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
    label: "Workshop recording (Vimeo)",
    href: "https://vimeo.com/1193867453",
  },
  {
    label: "Trust analytics API",
    href: "https://squid-app-3gxnl.ondigitalocean.app/aboutcircles-advanced-analytics2/docs",
  },
  {
    label: "Drive assets",
    href: "https://drive.google.com/file/d/1MwWsxJKfkPk_ppn6SNeoBSS97mT7KnCL/view",
  },
];

export function BuilderResourcesPanel() {
  return (
    <section className="glass-card rounded-2xl p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
        Builder resources
      </p>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Garage cycle 01 · HIST group currency · deploy on{" "}
        <code className="text-[var(--accent-soft)]">*.thp.gnosis.box</code>
      </p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {resources.map((r) => (
          <li key={r.href}>
            <a
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-white/5 bg-[var(--surface-soft)]/60 px-3 py-2 text-sm text-[var(--accent-soft)] transition hover:border-[var(--accent)]/40"
            >
              {r.label} ↗
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-[var(--text-secondary)]">
        On-chain HIST: see <code>scripts/setup-hist-group.md</code> · set{" "}
        <code>VITE_HIST_GROUP_ADDRESS</code> after group creation.
      </p>
    </section>
  );
}
