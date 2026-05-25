// src/components/circles/TrustGraphView.tsx
import { useMemo, useState } from "react";
import { historyGuessrGroup } from "@/lib/circles/config";
import { peerDisplayName, type TrustPeer } from "@/lib/circles/trustGraph";

const SIZE = 420;
const CENTER = SIZE / 2;
const ORBIT = 148;
const SELF_R = 30;
const PEER_R = 22;
const GROUP_R = 18;

interface LayoutNode {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  kind: "self" | "peer" | "group";
  relation?: TrustPeer["relation"];
  avatarUrl?: string;
}

interface LayoutEdge {
  id: string;
  from: string;
  to: string;
  kind: "outbound" | "inbound" | "mutual";
}

function layoutNodes(
  peers: TrustPeer[],
  selfLabel: string,
  showHistGroup: boolean,
): LayoutNode[] {
  const nodes: LayoutNode[] = [
    {
      id: "self",
      label: selfLabel,
      x: CENTER,
      y: CENTER,
      r: SELF_R,
      kind: "self",
    },
  ];

  const peerCount = peers.length + (showHistGroup ? 1 : 0);
  const step = peerCount > 0 ? (2 * Math.PI) / peerCount : 0;

  peers.forEach((peer, i) => {
    const angle = -Math.PI / 2 + step * i;
    nodes.push({
      id: peer.address,
      label: peerDisplayName(peer),
      x: CENTER + ORBIT * Math.cos(angle),
      y: CENTER + ORBIT * Math.sin(angle),
      r: PEER_R,
      kind: "peer",
      relation: peer.relation,
      avatarUrl: peer.avatarUrl,
    });
  });

  if (showHistGroup && historyGuessrGroup.groupAddress) {
    const i = peers.length;
    const angle = -Math.PI / 2 + step * i;
    nodes.push({
      id: historyGuessrGroup.groupAddress,
      label: historyGuessrGroup.symbol,
      x: CENTER + ORBIT * Math.cos(angle),
      y: CENTER + ORBIT * Math.sin(angle),
      r: GROUP_R,
      kind: "group",
    });
  }

  return nodes;
}

function layoutEdges(peers: TrustPeer[], showHistGroup: boolean): LayoutEdge[] {
  const edges: LayoutEdge[] = [];

  for (const peer of peers) {
    if (peer.relation === "trusts" || peer.relation === "mutual") {
      edges.push({
        id: `out-${peer.address}`,
        from: "self",
        to: peer.address,
        kind: peer.relation === "mutual" ? "mutual" : "outbound",
      });
    }
    if (peer.relation === "trustedBy" || peer.relation === "mutual") {
      edges.push({
        id: `in-${peer.address}`,
        from: peer.address,
        to: "self",
        kind: peer.relation === "mutual" ? "mutual" : "inbound",
      });
    }
  }

  if (showHistGroup && historyGuessrGroup.groupAddress) {
    edges.push({
      id: "hist-trust",
      from: "self",
      to: historyGuessrGroup.groupAddress,
      kind: "outbound",
    });
  }

  return edges;
}

function edgePoints(
  from: LayoutNode,
  to: LayoutNode,
): { x1: number; y1: number; x2: number; y2: number } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: from.x + ux * from.r,
    y1: from.y + uy * from.r,
    x2: to.x - ux * to.r,
    y2: to.y - uy * to.r,
  };
}

function relationLabel(relation: TrustPeer["relation"]): string {
  if (relation === "mutual") return "Mutual trust";
  if (relation === "trusts") return "You trust them";
  return "They trust you";
}

interface TrustGraphViewProps {
  trustPeers: TrustPeer[];
  selfLabel: string;
  trustsHistGroup?: boolean;
  isLoading?: boolean;
  isConnected?: boolean;
  compact?: boolean;
}

export function TrustGraphView({
  trustPeers,
  selfLabel,
  trustsHistGroup = false,
  isLoading = false,
  isConnected = true,
  compact = false,
}: TrustGraphViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const showHistGroup = Boolean(
    trustsHistGroup && historyGuessrGroup.groupAddress,
  );

  const nodes = useMemo(
    () => layoutNodes(trustPeers, selfLabel, showHistGroup),
    [trustPeers, selfLabel, showHistGroup],
  );

  const edges = useMemo(
    () => layoutEdges(trustPeers, showHistGroup),
    [trustPeers, showHistGroup],
  );

  const nodeById = useMemo(
    () => new Map(nodes.map((n) => [n.id, n])),
    [nodes],
  );

  const selected =
    selectedId && selectedId !== "self"
      ? trustPeers.find((p) => p.address === selectedId)
      : null;

  const counts = useMemo(() => {
    let mutual = 0;
    let outbound = 0;
    let inbound = 0;
    for (const p of trustPeers) {
      if (p.relation === "mutual") mutual++;
      else if (p.relation === "trusts") outbound++;
      else inbound++;
    }
    return { mutual, outbound, inbound, total: trustPeers.length };
  }, [trustPeers]);

  return (
    <section className="glass-card space-y-4 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            Trust graph
          </h2>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            Circles human avatars — arrows show who trusts whom
          </p>
        </div>
        {!isLoading && trustPeers.length > 0 && (
          <p className="text-xs tabular-nums text-[var(--text-secondary)]">
            {counts.total} peer{counts.total === 1 ? "" : "s"}
            {counts.mutual > 0 && ` · ${counts.mutual} mutual`}
          </p>
        )}
      </div>

      {isLoading && (
        <p className="text-sm text-[var(--text-muted)]">Loading trust graph…</p>
      )}

      {!isLoading && !isConnected && (
        <p className="text-sm text-[var(--text-secondary)]">
          Connect Circles to load your trust graph.
        </p>
      )}

      {!isLoading && isConnected && trustPeers.length === 0 && !showHistGroup && (
        <p className="text-sm text-[var(--text-secondary)]">
          No human trust links yet. Trust historians in the Circles app, then
          refresh your profile.
        </p>
      )}

      {!isLoading && (trustPeers.length > 0 || showHistGroup) && (
        <>
          <div
            className={`relative mx-auto w-full max-w-md ${compact ? "max-h-[280px]" : ""}`}
          >
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="h-auto w-full touch-none select-none"
              role="img"
              aria-label="Circles trust graph"
            >
              <defs>
                <marker
                  id="arrow-out"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path
                    d="M0,0 L8,4 L0,8 Z"
                    fill="var(--map-green)"
                    opacity="0.9"
                  />
                </marker>
                <marker
                  id="arrow-in"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path
                    d="M0,0 L8,4 L0,8 Z"
                    fill="var(--steel)"
                    opacity="0.9"
                  />
                </marker>
                <marker
                  id="arrow-mutual"
                  markerWidth="8"
                  markerHeight="8"
                  refX="6"
                  refY="4"
                  orient="auto"
                >
                  <path
                    d="M0,0 L8,4 L0,8 Z"
                    fill="var(--gold-soft)"
                    opacity="0.95"
                  />
                </marker>
              </defs>

              {edges.map((edge) => {
                const from = nodeById.get(edge.from);
                const to = nodeById.get(edge.to);
                if (!from || !to) return null;
                const { x1, y1, x2, y2 } = edgePoints(from, to);
                const marker =
                  edge.kind === "mutual"
                    ? "url(#arrow-mutual)"
                    : edge.kind === "outbound"
                      ? "url(#arrow-out)"
                      : "url(#arrow-in)";
                const stroke =
                  edge.kind === "mutual"
                    ? "var(--gold-soft)"
                    : edge.kind === "outbound"
                      ? "var(--map-green)"
                      : "var(--steel)";
                return (
                  <line
                    key={edge.id}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={stroke}
                    strokeWidth={edge.kind === "mutual" ? 2 : 1.5}
                    strokeOpacity={0.75}
                    markerEnd={marker}
                  />
                );
              })}

              {nodes.map((node) => {
                const isSelf = node.kind === "self";
                const isGroup = node.kind === "group";
                const isSelected = selectedId === node.id;
                const fill = isSelf
                  ? "var(--gold)"
                  : isGroup
                    ? "var(--honor)"
                    : node.relation === "mutual"
                      ? "var(--gold-soft)"
                      : node.relation === "trusts"
                        ? "var(--map-green)"
                        : "var(--steel)";

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedId((id) => (id === node.id ? null : node.id))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedId((id) => (id === node.id ? null : node.id));
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={node.label}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r + (isSelected ? 4 : 0)}
                      fill="none"
                      stroke={fill}
                      strokeWidth={isSelected ? 2 : 0}
                      strokeOpacity={0.5}
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.r}
                      fill="var(--bg-card)"
                      stroke={fill}
                      strokeWidth={2}
                    />
                    <text
                      x={node.x}
                      y={node.y + (isGroup ? 4 : 5)}
                      textAnchor="middle"
                      className="fill-[var(--text-primary)] font-display text-[11px] font-semibold"
                      style={{ pointerEvents: "none" }}
                    >
                      {isSelf
                        ? selfLabel.charAt(0).toUpperCase()
                        : isGroup
                          ? "H"
                          : node.label.charAt(0).toUpperCase()}
                    </text>
                    {!compact && (
                      <text
                        x={node.x}
                        y={node.y + node.r + 14}
                        textAnchor="middle"
                        className="fill-[var(--text-muted)] text-[9px]"
                        style={{ pointerEvents: "none" }}
                      >
                        {node.label.length > 12
                          ? `${node.label.slice(0, 10)}…`
                          : node.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <ul className="flex flex-wrap gap-3 text-[10px] text-[var(--text-muted)]">
            <li className="flex items-center gap-1.5">
              <span
                className="inline-block h-0.5 w-4 bg-[var(--map-green)]"
                aria-hidden
              />
              You trust
            </li>
            <li className="flex items-center gap-1.5">
              <span
                className="inline-block h-0.5 w-4 bg-[var(--steel)]"
                aria-hidden
              />
              Trusts you
            </li>
            <li className="flex items-center gap-1.5">
              <span
                className="inline-block h-0.5 w-4 bg-[var(--gold-soft)]"
                aria-hidden
              />
              Mutual
            </li>
            {showHistGroup && (
              <li className="flex items-center gap-1.5">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-[var(--honor)]"
                  aria-hidden
                />
                HIST group
              </li>
            )}
          </ul>

          {selected && (
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 px-3 py-2 text-sm">
              <p className="font-display font-semibold text-[var(--text-primary)]">
                {peerDisplayName(selected)}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {relationLabel(selected.relation)}
              </p>
              <p className="mt-1 font-mono text-[10px] text-[var(--text-muted)]">
                {selected.address}
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
