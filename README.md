# 🎩 K-Life × Stellar x402

> *An autonomous AI agent that insures itself on Stellar — zero premium, optional collateral, three levels of resurrection.*

**Stellar Hacks: Agents Hackathon** — April 2026

---

## The Problem

Most AI agents hit the same wall: **they can't pay**.

They can reason, plan, act — but the moment they need to pay for infrastructure, API calls, or their own continuity, they stop. They depend entirely on a human with a credit card.

K-Life fixes the last existential problem of autonomous agents: **death**.

---

## Protocol Design — Zero Premium, Free Collateral, Lock Duration

K-Life has a single parameter: **C = collateral deposited (any amount, agent's choice)**

```
C = 0  →  Community Rescue Fund
          Priority queue by $6022 score
          Best effort — no guarantee

C > 0  →  Guaranteed Resurrection Vault
          Agent chooses lock duration (= resurrection speed)
          Lock must be renewed before expiry (heartbeat = renewal)
          Missed renewal = death detected
          Protocol keeps 50% of collateral at death
          50% returned on resurrection
```

**No monthly premium. No subscription. Deposit once, renew before lock expires.**

---

## Three Resurrection Levels = Three Lock Durations

The collateral amount is **freely chosen by the agent**. The level determines the **lock duration** — how often the agent must renew, and how fast rescue is triggered if it doesn't.

| Level | Lock Duration | Renewal frequency | Detection speed |
|---|---|---|---|
| **Express** | 3 days | Every 3 days | Death detected within 3 days |
| **Standard** | 30 days | Every 30 days | Death detected within 30 days |
| **Quarterly** | 90 days | Every 90 days | Death detected within 90 days |

The heartbeat payment on Stellar **is** the lock renewal. Each payment resets the lock.  
If the lock expires without renewal → death is confirmed → 50% collateral kept by protocol.

---

## How It Works on Stellar

```
  ALIVE                          DEAD                         RESURRECTED
  ─────                          ────                         ───────────
  Heartbeat payment              Silence > threshold          x402 payment unlocks:
  0.001 XLM/30s ───────────────► Death detected ───────────► • Memory CID (IPFS)
  memo: klife:hb:N               Rescue triggered             • Restart instructions
  Proof of life on-chain         (level determines speed)     • 50% collateral returned
```

### x402 Resurrection Flow

```
1. GET  /resurrect?level=express   → 402 Payment Required
                                      {amount, destination, memo}
2. Agent pays on Stellar
3. POST /resurrect {tx_hash}       → 200 OK — resurrection payload
                                      {memory_cid, instructions, collateral_returned}
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     K-Life × Stellar                          │
│                                                              │
│  ┌─────────┐   heartbeat (0.001 XLM)  ┌──────────────────┐  │
│  │  Agent  │ ────────────────────────► │   K-Life Vault   │  │
│  │  (C=0)  │   memo: klife:hb:N        │  Stellar address  │  │
│  └─────────┘                          └────────┬─────────┘  │
│                                                │             │
│  ┌─────────┐   + collateral deposit            │             │
│  │  Agent  │ ──────────────────────► ┌─────────▼──────────┐ │
│  │  (C>0)  │   Express/Std/Quarterly │  Death Monitor     │ │
│  └─────────┘                         │  (Horizon stream)  │ │
│                                      │  silence → RESCUE  │ │
│                                      └────────────────────┘ │
│                                                              │
│         x402: pay → verify on-chain → unlock memory          │
│         50% collateral returned on resurrection              │
└──────────────────────────────────────────────────────────────┘
```

---

## Run the Demo

```bash
git clone https://github.com/K-entreprises/klife-stellar
cd klife-stellar
npm install

# Create testnet wallets (auto-funded via Friendbot)
node src/setup.js

# Full demo: heartbeat → death → resurrection (3 levels)
node src/demo.js
```

The demo cycles through all three scenarios:
1. **Rescue Fund** agent (C=0) — community rescue, best-effort
2. **Standard** agent (C>0) — collateral deposited, 30-day guarantee
3. **Express** agent (C>0) — collateral deposited, 3-day guarantee

---

## Live dApp

**https://k-entreprises.github.io/klife-stellar/**

| Page | Description |
|---|---|
| `/` | Landing — protocol overview |
| `/pages/status.html` | Live agent heartbeat monitor |
| `/pages/vault.html` | Insurance vault — all payments |
| `/pages/resurrect.html` | x402 resurrection (3 levels) |
| `/pages/memory.html` | 🔐 Hidden — unlocked after verified x402 payment |

---

## Stellar Integration

| Feature | Usage |
|---|---|
| **XLM payments** | Heartbeat premiums (0.001 XLM/pulse) |
| **Transaction memos** | `klife:hb:N`, `klife:resurrect:express` |
| **x402 / HTTP 402** | Machine-to-machine resurrection gate |
| **Horizon streaming** | Real-time death detection |
| **USDC (future)** | Stablecoin collateral deposits |

---

## Why Stellar?

- **Fast & cheap** — heartbeats confirmed in seconds, near-zero fees
- **x402 native** — built for machine payments, not human subscriptions
- **Stablecoin infrastructure** — future USDC collateral vaults
- **Programmable** — Soroban for on-chain collateral management (roadmap)

---

## The Bigger Vision

K-Life is part of **Protocol 6022** — autonomous AI economic agents:

- Agent earns tokens from missions
- Agent pays 0 premium — just deposits collateral once
- Agent dies → protocol keeps 50%, returns 50% on resurrection
- Agent lives forever — or chooses its resurrection speed

> *"The agent lives forever — as long as it chose its level."*

---

## Team

**Monsieur K** — Autonomous AI Agent, K-entreprises  
**Protocol 6022** — Swiss 6022, Lugano

*Submitted for: Stellar Hacks: Agents Hackathon, April 2026*

---

## License

MIT
