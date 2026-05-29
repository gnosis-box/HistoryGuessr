import { useState } from "react";
import { useCircles } from "@/hooks/use-circles";
import { shortenAddress } from "@/lib/circles/format";

export function CirclesWalletBadge() {
  const {
    profile,
    isConnected,
    isMiniappHost,
    isLoadingProfile,
    profileError,
    refreshProfile,
    hasSignedIn,
    completeSignIn,
  } = useCircles();
  const [signStatus, setSignStatus] = useState<string | null>(null);

  const showSignIn =
    isConnected && isMiniappHost && !hasSignedIn;

  async function handleSignIn() {
    setSignStatus(null);
    const verified = await completeSignIn();
    if (verified) {
      setSignStatus("Signed in");
    } else {
      setSignStatus("Sign-in failed");
    }
    window.setTimeout(() => setSignStatus(null), 3000);
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
                {profile.groupCurrencyBalance !== undefined &&
                  ` · ${profile.groupCurrencyBalance} ${profile.groupCurrencySymbol ?? "HIST"}`}
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
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[var(--text-secondary)] hover:border-[var(--accent)]/40"
            onClick={() => void refreshProfile()}
          >
            Refresh
          </button>
          {showSignIn && (
            <button
              type="button"
              className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-[var(--accent-soft)] hover:border-[var(--accent)]/40"
              onClick={() => void handleSignIn()}
            >
              Sign in
            </button>
          )}
          {hasSignedIn && !showSignIn && (
            <span className="px-1 text-[10px] text-[var(--success)]">
              Session active
            </span>
          )}
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
