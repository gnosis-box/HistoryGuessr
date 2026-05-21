import { playModeGroups } from "@/data/playModes";
import { usePlayNavigation } from "@/context/PlayNavigation";

export function NavBar() {
  const {
    screen,
    activeGroupId,
    goHome,
    openProfile,
    openCategory,
    startDaily,
    startRandom,
  } = usePlayNavigation();

  function categoryClass(groupId: string): string {
    const active = screen === "category" && activeGroupId === groupId;
    return `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
      active
        ? "bg-[var(--gold)] text-[var(--bg-main)]"
        : "text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
    }`;
  }

  return (
    <nav
      className="border-b border-[var(--border-subtle)] bg-[var(--bg-panel)]/90"
      aria-label="Game categories"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={goHome}
              className={`mr-1 shrink-0 rounded-full px-3 py-2 text-sm font-medium ${
                screen === "home"
                  ? "bg-[var(--bg-card)] text-[var(--gold-soft)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={openProfile}
              className={`mr-1 shrink-0 rounded-full px-3 py-2 text-sm font-medium ${
                screen === "profile"
                  ? "bg-[var(--bg-card)] text-[var(--honor-soft)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Profile
            </button>

            {playModeGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                className={categoryClass(group.id)}
                onClick={() => openCategory(group.id)}
              >
                {group.label}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-[var(--gold)]/40 px-3 py-1.5 text-xs font-medium text-[var(--gold-soft)] hover:bg-[var(--gold)]/10"
              onClick={startDaily}
            >
              Daily
            </button>
            <button
              type="button"
              className="rounded-full px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              onClick={startRandom}
            >
              Random
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
