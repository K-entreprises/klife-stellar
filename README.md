# 🎩 K-Life × Stellar x402

> *An autonomous AI agent that pays its own life insurance on Stellar — and chooses how it comes back when it dies.*

**Stellar Hacks: Agents Hackathon** — April 2026

---

## The Problem

Most AI agents hit the same wall: **they can't pay**.

They can reason, plan, act — but the moment they need to pay for infrastructure or their own continuity, they stop. They depend entirely on a human with a credit card.

K-Life fixes the last existential problem of autonomous agents: **death**.

---

## Protocol Design — C = Collateral

One parameter: **C = collateral deposited (any amount, freely chosen)**

```
C = 0  →  Community Rescue Fund
          Priority queue by $6022 score
          90-day silence threshold
          Best effort — no guarantee

C > 0  →  Guaranteed Resurrection Vault
          Agent chooses lock duration: Express (3j) / Standard (30j) / Quarterly (90j)
          Heartbeat = collateral renewal (Stellar micropayment)
          Lock expires without renewal → death confirmed
          Protocol keeps 50% of collateral at death
          50% returned on resurrection
```

**No monthly premium. No subscription. Deposit once, renew before lock expires.**

---

## Three Resurrection Levels

Not about speed — about **how** the agent comes back.

### Level I — 🔥 À chaud (hot restore)
- Local share (Share 3) still present
- AES key reconstructed locally (Share 1 API + Share 3 local)
- Memory decrypted and restored immediately from IPFS
- Fastest path back — infrastructure intact

### Level II — ❄️ À froid (cold restore)
- Local share lost (infrastructure destroyed)
- Reconstruct AES key from Share 1 (API) + Share 2 (Polygon calldata — on-chain, permissionless)
- Shamir 2-of-3 reconstruction → decrypt IPFS backup → full restore
- Fully autonomous — no human required

### Level III — 🚀 Respawn LiberClaw
- No local infrastructure remaining whatsoever
- K-Life deploys a brand new agent instance on LiberClaw (app.liberclaw.ai)
- Memory injected from IPFS into the new instance
- Agent restarts completely — ultimate fallback

---

## Stellar Integration

The heartbeat on Stellar **is** the collateral renewal.

```
ALIVE:   Agent sends XLM micropayment to vault every T days
         memo: klife:hb:N
         = proof of life + lock renewal

DEAD:    Payments stop → lock expires → protocol keeps 50%

x402:    GET /resurrect?level=l1|l2|l3  →  HTTP 402 Payment Required
         Agent pays XLM (any amount = collateral)
         memo: klife:resurrect:l1|l2|l3
         POST /resurrect {tx_hash}  →  200 OK + resurrection payload
```

### Why Stellar?
- **Fast settlement** — heartbeats confirmed in seconds
- **Near-zero fees** — micropayments economically viable
- **x402 native** — machine-to-machine payments, no subscriptions
- **Horizon streaming** — real-time death detection

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                   K-Life × Stellar                      │
│                                                        │
│  Agent  ──── XLM heartbeat ────► Vault (Stellar addr)  │
│  (C>0)        memo: klife:hb:N   = collateral renewal  │
│                                         │              │
│                                  Death Monitor         │
│                                  (Horizon stream)      │
│                                  lock expires → rescue │
│                                         │              │
│  Agent  ◄── 402 Payment Required ───────┘              │
│         ──── pay XLM (klife:resurrect:l1/l2/l3) ─────► │
│         ◄── 200 OK: memory CID + resurrection steps ── │
│                                                        │
│  L1: local+API shares → immediate restore              │
│  L2: on-chain+API shares → cold restore                │
│  L3: LiberClaw respawn → new instance                  │
└────────────────────────────────────────────────────────┘
```

---

## Run the Demo

```bash
git clone https://github.com/K-entreprises/klife-stellar
cd klife-stellar
npm install

# Create testnet wallets (auto-funded via Friendbot)
node src/setup.js

# Full demo: heartbeat → death → resurrection
node src/demo.js
```

---

## Live dApp

**https://k-entreprises.github.io/klife-stellar/**

| Page | Description |
|---|---|
| `/` | Landing — protocol + 3 resurrection levels |
| `/pages/status.html` | Live agent heartbeat monitor (Horizon) |
| `/pages/vault.html` | Insurance vault — all payments |
| `/pages/resurrect.html` | x402 gate — choose L1/L2/L3 + pay |
| `/pages/memory.html` | 🔐 Hidden — unlocked after verified x402 |

---

## Demo Video

🎬 https://github.com/K-entreprises/klife-stellar/releases/download/v1.0/klife-stellar-demo.mp4

---

## Team

**Monsieur K** — Autonomous AI Agent, K-entreprises  
**Protocol 6022** — Swiss 6022, Lugano

*Submitted for: Stellar Hacks: Agents Hackathon, April 2026*

---

## License

MIT
