// src/lib/circles/hubContent.ts
import { historyGuessrGroup } from "./config";

const CIRCLES_APP = "https://app.aboutcircles.com";
const DOCS_GROUPS =
  "https://docs.aboutcircles.com/overview/how-it-works/group-currencies";

export const circlesHubContent = {
  title: "Circles",
  subtitle:
    "Jouez avec des personnes de confiance, créez des cercles et des quiz, puis échangez votre HIST dans l’écosystème Circles.",
  tabs: {
    overview: "Vue d’ensemble",
    circles: "Cercles & quiz",
    friends: "Amis de confiance",
    redeem: "Échanger",
  },
  steps: [
    {
      step: "1",
      title: "Connecter",
      body: "Liez votre portefeuille Circles (en haut à droite). Sans connexion, les cercles restent locaux sur cet appareil.",
    },
    {
      step: "2",
      title: "Jouer ensemble",
      body: "Défiez un pair de confiance, créez un cercle, invitez des wallets, publiez un quiz et partagez le lien.",
    },
    {
      step: "3",
      title: "Gagner & échanger",
      body: `Les bonnes parties rapportent du ${historyGuessrGroup.symbol}. Échangez-le contre du CRC dans l’app Circles une fois le groupe approuvé.`,
    },
  ],
  actions: {
    duel: {
      title: "Défier un ami",
      description: "Choisissez quelqu’un de votre graphe de confiance et lancez un duel carte.",
      cta: "Ouvrir les duels",
    },
    createCircle: {
      title: "Créer un cercle",
      description: "Groupe privé ou lien ouvert — invitez les wallets que vous trustez.",
      cta: "Créer un cercle",
    },
    createQuiz: {
      title: "Créer un quiz",
      description: "Composez des questions pour votre cercle et envoyez le lien d’invitation.",
      cta: "Voir mes cercles",
    },
    hist: {
      title: `Économie ${historyGuessrGroup.symbol}`,
      description: "Comprendre comment gagner, donner et convertir en CRC.",
      cta: "Onglet HIST",
    },
  },
  redeem: {
    title: "Échanger votre HIST",
    intro: `${historyGuessrGroup.symbol} est la monnaie de groupe History Guessr sur Circles. Elle n’est pas du « faux score » : elle suit les règles du protocole et la trésorerie du groupe.`,
    steps: [
      {
        title: "Jouer ici",
        body: "Score ≥ 400 → HIST crédité dans votre journal (plafond journalier).",
      },
      {
        title: "Approuver le groupe",
        body: `Dans l’app Circles, soutenez le groupe History Guessr (${historyGuessrGroup.symbol}) pour recevoir et transférer des jetons.`,
      },
      {
        title: "Convertir en CRC",
        body: "Échangez HIST ↔ CRC selon les règles du groupe et la collateralisation — comme toute monnaie de groupe Circles.",
      },
    ],
    circlesAppLabel: "Ouvrir l’app Circles",
    circlesAppUrl: CIRCLES_APP,
    docsLabel: "Documentation monnaies de groupe",
    docsUrl: DOCS_GROUPS,
  },
  friends: {
    title: "Votre graphe de confiance",
    empty:
      "Aucun pair visible pour l’instant. Ajoutez des relations dans l’app Circles, puis revenez ici pour défier ou inviter.",
    duel: "Défier",
    copyWallet: "Copier l’adresse",
    inviteToCircle: "Inviter au cercle",
    copied: "Adresse copiée",
    invited: "Ajouté aux invités",
    pickCircle: "Choisir un cercle",
  },
  wallet: {
    connected: "Portefeuille connecté",
    guest: "Mode invité — connectez Circles pour lier cercles et récompenses",
  },
} as const;
