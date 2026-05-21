import { useMemo, useState } from "react";
import { challengeCatalog } from "@/data/catalog";
import { getPlayModeLabel } from "@/data/playModes";
import {
  MAX_QUIZ_QUESTIONS,
  MIN_QUIZ_QUESTIONS,
} from "@/types/community";

interface CreateQuizFormProps {
  communityName: string;
  onCreated: (input: {
    title: string;
    description: string;
    challengeIds: string[];
  }) => void;
  onCancel: () => void;
}

export function CreateQuizForm({
  communityName,
  onCreated,
  onCancel,
}: CreateQuizFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return challengeCatalog.filter(
      (c) =>
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.type.includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [filter]);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_QUIZ_QUESTIONS) return prev;
      return [...prev, id];
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || selected.length < MIN_QUIZ_QUESTIONS) return;
    onCreated({
      title: title.trim(),
      description: description.trim(),
      challengeIds: selected,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card space-y-4 rounded-2xl border border-[var(--gold)]/20 p-5"
    >
      <h3 className="font-display text-lg font-semibold text-[var(--gold-soft)]">
        New quiz · {communityName}
      </h3>
      <p className="text-xs text-[var(--text-muted)]">
        Pick {MIN_QUIZ_QUESTIONS}–{MAX_QUIZ_QUESTIONS} challenges from the
        catalog ({selected.length}/{MAX_QUIZ_QUESTIONS} selected).
      </p>

      <label className="block text-sm">
        <span className="text-[var(--text-muted)]">Quiz title</span>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        <span className="text-[var(--text-muted)]">Short description</span>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2"
        />
      </label>

      <input
        type="search"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter challenges…"
        className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-sm"
      />

      <ul className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-[var(--border-subtle)] p-2">
        {filtered.slice(0, 40).map((c) => {
          const on = selected.includes(c.id);
          return (
            <li key={c.id}>
              <label
                className={`flex cursor-pointer gap-2 rounded px-2 py-1.5 text-sm ${
                  on ? "bg-[var(--gold)]/15" : "hover:bg-[var(--bg-card)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(c.id)}
                  disabled={!on && selected.length >= MAX_QUIZ_QUESTIONS}
                />
                <span className="min-w-0 flex-1">
                  <span className="font-medium text-[var(--text-primary)]">
                    {c.title}
                  </span>
                  <span className="ml-2 text-xs text-[var(--text-muted)]">
                    {getPlayModeLabel(c.type)}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="btn-primary"
          disabled={selected.length < MIN_QUIZ_QUESTIONS || !title.trim()}
        >
          Publish quiz
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
