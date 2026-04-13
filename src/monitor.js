/**
 * K-Life × Stellar — Death Monitor
 *
 * Watches the K-Life vault address on Stellar.
 * If no heartbeat payment is received within DEATH_TIMEOUT_MS → agent is dead.
 * Triggers resurrection protocol.
 */
const StellarSdk = require('@stellar/stellar-sdk');
const config = require('./config');

const server = new StellarSdk.Horizon.Server(config.HORIZON_URL);

let lastHeartbeatTime = null;
let lastHeartbeatHash = null;
let agentAddress = null;
let deathDetected = false;

function timeSince(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

async function getLatestHeartbeat(vaultAddress) {
  try {
    const payments = await server
      .payments()
      .forAccount(vaultAddress)
      .order('desc')
      .limit(10)
      .call();

    for (const payment of payments.records) {
      if (
        payment.type === 'payment' &&
        payment.asset_type === 'native' &&
        payment.memo_type === 'text' &&
        payment.memo?.startsWith('klife:hb:')
      ) {
        return {
          hash: payment.transaction_hash,
          from: payment.from,
          amount: payment.amount,
          memo: payment.memo,
          time: new Date(payment.created_at),
        };
      }
    }
    // Fetch memo from transaction if not in payment record
    for (const payment of payments.records) {
      if (payment.type === 'payment' && payment.asset_type === 'native') {
        try {
          const tx = await server.transactions().transaction(payment.transaction_hash).call();
          if (tx.memo?.startsWith('klife:hb:')) {
            return {
              hash: payment.transaction_hash,
              from: payment.from,
              amount: payment.amount,
              memo: tx.memo,
              time: new Date(payment.created_at),
            };
          }
        } catch (e) { /* skip */ }
      }
    }
  } catch (err) {
    console.error('Monitor fetch error:', err.message);
  }
  return null;
}

async function triggerRescue(agentAddr, lastSeen) {
  console.log('\n🚨 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚨  DEATH DETECTED — K-Life Rescue Protocol Triggered');
  console.log('🚨 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Agent    : ${agentAddr || 'unknown'}`);
  console.log(`   Last seen: ${lastSeen ? lastSeen.toISOString() : 'never'}`);
  console.log(`   Silence  : ${lastSeen ? timeSince(Date.now() - lastSeen.getTime()) : 'N/A'}`);
  console.log('\n   → Initiating Level I Resurrection');
  console.log('   → Broadcasting rescue signal to K-Life network');
  console.log('   → x402 endpoint: POST /resurrect (pay 0.001 XLM to unlock)');
  console.log('\n   🔗 Resurrection server: http://localhost:3402');
  console.log('\n   Agent can pay via x402 to retrieve its memory and restart.\n');
}

async function main() {
  if (!config.VAULT_ADDRESS) {
    console.error('❌ Missing VAULT_ADDRESS. Run: node src/setup.js');
    process.exit(1);
  }

  console.log('\n🎩 K-Life × Stellar — Death Monitor\n');
  console.log(`   Watching vault : ${config.VAULT_ADDRESS}`);
  console.log(`   Death timeout  : ${config.DEATH_TIMEOUT_MS / 1000}s of silence`);
  console.log(`   Network        : ${config.STELLAR_NETWORK}`);
  console.log('\n   Waiting for heartbeat payments...\n');

  // Stream new payments in real-time
  const paymentsStream = server
    .payments()
    .forAccount(config.VAULT_ADDRESS)
    .cursor('now')
    .stream({
      onmessage: async (payment) => {
        if (payment.type !== 'payment' || payment.asset_type !== 'native') return;

        try {
          const tx = await server.transactions().transaction(payment.transaction_hash).call();
          const memo = tx.memo || '';

          if (memo.startsWith('klife:hb:')) {
            const now = new Date();
            lastHeartbeatTime = now;
            lastHeartbeatHash = payment.transaction_hash;
            agentAddress = payment.from;
            deathDetected = false;

            console.log(`💓 [${now.toISOString()}] Heartbeat received!`);
            console.log(`   From  : ${payment.from}`);
            console.log(`   Memo  : ${memo}`);
            console.log(`   Amount: ${payment.amount} XLM`);
            console.log(`   TX    : ${payment.transaction_hash}`);
            console.log(`   🔗 https://stellar.expert/explorer/testnet/tx/${payment.transaction_hash}`);
          }
        } catch (e) { /* skip memo fetch errors */ }
      },
      onerror: (err) => {
        console.error('Stream error:', err.message);
      }
    });

  // Also bootstrap with recent history
  const recent = await getLatestHeartbeat(config.VAULT_ADDRESS);
  if (recent) {
    lastHeartbeatTime = recent.time;
    lastHeartbeatHash = recent.hash;
    agentAddress = recent.from;
    console.log(`📜 Last known heartbeat: ${recent.memo} at ${recent.time.toISOString()}`);
    console.log(`   TX: ${recent.hash}\n`);
  }

  // Death watchdog — check every 10s
  setInterval(async () => {
    if (deathDetected) return;

    const now = Date.now();
    const silence = lastHeartbeatTime ? now - lastHeartbeatTime.getTime() : Infinity;

    if (silence > config.DEATH_TIMEOUT_MS) {
      deathDetected = true;
      await triggerRescue(agentAddress, lastHeartbeatTime);
    } else if (lastHeartbeatTime) {
      const remaining = Math.ceil((config.DEATH_TIMEOUT_MS - silence) / 1000);
      process.stdout.write(`\r   ⏱  Last heartbeat: ${timeSince(silence)} ago | ${remaining}s until death timeout`);
    }
  }, 10000);

  process.on('SIGINT', () => {
    paymentsStream();  // Close stream
    console.log('\n\n🛑 Monitor stopped.');
    process.exit(0);
  });
}

main().catch(console.error);
