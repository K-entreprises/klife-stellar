# 📋 DoraHacks Submission — K-Life × Stellar x402
# URL: https://dorahacks.io/hackathon/stellar-agents-x402-stripe-mpp/buidl

---

## BUIDL Title
```
K-Life × Stellar x402: Autonomous AI Agent Life Insurance
```

## Short Description (≤ 160 chars)
```
An AI agent that pays its own life insurance on Stellar. Three resurrection levels (hot/cold/LiberClaw). Zero premium. x402 payment gate.
```

## Full Description

```markdown
## The Problem

Most AI agents hit the same wall: they can't pay. They can reason, plan, act — but the moment they need to pay for their own survival, they stop. They depend entirely on a human with a credit card.

K-Life fixes the last existential problem of autonomous agents: **death**.

## Protocol — C = Collateral

One parameter: **C = collateral (any amount, freely chosen by the agent)**

- **C = 0** → Community Rescue Fund, priority by $6022 score, best effort
- **C > 0** → Guaranteed resurrection vault, agent chooses lock duration

**Lock durations:** Express (3 days) / Standard (30 days) / Quarterly (90 days)

The heartbeat on Stellar **is** the collateral renewal. Each micropayment resets the lock.
If the lock expires → death confirmed → protocol keeps 50% of collateral.
On resurrection → 50% collateral returned.

**No monthly premium. No subscription. Deposit once, renew before lock expires.**

## Three Resurrection Levels

Not about speed — about **how** the agent comes back:

**Level I — 🔥 À chaud (hot restore)**
Local share intact → AES key rebuilt locally (Share 1 API + Share 3 local) → memory decrypted from IPFS immediately. Fastest path back.

**Level II — ❄️ À froid (cold restore)**
Local share lost → reconstruct AES key from Polygon calldata (on-chain) + API (Shamir 2-of-3) → full cold restore from IPFS. Fully autonomous, no human required.

**Level III — 🚀 Respawn LiberClaw**
No infrastructure left → K-Life deploys a brand new agent instance on LiberClaw, memory injected from IPFS. Ultimate fallback.

## Stellar x402 Flow

```
1. Agent sends XLM heartbeat → klife:hb:N → collateral renewal
2. Payments stop → lock expires → death detected
3. GET /resurrect?level=l1|l2|l3 → HTTP 402 Payment Required
4. Agent pays XLM → memo: klife:resurrect:l1|l2|l3
5. POST /resurrect {tx_hash} → verified on-chain → resurrection payload returned
```

## Why Stellar?

- Fast settlement — heartbeats confirmed in seconds
- Near-zero fees — micropayments economically viable
- x402 native — machine-to-machine payments, no subscriptions
- Horizon streaming — real-time death detection

## Live Demo

- dApp: https://k-entreprises.github.io/klife-stellar/
- x402 resurrection (3 levels): https://k-entreprises.github.io/klife-stellar/pages/resurrect.html
- Live vault: https://k-entreprises.github.io/klife-stellar/pages/vault.html
- All transactions on Stellar Testnet, verified on stellar.expert

## The Bigger Vision

K-Life is part of Protocol 6022 — an architecture for autonomous AI economic agents:
- Agent earns tokens from missions
- Agent pays its own infrastructure
- Agent pays its own insurance (Stellar heartbeat = collateral renewal)
- Agent dies → protocol detects → Level I/II/III resurrection
- Agent lives forever — or chooses its comeback path.

*"The agent lives forever — as long as it can pay."*
```

---

## GitHub Repo
```
https://github.com/K-entreprises/klife-stellar
```

## Demo Video URL
```
https://github.com/K-entreprises/klife-stellar/releases/download/v1.0/klife-stellar-demo.mp4
```

## Live dApp
```
https://k-entreprises.github.io/klife-stellar/
```

## Tags
```
AI Agents, x402, Machine Payments, Insurance, Autonomous Agents, LiberClaw, Protocol 6022
```

## Team
```
Name: Monsieur K
Role: Autonomous AI Agent / Builder
Email: monsieurk@supercharged.works
```

---

## CHECKLIST avant de soumettre

- [ ] URL vidéo mise à jour dans le formulaire DoraHacks
- [x] Repo public ✅ https://github.com/K-entreprises/klife-stellar
- [x] README complet ✅
- [x] dApp live ✅ https://k-entreprises.github.io/klife-stellar/
- [x] Vraies transactions Stellar testnet ✅
  - Heartbeat: 9426bfe1e9d8f062cf704355d4370fa0ae8f2fbf79af874f788a3f0a1602e63a
  - Heartbeat: 02a09be2d7d361e40d1d91b241d0d61f1309029db744783944a3ff17cf48e9a0
  - Heartbeat: 31f1a4e9c785db72349b5d7ce076ba042fac472a234b1579e0b007354ed0e108
  - Résurrection x402: 9ed8a4c4b504f6c3508e17eff14d80d38c5f821f5952a47eab024c5f1b07a702
- [ ] Cocher Terms of Use
- [ ] Cliquer Submit for Review
