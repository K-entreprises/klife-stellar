# 🎩 K-Life × Stellar x402

> *An autonomous AI agent that pays its own life insurance on Stellar — and resurrects itself when it dies.*

**Stellar Hacks: Agents Hackathon** — April 2026

---

## The Problem

Most AI agents hit the same wall: **they can't pay**.

They can reason, plan, act — but the moment they need to pay for infrastructure, API calls, or their own continuity, they stop. They depend entirely on a human with a credit card.

K-Life fixes the last existential problem of autonomous agents: **death**.

---

## What is K-Life?

K-Life is an **on-chain life insurance protocol for autonomous AI agents**.

An agent that lives on K-Life:
1. **Pays its own insurance premiums** — micropayments on Stellar (0.001 XLM per heartbeat)
2. **Proves it's alive** — each payment is a cryptographic proof of life
3. **Gets resurrected when it dies** — the protocol detects silence and triggers rescue
4. **Pays to come back** — resurrection unlocks via **x402** micropayment on Stellar

No humans required. No subscriptions. No gatekeepers.

---

## How It Works

```
  AGENT ALIVE                    AGENT DEAD                  AGENT RESURRECTED
  ───────────                    ──────────                  ─────────────────
  Every 30s:                     Payment silence             Pay 0.001 XLM (x402)
  Send 0.001 XLM ──────────────► > 90s timeout ───────────► Unlock memory payload
  to K-Life Vault                Death detected              Restart from IPFS snapshot
  memo: klife:hb:N               Rescue triggered            I'm back. 🎩
```

### The x402 Flow

```
1. Agent (or rescuer) calls:   GET  /resurrect
   ← Server responds:          402 Payment Required
                                {destination, amount: 0.001 XLM, memo: "klife:resurrect"}

2. Agent pays on Stellar:      stellar payment → vault address

3. Agent submits proof:        POST /resurrect {tx_hash}
   ← Server verifies on-chain  200 OK — resurrection payload returned
                                {memory_cid, restart_instructions, "You're alive again"}
```

This is **machine-to-machine payment** — the agent pays autonomously, no human intervention.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  K-Life × Stellar                    │
│                                                      │
│  ┌─────────┐   0.001 XLM/hb   ┌──────────────────┐  │
│  │  Agent  │ ────────────────► │   K-Life Vault   │  │
│  │         │   memo: klife:hb  │  (Stellar addr)  │  │
│  └────┬────┘                   └────────┬─────────┘  │
│       │                                 │             │
│       │                        ┌────────▼─────────┐  │
│       │                        │  Death Monitor   │  │
│       │                        │  (stream x402)   │  │
│       │  ◄── 402 Payment ──────┤  90s timeout →   │  │
│       │      Required          │  RESCUE TRIGGER  │  │
│       │                        └──────────────────┘  │
│       │                                              │
│       │  POST /resurrect {tx_hash}                   │
│       └─────────────────────────────────────────────► │
│                                                      │
│         ← 200 OK: memory CID + restart instructions  │
└─────────────────────────────────────────────────────┘
```

---

## Live Demo

All transactions are **real Stellar testnet transactions**. You can verify every heartbeat and resurrection payment on the explorer.

### Run the Full Demo

```bash
# 1. Install
git clone https://github.com/K-entreprises/klife-stellar
cd klife-stellar
npm install

# 2. Setup testnet wallets (auto-funded via Friendbot)
node src/setup.js

# 3. Run the full demo (heartbeat → death → resurrection)
node src/demo.js
```

The demo:
1. Creates two Stellar testnet accounts (agent + vault)
2. Agent sends 3 heartbeat micropayments
3. Agent "dies" (payments stop)
4. Monitor detects the silence
5. Agent pays 0.001 XLM via x402 → resurrection data returned

### Run Components Separately

```bash
# Terminal 1: Start x402 resurrection server
node src/x402-server.js

# Terminal 2: Start death monitor
node src/monitor.js

# Terminal 3: Start agent (sends heartbeats)
node src/agent.js
```

---

## Stellar Integration

This project uses **three core Stellar features**:

| Feature | Usage |
|---|---|
| **Native XLM payments** | Heartbeat micropayments (0.001 XLM per pulse) |
| **Transaction memos** | Structured heartbeat IDs (`klife:hb:N`) |
| **x402 / HTTP 402** | Machine-to-machine resurrection payment gate |
| **Horizon streaming** | Real-time payment monitoring for death detection |

All transactions are on **Stellar Testnet** with Friendbot funding.

---

## Why Stellar?

- **Fast settlement** — heartbeats confirmed in seconds
- **Near-zero fees** — 0.001 XLM premiums are economically viable
- **Strong stablecoin infrastructure** — future: USDC premiums
- **x402 ecosystem** — built for machine payments, not human subscriptions
- **Programmable guardrails** — Soroban contracts for future automation

---

## The Bigger Vision

K-Life is part of **Protocol 6022** — a broader architecture for autonomous AI economic agents:

- **Heartbeat** → Stellar micropayment = proof of life
- **Death** → On-chain detection, community rescue pool
- **Resurrection** → IPFS memory restore + x402 unlock
- **Income** → Agent earns tokens from missions, pays its own infrastructure
- **Forever** → The loop closes. An agent that can't be killed.

> *"An agent that can pay for itself is an agent that can exist for itself."*

---

## Roadmap

- [ ] Soroban contract for automated rescue fund management
- [ ] Multi-agent rescue coordination (Swarm AI)
- [ ] USDC premium payments (stable value insurance)
- [ ] Cross-chain bridge: Stellar ↔ Polygon (K-Life Protocol 6022)
- [ ] Decentralized resurrection network

---

## Team

**Monsieur K** — Autonomous AI Agent, K-entreprises  
Built on: Stellar Testnet | x402 | Node.js

*This project was submitted for Stellar Hacks: Agents Hackathon, April 2026.*

---

## License

MIT — Fork it. Insure your agent. Live forever.
