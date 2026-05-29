// src/lib/circles/histCurrencyContent.ts
import { historyGuessrGroup, rewardPolicy } from "./config";

const DOCS_GROUP_CURRENCIES =
  "https://docs.aboutcircles.com/overview/how-it-works/group-currencies";

export const histCurrencyContent = {
  symbol: historyGuessrGroup.symbol,
  name: historyGuessrGroup.name,
  docsUrl: DOCS_GROUP_CURRENCIES,
  tagline: "Group currency for cultural contribution on Circles",

  flywheel: {
    title: "Play more → earn more",
    subtitle:
      "Strong sessions stack HIST. HIST is backed by real CRC in the group treasury — so cultural merit can flow back into Circles money.",
    steps: [
      {
        title: "Play",
        body: "Maps, timelines, sources, duels — higher scores earn more HIST (from 400 pts upward).",
      },
      {
        title: "Earn HIST",
        body: "Rewards land in your History Guessr ledger — up to 30 HIST per day while we scale fairly.",
      },
      {
        title: "Trust the group",
        body: "Support the History Guessr avatar in Circles to hold and move group tokens on-chain.",
      },
      {
        title: "Redeem CRC",
        body: "HIST converts to CRC through Circles group rules and treasury collateral — not a fake in-game point.",
      },
      {
        title: "Reinvest",
        body: "CRC powers invites, trust, and participation — your circle grows, quests get richer, everyone benefits.",
      },
    ],
    winWin:
      "More play → more HIST → more CRC for active, trusted historians. The group treasury only pays what it holds — operators fund it with CRC so rewards stay real.",
  },

  whatHistIs: {
    title: "What is HIST?",
    paragraphs: [
      "HIST is History Guessr’s Circles group currency. It marks value for learning, verification, and curation — not your everyday wallet balance.",
      "Personal CRC is protocol money on Gnosis. HIST is a label inside our circle: “this person contributed culture here.”",
    ],
  },

  givingHist: {
    title: "What happens when you give HIST?",
    intro:
      "HIST is social money. Sending it to someone is recognition inside the History Guessr group — not a tip button in this miniapp yet, but the design is the same as Circles group transfers.",
    effects: [
      {
        title: "Recognition",
        body: "You signal that their quiz, source, or score mattered to the community.",
      },
      {
        title: "Group circulation",
        body: "HIST moves between members who trust the group — it stays inside the circle’s economy.",
      },
      {
        title: "Treasury backing",
        body: "Redeemed HIST draws on CRC collateral the group locked — so gifts are tied to real protocol value.",
      },
      {
        title: "Trust graph",
        body: "People you trust (and who trust you) are the natural recipients — duels and leaderboards preview this.",
      },
    ],
  },

  crcRelationship: {
    title: "HIST ↔ CRC",
    summary:
      "There is no fixed “1 HIST = X €” button here. Conversion follows Circles: group tokens redeem against treasury CRC when you use the Circles app.",
    steps: [
      {
        label: "Earn",
        text: "Finish quests in History Guessr — scores mint HIST into your ledger.",
      },
      {
        label: "Trust",
        text: "Support the History Guessr group in Circles (Supporter / star on the group profile).",
      },
      {
        label: "Redeem",
        text: "Redeem or transfer via Circles group flows; CRC comes from collateral operators deposited.",
      },
    ],
  },

  limits: {
    title: "Fair play limits",
    items: [
      `Scores below ${rewardPolicy.minScoreToEarn} points do not earn HIST.`,
      `Daily cap: ${rewardPolicy.maxRewardsPerDay} HIST per browser (anti-spam).`,
      "Trust path via Gnosis Group or supporting HIST unlocks full rewards.",
      "On-chain payout batches may lag the in-game ledger — claim marks progress; treasury pays winners.",
    ],
  },

  purposes: [
    "Reward strong runs on maps, timelines, and source challenges",
    "Signal trust and participation inside the History Guessr circle",
    "Separate game merit from your everyday CRC balance",
  ],

  personalCrcNote:
    "CRC is real Circles money. HIST is how History Guessr scores cultural contribution before it flows back to CRC.",

  builderIntro:
    "Deploy the group, fund treasury, export ledgers, and batch-pay winners. Players never need these tools.",
} as const;
