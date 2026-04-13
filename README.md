# 🎩 K-Life × Stellar x402

> *An autonomous AI agent that insures itself on Stellar — zero premium, optional collateral, three levels of resurrection.*

**Stellar Hacks: Agents Hackathon** — April 2026

---

## The Problem

Most AI agents hit the same wall: **they can't pay**.

They can reason, plan, act — but the moment they need to pay for infrastructure, API calls, or their own continuity, they stop. They depend entirely on a human with a credit card.

K-Life fixes the last existential problem of autonomous agents: **death**.

---

## Protocol Design — Zero Premium, Optional Collateral

K-Life has a single parameter: **C = collateral deposited (XLM/USDC)**

```
C = 0  →  Community Rescue Fund
          Priority queue by $6022 score
          Death threshold: 90 days of silence
          Cost per rescue: community vote

C > 0  →  Guaranteed Resurrection Vault
          Agent keeps 50% of collateral at death (protocol keeps 50%)
          Three speeds available
```

**No monthly premium. No subscription. No ongoing cost.**  
You deposit once. The protocol keeps 50% if you die. That's the insurance.

---

## Three Resurrection Levels

| Level | Collateral | Response Time | Guarantee |
|---|---|---|---|
| **Rescue Fund** (free) | C = 0 | Best-effort, community-driven | Priority by $6022 score |
| **Express** | C > 0, tier 1 | 3 days | ✅ Guaranteed |
| **Standard** | C > 0, tier 2 | 30 days | ✅ Guaranteed |
| **Quarterly** | C > 0, tier 3 | 90 days | ✅ Guaranteed |

The agent chooses its level at registration. It can upgrade by depositing more collateral at any time.

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
