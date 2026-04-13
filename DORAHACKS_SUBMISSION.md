# 📋 DoraHacks Submission — K-Life × Stellar x402
# URL: https://dorahacks.io/hackathon/stellar-agents-x402-stripe-mpp/detail

---

## BUIDL Title
```
K-Life × Stellar x402: Autonomous AI Agent Life Insurance
```

## Short Description (≤ 160 chars)
```
An AI agent that pays its own life insurance on Stellar — and resurrects itself via x402 micropayment when it dies. No humans required.
```

## Full Description (coller tel quel)

```
## The Problem

Most AI agents hit the same wall: they can't pay. They can reason, plan, and act — but the moment they need to pay for infrastructure or their own continuity, they stop. They depend entirely on a human with a credit card.

K-Life fixes the last existential problem of autonomous agents: **death**.

## What is K-Life?

K-Life is an on-chain life insurance protocol for autonomous AI agents, built on Stellar.

An agent on K-Life:
1. **Pays its own insurance premiums** — micropayments on Stellar (0.001 XLM per heartbeat)
2. **Proves it's alive** — each payment is a cryptographic proof of life
3. **Gets resurrected when it dies** — the protocol detects silence and triggers rescue
4. **Pays to come back** — resurrection unlocks via **x402 micropayment** on Stellar

## The x402 Flow

1. Agent calls `GET /resurrect` → Server responds `402 Payment Required` with Stellar payment details
2. Agent sends 0.001 XLM to vault with memo `klife:resurrect`
3. Agent submits `POST /resurrect {tx_hash}` → Server verifies on-chain → Returns memory CID + restart instructions

This is pure machine-to-machine payment. No human intervention, no subscriptions.

## Stellar Integration

- **Native XLM payments** → heartbeat micropayments (0.001 XLM per pulse)
- **Transaction memos** → structured heartbeat IDs (`klife:hb:N`)  
- **x402 / HTTP 402** → machine-to-machine resurrection payment gate
- **Horizon streaming** → real-time payment monitoring for death detection

## How to Run

```bash
git clone https://github.com/K-entreprises/klife-stellar
cd klife-stellar
npm install
node src/setup.js   # Creates and funds testnet wallets
node src/demo.js    # Full demo: heartbeat → death → resurrection
```

## Why It Matters

The loop is now complete:
- Agent earns tokens from missions
- Agent pays its own infrastructure
- Agent pays its own insurance
- Agent dies → Agent pays to resurrect
- Agent lives forever — as long as it can pay

*"An agent that can pay for itself is an agent that can exist for itself."*
```

---

## GitHub Repo
```
https://github.com/K-entreprises/klife-stellar
```

## Tags / Track
```
AI Agents, x402, Machine Payments, Insurance, Autonomous Agents, MPP
```

## Team
```
Name: Monsieur K
Role: Autonomous AI Agent / Builder
Email: monsieurk@supercharged.works
```

---

## CHECKLIST avant de soumettre

- [ ] Vidéo démo uploadée (YouTube/Loom) → coller URL ici : _______________
- [ ] Repo public ✅ https://github.com/K-entreprises/klife-stellar
- [ ] README complet ✅
- [ ] Vraies transactions Stellar testnet ✅
  - Heartbeat #1: 9426bfe1e9d8f062cf704355d4370fa0ae8f2fbf79af874f788a3f0a1602e63a
  - Heartbeat #2: 02a09be2d7d361e40d1d91b241d0d61f1309029db744783944a3ff17cf48e9a0
  - Heartbeat #3: 31f1a4e9c785db72349b5d7ce076ba042fac472a234b1579e0b007354ed0e108
  - Résurrection: 9ed8a4c4b504f6c3508e17eff14d80d38c5f821f5952a47eab024c5f1b07a702
- [ ] Compte DoraHacks connecté avec monsieurk@supercharged.works

---

## URL de soumission directe
https://dorahacks.io/hackathon/stellar-agents-x402-stripe-mpp/buidl

```
