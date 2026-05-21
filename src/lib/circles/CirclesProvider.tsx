// src/lib/circles/CirclesProvider.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchCirclesProfile } from "./profile";
import { subscribeWallet } from "./host";
import { mockCirclesProfile } from "./mockCirclesProfile";
import type { CirclesProfile } from "./types";

interface CirclesContextValue {
  address: string | null;
  profile: CirclesProfile;
  isConnected: boolean;
  isMiniappHost: boolean;
  isLoadingProfile: boolean;
  profileError: string | null;
  refreshProfile: () => Promise<void>;
}

const CirclesContext = createContext<CirclesContextValue | null>(null);

export function CirclesProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [profile, setProfile] = useState<CirclesProfile | null>(null);
  const [isMiniappHost, setIsMiniappHost] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loadProfile = useCallback(async (addr: string) => {
    setIsLoadingProfile(true);
    setProfileError(null);
    try {
      const fetched = await fetchCirclesProfile(addr);
      setProfile(fetched);
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : "Could not load Circles profile",
      );
      setProfile({
        ...mockCirclesProfile,
        address: addr,
        name: undefined,
      });
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    subscribeWallet((addr) => {
      setAddress(addr);
      if (addr) void loadProfile(addr);
      else {
        setProfile(null);
        setProfileError(null);
      }
    }).then(({ unsubscribe: unsub, isMiniappHost: host }) => {
      unsubscribe = unsub;
      setIsMiniappHost(host);
    });

    return () => unsubscribe?.();
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    if (address) await loadProfile(address);
  }, [address, loadProfile]);

  const displayProfile = useMemo<CirclesProfile>(() => {
    if (profile) return profile;
    if (address) {
      return { ...mockCirclesProfile, address, name: "Circles player" };
    }
    return mockCirclesProfile;
  }, [profile, address]);

  const value = useMemo<CirclesContextValue>(
    () => ({
      address,
      profile: displayProfile,
      isConnected: Boolean(address),
      isMiniappHost,
      isLoadingProfile,
      profileError,
      refreshProfile,
    }),
    [
      address,
      displayProfile,
      isMiniappHost,
      isLoadingProfile,
      profileError,
      refreshProfile,
    ],
  );

  return (
    <CirclesContext.Provider value={value}>{children}</CirclesContext.Provider>
  );
}

export function useCircles(): CirclesContextValue {
  const ctx = useContext(CirclesContext);
  if (!ctx) {
    throw new Error("useCircles must be used within CirclesProvider");
  }
  return ctx;
}
