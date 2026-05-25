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
import type { GameChallenge } from "@/types/game";
import { fetchCirclesProfile } from "./profile";
import { subscribeWallet } from "./host";
import { mockCirclesProfile } from "./mockCirclesProfile";
import type { CirclesProfile } from "./types";
import {
  evaluateReward,
  loadLedger,
  recordReward,
  type RewardEligibility,
  type RewardLedger,
} from "./rewards";
import { fetchTrustGate, type TrustGateResult } from "./trust";
import { resolveVouchStatus, type VouchStatus } from "./vouching";
import { claimPendingHist } from "./payout";
import {
  fetchHistGroupTreasury,
  isHistGroupMember,
  userTrustsGroup,
  type GroupTreasurySummary,
} from "./groups";
import { devRelaxTrust, historyGuessrGroup } from "./config";
import { fetchTrustPeers, type TrustPeer } from "./trustGraph";

export type { VouchStatus };

interface CirclesContextValue {
  address: string | null;
  profile: CirclesProfile;
  isConnected: boolean;
  isMiniappHost: boolean;
  isLoadingProfile: boolean;
  profileError: string | null;
  refreshProfile: () => Promise<void>;
  ledger: RewardLedger;
  trustGate: TrustGateResult | null;
  vouchStatus: VouchStatus;
  trustPeers: TrustPeer[];
  histTreasury: GroupTreasurySummary | null;
  trustsHistGroup: boolean;
  processChallengeReward: (
    score: number,
    challenge: GameChallenge,
  ) => RewardEligibility;
  claimRewards: () => Promise<string>;
}

const CirclesContext = createContext<CirclesContextValue | null>(null);

export function CirclesProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [profile, setProfile] = useState<CirclesProfile | null>(null);
  const [isMiniappHost, setIsMiniappHost] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [ledger, setLedger] = useState<RewardLedger>(() => loadLedger());
  const [trustGate, setTrustGate] = useState<TrustGateResult | null>(null);
  const [isHistMember, setIsHistMember] = useState(false);
  const [trustsHistGroup, setTrustsHistGroup] = useState(false);
  const [trustPeers, setTrustPeers] = useState<TrustPeer[]>([]);
  const [histTreasury, setHistTreasury] = useState<GroupTreasurySummary | null>(
    null,
  );

  const loadProfile = useCallback(async (addr: string) => {
    setIsLoadingProfile(true);
    setProfileError(null);
    try {
      const groupAddr = historyGuessrGroup.groupAddress;
      const [fetched, trust, peers, treasury, member, trustsGroup] =
        await Promise.all([
          fetchCirclesProfile(addr),
          fetchTrustGate(addr),
          fetchTrustPeers(addr),
          fetchHistGroupTreasury(),
          groupAddr ? isHistGroupMember(addr) : Promise.resolve(false),
          groupAddr ? userTrustsGroup(addr, groupAddr) : Promise.resolve(false),
        ]);
      setProfile(fetched);
      setTrustGate(trust);
      setTrustPeers(peers);
      setHistTreasury(treasury);
      setIsHistMember(member);
      setTrustsHistGroup(trustsGroup);
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
        setTrustGate(null);
        setIsHistMember(false);
        setTrustsHistGroup(false);
        setTrustPeers([]);
        setHistTreasury(null);
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

  const vouchStatus: VouchStatus =
    devRelaxTrust && address
      ? "member"
      : resolveVouchStatus({
          isConnected: Boolean(address),
          isHistMember,
          trustsHistGroup,
          trustGatePasses: trustGate?.passesGate ?? false,
        });
  const isGroupMember =
    isHistMember || trustsHistGroup || (devRelaxTrust && Boolean(address));

  const displayProfile = useMemo<CirclesProfile>(() => {
    const base = profile
      ? profile
      : address
        ? { ...mockCirclesProfile, address, name: "Circles player" }
        : mockCirclesProfile;
    return {
      ...base,
      groupCurrencyBalance: ledger.pending + ledger.claimed,
      groupCurrencySymbol: "HIST",
    };
  }, [profile, address, ledger]);

  const processChallengeReward = useCallback(
    (score: number, challenge: GameChallenge): RewardEligibility => {
      const eligibility = evaluateReward({
        score,
        difficulty: challenge.difficulty,
        challengeType: challenge.type,
        isConnected: Boolean(address),
        trustScore: trustGate?.relativeScore,
        targetsReached: trustGate?.targetsReached,
        isGroupMember,
      });

      if (!eligibility.canEarn || eligibility.amount <= 0) {
        return eligibility;
      }

      const updated = recordReward({
        amount: eligibility.amount,
        score,
        challengeId: challenge.id,
        challengeType: challenge.type,
        status: "pending",
        reason: eligibility.reason,
      });
      setLedger(updated);

      return eligibility;
    },
    [address, trustGate, isGroupMember],
  );

  const claimRewards = useCallback(async () => {
    const pending = ledger.pending;
    if (pending <= 0) return "Nothing to claim.";
    const result = await claimPendingHist(pending);
    if (result.ok) setLedger(loadLedger());
    return result.message;
  }, [ledger.pending]);

  const value = useMemo<CirclesContextValue>(
    () => ({
      address,
      profile: displayProfile,
      isConnected: Boolean(address),
      isMiniappHost,
      isLoadingProfile,
      profileError,
      refreshProfile,
      ledger,
      trustGate,
      vouchStatus,
      trustPeers,
      histTreasury,
      trustsHistGroup,
      processChallengeReward,
      claimRewards,
    }),
    [
      address,
      displayProfile,
      isMiniappHost,
      isLoadingProfile,
      profileError,
      refreshProfile,
      ledger,
      trustGate,
      vouchStatus,
      trustPeers,
      histTreasury,
      trustsHistGroup,
      processChallengeReward,
      claimRewards,
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
