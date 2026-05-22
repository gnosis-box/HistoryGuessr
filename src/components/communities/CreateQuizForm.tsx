import { useMemo, useState } from "react";
import { challengeCatalog } from "@/data/catalog";
import { getCustomChallengesForCommunity } from "@/lib/challenges/customStorage";
import { getPlayModeLabel } from "@/data/playModes";
import {
  MAX_QUIZ_QUESTIONS,
  MIN_QUIZ_QUESTIONS,
} from "@/types/community";
import { ChallengeBuilder } from "./ChallengeBuilder";

interface CreateQuizFormProps {
  communityId: string;
  communityName: string;
  founderAddress: string;
  onCreated: (input: {
    title: string;
    description: string;
    challengeIds: string[];
  }) => void;
  onCancel: () => void;
}

type Tab = "catalog" | "yours" | "create";

export function CreateQuizForm({
  communityId,
  communityName,
  founderAddress,
  onCreated,
  onCancel,
}: CreateQuizFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState<Tab>("yours");
  const [customVersion, setCustomVersion] = useState(0);

  const customList = useMemo(
    () => getCustomChallengesForCommunity(communityId),
    [communityId, customVersion],
  );

  const filteredCatalog = useMemo(() => {
    const q = filter.toLowerCase();
    return challengeCatalog.filter(
      (c) =>
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.type.includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [filter]);

  const filteredCustom = useMemo(() => {
    const q = filter.toLowerCase();
    return customList.filter(
      (r) =>
        !q ||
        r.challenge.title.toLowerCase().includes(q) ||
        r.challenge.type.includes(q),
    );
  }, [customList, filter]);

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

  if (tab === "create") {
    return (
      <ChallengeBuilder
        communityId={communityId}
        createdBy={founderAddress || "guest"}
        onSaved={(id) => {
          setCustomVersion((v) => v + 1);
          setSelected((prev) =>
            prev.includes(id) || prev.length >= MAX_QUIZ_QUESTIONS
              ? prev
              : [...prev, id],
          );
          setTab("yours");
        }}
        onCancel={() => setTab("yours")}
      />
    );
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
        Build your theme: create custom challenges or mix with the catalog (
        {selected.length}/{MAX_QUIZ_QUESTIONS} selected).
      </p>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["yours", "Your challenges"],
            ["create", "+ Create new"],
            ["catalog", "Catalog"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              tab === id
                ? "bg-[var(--gold)] text-[var(--bg-main)]"
                : "border border-[var(--border-subtle)] text-[var(--text-secondary)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

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
        placeholder="Filter…"
        className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-sm"
      />

      <ChallengeList
        items={
          tab === "catalog"
            ? filteredCatalog.map((c) => ({
                id: c.id,
                title: c.title,
                type: c.type,
              }))
            : filteredCustom.map((r) => ({
                id: r.id,
                title: r.challenge.title,
                type: r.challenge.type,
                custom: true,
              }))
        }
        selected={selected}
        max={MAX_QUIZ_QUESTIONS}
        onToggle={toggle}
        emptyMessage={
          tab === "yours"
            ? "No custom challenges yet — use + Create new."
            : "No matches."
        }
      />

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

function ChallengeList({
  items,
  selected,
  max,
  onToggle,
  emptyMessage,
}: {
  items: { id: string; title: string; type: string; custom?: boolean }[];
  selected: string[];
  max: number;
  onToggle: (id: string) => void;
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-[var(--text-muted)]">{emptyMessage}</p>;
  }

  return (
    <ul className="max-h-52 space-y-1 overflow-y-auto rounded-lg border border-[var(--border-subtle)] p-2">
      {items.map((c) => {
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
                onChange={() => onToggle(c.id)}
                disabled={!on && selected.length >= max}
              />
              <span className="min-w-0 flex-1">
                <span className="font-medium text-[var(--text-primary)]">
                  {c.title}
                </span>
                <span className="ml-2 text-xs text-[var(--text-muted)]">
                  {getPlayModeLabel(c.type as never)}
                  {c.custom && " · yours"}
                </span>
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
