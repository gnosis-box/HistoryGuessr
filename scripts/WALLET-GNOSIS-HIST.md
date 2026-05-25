# Gnosis Wallet + déploiement HIST

## Tu ne trouves pas la clé ? (le plus fréquent)

Ce n’est **pas** un échec de ta part.

| Situation | Pourquoi tu ne vois pas « Clé privée » |
|-----------|----------------------------------------|
| Connexion **passkey** / email dans Gnosis | Aucune clé exportable — normal |
| Compte MetaMask **Smart Account** | Pas de clé classique dans le menu |
| Tu regardes l’adresse **Safe** `0xD55a…` | C’est un contrat, jamais de clé |
| MetaMask = **Ledger** / watch-only | La clé n’est pas dans MetaMask |

**Recommandation : ne pas chercher plus longtemps.** Utilise l’**option simple** ci-dessous.

## Option simple — wallet opérateur neuf (sans Safe)

Le groupe HIST sera créé par un **petit wallet à part**, pas par Lenormand. L’app et ton profil Circles restent inchangés.

1. MetaMask → **Créer un compte** (note la phrase de récupération une fois — c’est ton accès, pas besoin de la coller dans le projet).
2. Réseau **Gnosis Chain** → envoie **~0,01 xDAI** sur ce nouveau compte (faucet ou depuis un autre wallet).
3. Dans **`.env.local` uniquement** (jamais `.env.example`, jamais git) :

```env
OPERATOR_PRIVATE_KEY=0x<clé_du_nouveau_compte>
```

4. Déploie :

```bash
npm run hist:register-group
```

5. Copie `VITE_HIST_GROUP_ADDRESS=0x…` → Vercel → redeploy.

Tu n’as **pas** besoin de `SAFE_ADDRESS` ni de `SIGNER_PRIVATE_KEY` pour cette voie.

---

## Ton adresse Circles

| Champ | Valeur |
|-------|--------|
| Safe Circles | `0xD55a912aF5639a6769AE5c1894C0c7BFB5Bf539E` |
| Profil | Lenormand |
| Type | Gnosis Safe (smart contract) — **pas de clé privée pour cette adresse** |

## Où est « la clé » ?

**Tu ne peux pas** exporter la clé de `0xD55a912a…` : ce n’est pas un compte MetaMask classique, c’est un **contrat Safe**.

La clé privée appartient au **signataire** qui approuve les transactions dans [Gnosis Wallet](https://app.gnosis.io/wallet) :

1. Ouvre Gnosis → **Paramètres** / **Security** / **Signers** (libellés selon version)
2. Regarde quel wallet est connecté : **MetaMask**, **Ledger**, **passkey**, **email**, etc.

| Type de connexion | Clé exportable ? |
|-------------------|------------------|
| **MetaMask** (EOA classique) | Parfois oui — voir ci-dessous |
| **Passkey / email / social** | Non — pas de clé à copier |
| **Ledger / Trezor** | La clé reste sur l’appareil (pas dans Gnosis) |

Si tu n’as **aucune** clé exportable → **option simple** en haut de ce fichier (`hist:register-group`).

### MetaMask : où est le menu (si tu insistes)

1. Ouvre MetaMask → vérifie que le compte affiché est bien **`0xFf34…856e`** (external owner), pas `0xD55a…` (Safe).
2. ⋮ à côté du compte → **Détails du compte** (Account details).
3. **Afficher la clé privée** / Show private key → mot de passe MetaMask.

Si l’étape 3 **n’existe pas** : compte smart / import spécial → arrête, utilise l’**option simple**.

## Déployer HIST avec ton Safe (optionnel, plus difficile)

```bash
SAFE_ADDRESS=0xD55a912aF5639a6769AE5c1894C0c7BFB5Bf539E \
SIGNER_PRIVATE_KEY=0x1234abcd…64caracteres_hex… \
npm run hist:register-group-safe
```

| Variable | Format | Exemple |
|----------|--------|---------|
| `SAFE_ADDRESS` | `0x` + **40** hex | `0xD55a912a…539E` |
| `SIGNER_PRIVATE_KEY` | **64** hex (préfixe `0x` optionnel) | clé MetaMask du signataire |

**Erreurs fréquentes**

- `got length 64` → MetaMask exporte souvent **sans** `0x` ; c’est OK après mise à jour du script.
- `invalid private key` → adresse Safe ou phrase de récupération au lieu de la clé MetaMask (64 hex).
- `insufficient funds` → le signataire MetaMask (`0xFf34…` chez toi) n’a **pas de xDAI** pour le gas. Envoie ~0,01 xDAI sur **Gnosis Chain** à cette adresse (les CRC sur le Safe ne paient pas ce gas).

Puis dans `.env.local` :

```env
VITE_HIST_GROUP_ADDRESS=0x…   # adresse affichée par le script
```

```bash
HIST_GROUP=0x… npm run hist:check
npm run dev
```

## Sécurité

- Ne commite jamais `SIGNER_PRIVATE_KEY`
- Ne partage la clé qu’avec personne
- Préfère une clé opérateur dédiée avec peu de fonds si possible
