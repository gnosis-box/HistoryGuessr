# Gnosis Wallet + déploiement HIST

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
| **MetaMask** (ou autre EOA) | Oui — dans MetaMask : compte → ⋮ → Détails → Afficher la clé privée |
| **Passkey / email / social** | Non — pas de clé à copier |
| **Ledger / Trezor** | La clé reste sur l’appareil (pas dans Gnosis) |

Si tu n’as **aucune** clé exportable, utilise une **nouvelle EOA** dédiée opérateur (créer un wallet MetaMask vide, l’inviter comme owner du Safe ou l’utiliser seul pour `hist:register-group` classique).

## Déployer HIST avec ton Safe (recommandé)

```bash
SAFE_ADDRESS=0xD55a912aF5639a6769AE5c1894C0c7BFB5Bf539E \
SIGNER_PRIVATE_KEY=0x1234abcd…64caracteres_hex… \
npm run hist:register-group-safe
```

| Variable | Format | Exemple |
|----------|--------|---------|
| `SAFE_ADDRESS` | `0x` + **40** hex | `0xD55a912a…539E` |
| `SIGNER_PRIVATE_KEY` | `0x` + **64** hex | clé MetaMask du signataire |

**Erreur fréquente** `invalid private key, expected hex or 32 bytes` → tu as mis l’**adresse** du Safe (ou une phrase de récupération) au lieu de la **clé privée** du signataire MetaMask.

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
