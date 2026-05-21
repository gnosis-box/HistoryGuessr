import { useState } from "react";
import type { CommunityVisibility } from "@/types/community";

interface CreateCommunityFormProps {
  founderAddress: string;
  onCreated: (input: {
    name: string;
    description: string;
    visibility: CommunityVisibility;
    inviteAddresses: string[];
  }) => void;
}

export function CreateCommunityForm({
  founderAddress,
  onCreated,
}: CreateCommunityFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] =
    useState<CommunityVisibility>("private");
  const [invites, setInvites] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const inviteAddresses = invites
      .split(/[\s,]+/)
      .map((a) => a.trim())
      .filter((a) => a.startsWith("0x"));
    onCreated({
      name: name.trim(),
      description: description.trim(),
      visibility,
      inviteAddresses,
    });
    setName("");
    setDescription("");
    setInvites("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card space-y-4 rounded-2xl p-5"
    >
      <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
        Create a trusted circle
      </h3>
      <p className="text-sm text-[var(--text-secondary)]">
        Invite players you trust for custom quiz sessions. Founder:{" "}
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {founderAddress || "guest (connect Circles)"}
        </span>
      </p>

      <label className="block text-sm">
        <span className="text-[var(--text-muted)]">Name</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-[var(--text-primary)]"
          placeholder="Avignon historians"
        />
      </label>

      <label className="block text-sm">
        <span className="text-[var(--text-muted)]">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 text-[var(--text-primary)]"
          placeholder="Weekly map quizzes for our circle…"
        />
      </label>

      <fieldset className="text-sm">
        <legend className="text-[var(--text-muted)]">Visibility</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={visibility === "private"}
              onChange={() => setVisibility("private")}
            />
            Private (invite list + link)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={visibility === "discoverable"}
              onChange={() => setVisibility("discoverable")}
            />
            Open link (anyone with URL)
          </label>
        </div>
      </fieldset>

      <label className="block text-sm">
        <span className="text-[var(--text-muted)]">
          Invite wallets (0x…, comma-separated)
        </span>
        <input
          value={invites}
          onChange={(e) => setInvites(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-2 font-mono text-xs text-[var(--text-primary)]"
          placeholder="0xabc…, 0xdef…"
        />
      </label>

      <button type="submit" className="btn-primary">
        Create circle
      </button>
    </form>
  );
}
