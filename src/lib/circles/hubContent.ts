// src/lib/circles/hubContent.ts
import { historyGuessrGroup } from "./config";

const CIRCLES_APP = "https://app.aboutcircles.com";
const DOCS_GROUPS =
  "https://docs.aboutcircles.com/overview/how-it-works/group-currencies";

export const circlesHubContent = {
  title: "Circles",
  subtitle:
    "Play with people you trust, create circles and quizzes, then redeem HIST in the Circles ecosystem.",
  tabs: {
    overview: "Overview",
    circles: "Circles & quizzes",
    friends: "Trusted friends",
    redeem: "Redeem",
  },
  steps: [
    {
      step: "1",
      title: "Connect",
      body: "Link your Circles wallet (top right). Without a connection, circles stay local on this device.",
    },
    {
      step: "2",
      title: "Play together",
      body: "Challenge a trust peer, create a circle, invite wallets, publish a quiz, and share the link.",
    },
    {
      step: "3",
      title: "Earn & redeem",
      body: `Strong runs earn ${historyGuessrGroup.symbol}. Redeem for CRC in the Circles app once you support the group.`,
    },
  ],
  actions: {
    duel: {
      title: "Challenge a friend",
      description: "Pick someone from your trust graph and start a map duel.",
      cta: "Open duels",
    },
    createCircle: {
      title: "Create a circle",
      description: "Private group or open link — invite wallets you trust.",
      cta: "Create a circle",
    },
    createQuiz: {
      title: "Create a quiz",
      description: "Build questions for your circle and send the invite link.",
      cta: "View my circles",
    },
    hist: {
      title: `${historyGuessrGroup.symbol} economy`,
      description: "Learn how to earn, give, and convert to CRC.",
      cta: "HIST tab",
    },
  },
  redeem: {
    title: "Redeem your HIST",
    intro: `${historyGuessrGroup.symbol} is History Guessr's Circles group currency. It is not a fake score — it follows protocol rules and the group treasury.`,
    steps: [
      {
        title: "Play here",
        body: "Score ≥ 400 → HIST credited to your ledger (daily cap).",
      },
      {
        title: "Support the group",
        body: `In the Circles app, support the History Guessr group (${historyGuessrGroup.symbol}) to receive and transfer tokens.`,
      },
      {
        title: "Convert to CRC",
        body: "Redeem HIST ↔ CRC via group rules and collateral — like any Circles group currency.",
      },
    ],
    circlesAppLabel: "Open Circles app",
    circlesAppUrl: CIRCLES_APP,
    docsLabel: "Group currencies documentation",
    docsUrl: DOCS_GROUPS,
  },
  friends: {
    title: "Your trust graph",
    empty:
      "No peers visible yet. Add trust in the Circles app, then return here to challenge or invite.",
    duel: "Challenge",
    copyWallet: "Copy address",
    inviteToCircle: "Invite to circle",
    copied: "Address copied",
    invited: "Added to invites",
    pickCircle: "Choose a circle",
  },
  wallet: {
    connected: "Wallet connected",
    guest: "Guest mode — connect Circles to link circles and rewards",
  },
} as const;
