import { useState } from "react";
import { useCircles } from "@/hooks/use-circles";
import { shortenAddress } from "@/lib/circles/format";
import { signInMessage } from "@/lib/circles/host";

export function CirclesWalletBadge() {
  const {
    profile,
    isConnected,
    isMiniappHost,
    isLoadingProfile,
    profileError,
    refreshProfile,
  } = useCircles();
  const [signStatus, setSignStatus] = useState<string | null>(null);

  async function handleSignIn() {
    if (!isMiniappHost) return;
    try {
      const nonce = crypto.randomUUID().slice(0, 8);
      const { verified } = await signInMessage(nonce);
      setSignStatus(verified ? "Signed in" : "Signed (unverified)");
      window.setTimeout(() => setSignStatus(null), 3000);
    } catch {
      setSignStatus("Sign-in failed");
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {isConnected && profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt=""
            className="h-8 w-8 rounded-full border border-[var(--accent)]/40 object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[var(--surface-soft)] text-xs text-[var(--accent)]">
            {isConnected ? shortenAddress(profile.address, 2) : "G"}
          </div>
        )}

        <div className="text-right text-xs">
          {isConnected ? (
            <>
              <p className="font-medium text-[var(--text-primary)]">
                {isLoadingProfile
                  ? "Loading…"
                  : profile.name ?? shortenAddress(profile.address)}
              </p>
              <p className="text-[var(--text-secondary)]">
                {profile.crcBalance !== undefined
                  ? `${profile.crcBalance} CRC`
                  : "CRC —"}
                {profile.trustConnections !== undefined &&
                  ` · ${profile.trustConnections} trust`}
              </p>
            </>
          ) : (
            <>
              <p className="font-medium text-[var(--text-secondary)]">
                Guest mode
              </p>
              <p className="text-[var(--text-secondary)]/80">
                {isMiniappHost ? "Awaiting wallet…" : "Open in Circles host"}
              </p>
            </>
          )}
        </div>
      </div>

      {isConnected && isMiniappHost && (
        <div className="flex gap-1">
          <button
            type="button"
            className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[var(--text-secondary)] hover:border-[var(--accent)]/40"
            onClick={() => void refreshProfile()}
          >
            Refresh
          </button>
          <button
            type="button"
            className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[var(--accent-soft)] hover:border-[var(--accent)]/40"
            onClick={() => void handleSignIn()}
          >
            Sign in
          </button>
        </div>
      )}

      {signStatus && (
        <p className="text-[10px] text-[var(--success)]">{signStatus}</p>
      )}
      {profileError && (
        <p className="max-w-[200px] text-right text-[10px] text-amber-400/90">
          {profileError}
        </p>
      )}
    </div>
  );
}
