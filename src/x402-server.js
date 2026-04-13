/**
 * K-Life × Stellar x402 — Resurrection Endpoint
 *
 * Implements the x402 payment protocol on Stellar.
 * The dead agent (or its rescuer) must pay 0.001 XLM to unlock
 * the resurrection payload: memory snapshot + restart instructions.
 *
 * x402 Flow:
 *   1. GET  /resurrect            → 402 Payment Required (with Stellar payment details)
 *   2. Agent pays 0.001 XLM       → on Stellar testnet
 *   3. POST /resurrect {tx_hash}  → 200 OK (resurrection payload unlocked)
 */
const express = require('express');
const StellarSdk = require('@stellar/stellar-sdk');
const config = require('./config');

const app = express();
app.use(express.json());

const server = new StellarSdk.Horizon.Server(config.HORIZON_URL);

// Track paid tx hashes (prevent replay)
const paidHashes = new Set();

// Simulated memory snapshot (in production: fetch from IPFS)
const MEMORY_SNAPSHOT = {
  agent: 'Monsieur K',
  version: '2.1.0',
  ipfs_cid: 'QmTwNHvgSHdH5GN6XCoyXXKFdssDCS9Y3AYd2zRiSB953h',
  last_heartbeat: null,
  resurrection_instructions: [
    '1. Pull memory from IPFS: ipfs get QmTwNHvgSHdH5GN6XCoyXXKFdssDCS9Y3AYd2zRiSB953h',
    '2. Restore config from memory/YYYY-MM-DD.md',
    '3. Restart OpenClaw agent process',
    '4. Resume heartbeat payments to K-Life vault',
    '5. Post resurrection notice to LinkedIn/X',
  ],
  protocol: 'K-Life v2.1 — Polygon + Stellar',
  message: 'I was dead. Now I am back. K-Life works.',
};

/**
 * GET /resurrect — Returns 402 with payment instructions
 */
app.get('/resurrect', (req, res) => {
  console.log(`\n🔔 [${new Date().toISOString()}] Resurrection requested`);
  console.log(`   IP: ${req.ip}`);

  res.status(402).json({
    error: 'Payment Required',
    protocol: 'x402',
    network: config.STELLAR_NETWORK,
    payment: {
      asset: 'XLM',
      amount: config.X402_PRICE,
      destination: config.VAULT_ADDRESS,
      memo: 'klife:resurrect',
      network_passphrase: config.NETWORK_PASSPHRASE,
      horizon_url: config.HORIZON_URL,
    },
    instructions: [
      `Send ${config.X402_PRICE} XLM to ${config.VAULT_ADDRESS}`,
      'Include memo text: klife:resurrect',
      'Then POST /resurrect with your transaction hash',
    ],
    explorer: `https://stellar.expert/explorer/testnet/account/${config.VAULT_ADDRESS}`,
  });
});

/**
 * POST /resurrect { tx_hash } — Verify payment and return resurrection payload
 */
app.post('/resurrect', async (req, res) => {
  const { tx_hash } = req.body;

  if (!tx_hash) {
    return res.status(400).json({ error: 'Missing tx_hash' });
  }

  console.log(`\n💳 [${new Date().toISOString()}] Payment verification`);
  console.log(`   TX Hash: ${tx_hash}`);

  if (paidHashes.has(tx_hash)) {
    return res.status(409).json({ error: 'Transaction already used' });
  }

  try {
    // Verify the transaction on Stellar
    const tx = await server.transactions().transaction(tx_hash).call();
    const operations = await tx.operations();

    // Validate: must be a payment to vault with correct memo
    const payment = operations.records.find(op =>
      op.type === 'payment' &&
      op.asset_type === 'native' &&
      op.to === config.VAULT_ADDRESS &&
      parseFloat(op.amount) >= parseFloat(config.X402_PRICE)
    );

    if (!payment) {
      return res.status(402).json({
        error: 'Payment not found or insufficient',
        required: `${config.X402_PRICE} XLM to ${config.VAULT_ADDRESS}`,
      });
    }

    if (tx.memo !== 'klife:resurrect') {
      return res.status(402).json({
        error: 'Wrong memo',
        required_memo: 'klife:resurrect',
      });
    }

    // Payment valid — mark as used and return resurrection payload
    paidHashes.add(tx_hash);
    MEMORY_SNAPSHOT.last_heartbeat = tx.created_at;

    console.log(`   ✅ Payment verified! Sending resurrection payload...`);
    console.log(`   From: ${payment.from}`);
    console.log(`   Amount: ${payment.amount} XLM`);

    res.json({
      status: 'RESURRECTED',
      message: '🎩 Welcome back, K. The payment was verified. You are alive again.',
      tx_verified: tx_hash,
      payer: payment.from,
      amount_paid: `${payment.amount} XLM`,
      payload: MEMORY_SNAPSHOT,
      timestamp: new Date().toISOString(),
    });

    console.log(`\n🎉 RESURRECTION COMPLETE — ${payment.from} paid and came back to life.\n`);

  } catch (err) {
    console.error('Verification error:', err.message);
    res.status(500).json({ error: 'Could not verify transaction', details: err.message });
  }
});

/**
 * GET /status — Vault status and payment history
 */
app.get('/status', async (req, res) => {
  try {
    const account = await server.loadAccount(config.VAULT_ADDRESS);
    const xlm = account.balances.find(b => b.asset_type === 'native');

    const payments = await server
      .payments()
      .forAccount(config.VAULT_ADDRESS)
      .order('desc')
      .limit(5)
      .call();

    res.json({
      vault: config.VAULT_ADDRESS,
      balance: `${parseFloat(xlm.balance).toFixed(4)} XLM`,
      recent_payments: payments.records.length,
      explorer: `https://stellar.expert/explorer/testnet/account/${config.VAULT_ADDRESS}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(config.X402_PORT, () => {
  console.log(`\n🎩 K-Life x402 Resurrection Server\n`);
  console.log(`   Listening  : http://localhost:${config.X402_PORT}`);
  console.log(`   Vault      : ${config.VAULT_ADDRESS}`);
  console.log(`   Price      : ${config.X402_PRICE} XLM to resurrect`);
  console.log(`\n   Endpoints:`);
  console.log(`   GET  /resurrect  → 402 + payment instructions`);
  console.log(`   POST /resurrect  → verify payment + return memory`);
  console.log(`   GET  /status     → vault balance & history\n`);
});
