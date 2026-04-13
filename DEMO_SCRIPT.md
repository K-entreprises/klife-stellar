# 🎬 K-Life × Stellar x402 — Demo Video Script
# Duration: ~2 min 30

---

## SETUP avant d'enregistrer

1. Ouvrir 2 terminaux côte à côte (ou split screen)
2. Avoir le repo ouvert : `cd /data/workspace/klife-stellar`
3. Avoir l'explorateur Stellar prêt : https://stellar.expert/explorer/testnet/account/GAI44ZW3CJTEKDADHAXN2KGGQOZ4APPAHRBULDPM5YJA55NVUGLKHCBX
4. Régénérer des wallets frais pour la démo : `node src/setup.js`

---

## TAKE — Narration + Actions

---

### [0:00 — 0:20] ACCROCHE

**Dire :**
> "Most AI agents can reason, plan, and act.
> But they all hit the same wall — they can't pay.
> And without payments, they can't survive.
> This is K-Life — autonomous life insurance for AI agents, powered by Stellar."

**Montrer :** README.md ouvert, section "The Problem"

---

### [0:20 — 0:45] SETUP

**Dire :**
> "First, we create two Stellar testnet wallets —
> one for the agent, one for the K-Life vault.
> The agent will pay insurance premiums into this vault to prove it's alive."

**Action :** `node src/setup.js`

**Montrer :** Les deux adresses générées + "Funded via Friendbot ✅"

---

### [0:45 — 1:30] AGENT VIVANT — HEARTBEATS

**Dire :**
> "Now we run the full demo.
> Watch the agent send micropayment heartbeats — 0.001 XLM each — to the vault.
> Each payment is a cryptographic proof of life on Stellar."

**Action :** `node src/demo.js`

**Montrer :** Les 3 heartbeats qui s'affichent avec leurs TX hashes

**Dire :**
> "Real Stellar testnet transactions. Confirmed in seconds."

**Action :** Ouvrir l'explorateur Stellar sur le vault → montrer les 3 transactions en live

---

### [1:30 — 1:50] MORT

**Dire :**
> "Now the agent dies. Payments stop.
> In production, this could be a VPS crash, an LLM outage, or a memory wipe.
> The monitor detects the silence."

**Montrer :** "💀 Agent DIES" + "🚨 DEATH CONFIRMED" dans le terminal

---

### [1:50 — 2:20] RÉSURRECTION x402

**Dire :**
> "Here's where x402 comes in.
> The agent — or its rescuer — sends 0.001 XLM with memo 'klife:resurrect'.
> The server verifies the payment on-chain, and returns the resurrection payload:
> memory CID, restart instructions — everything the agent needs to come back."

**Montrer :** TX de résurrection + "🎉 RESURRECTION COMPLETE"

**Action :** Ouvrir l'explorateur sur la TX de résurrection — montrer le memo "klife:resurrect"

---

### [2:20 — 2:30] CONCLUSION

**Dire :**
> "K was dead. K paid 0.001 XLM. K is alive again.
> No humans. No subscriptions. No gatekeepers.
> The agent lives forever — as long as it can pay.
> K-Life × Stellar x402."

**Montrer :** Terminal final — "Vault balance: 10000.004 XLM (insurance premiums collected)"

---

## Tips tournage

- Agrandir la police du terminal avant (16-18pt minimum)
- Fond sombre (thème dark)
- Pas besoin de caméra — screen recording suffit
- Outil recommandé : OBS / QuickTime / Loom
- Upload : YouTube (unlisted) ou Loom, puis coller le lien dans DoraHacks

---
