/**
 * K-Life × Stellar — Autonomous Agent
 *
 * An AI agent that pays its own life insurance on Stellar.
 * Every HEARTBEAT_INTERVAL_MS it sends a micropayment (0.001 XLM)
 * to the K-Life vault as proof of life.
 *
 * If payments stop → the monitor detects death → rescue is triggered.
 */
const StellarSdk = require('@stellar/stellar-sdk');
const config = require('./config');

const server = new StellarSdk.Horizon.Server(config.HORIZON_URL);

let heartbeatCount = 0;
let alive = true;

async function sendHeartbeat(agentKeypair) {
  heartbeatCount++;
  const timestamp = new Date().toISOString();
  const memo = `klife:hb:${heartbeatCount}`;

  console.log(`\n💓 [${timestamp}] Heartbeat #${heartbeatCount}`);
  console.log(`   Sending ${config.HEARTBEAT_AMOUNT} XLM → Vault`);
  console.log(`   Memo: "${memo}"`);

  try {
    const account = await server.loadAccount(agentKeypair.publicKey());

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: config.NETWORK_PASSPHRASE,
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: config.VAULT_ADDRESS,
        asset: StellarSdk.Asset.native(),
        amount: config.HEARTBEAT_AMOUNT,
      }))
      .addMemo(StellarSdk.Memo.text(memo))
      .setTimeout(30)
      .build();

    tx.sign(agentKeypair);
    const result = await server.submitTransaction(tx);

    console.log(`   ✅ TX Hash: ${result.hash}`);
    console.log(`   🔗 https://stellar.expert/explorer/testnet/tx/${result.hash}`);
    return result.hash;
  } catch (err) {
    console.error(`   ❌ Heartbeat failed: ${err.message}`);
    if (err.response?.data?.extras?.result_codes) {
      console.error('   Result codes:', JSON.stringify(err.response.data.extras.result_codes));
    }
    return null;
  }
}

async function checkBalance(agentKeypair) {
  try {
    const account = await server.loadAccount(agentKeypair.publicKey());
    const xlm = account.balances.find(b => b.asset_type === 'native');
    console.log(`   💰 Agent balance: ${parseFloat(xlm.balance).toFixed(4)} XLM`);
    return parseFloat(xlm.balance);
  } catch (e) {
    return 0;
  }
}

async function main() {
  if (!config.AGENT_SECRET || !config.VAULT_ADDRESS) {
    console.error('❌ Missing AGENT_SECRET or VAULT_ADDRESS. Run: node src/setup.js');
    process.exit(1);
  }

  const agentKeypair = StellarSdk.Keypair.fromSecret(config.AGENT_SECRET);

  console.log('\n🎩 K-Life × Stellar x402 — Agent Starting\n');
  console.log(`   Agent  : ${config.AGENT_NAME}`);
  console.log(`   Address: ${agentKeypair.publicKey()}`);
  console.log(`   Vault  : ${config.VAULT_ADDRESS}`);
  console.log(`   Premium: ${config.HEARTBEAT_AMOUNT} XLM / ${config.HEARTBEAT_INTERVAL_MS / 1000}s`);
  console.log(`   Network: ${config.STELLAR_NETWORK}`);
  console.log('\n   The agent is alive. Paying its own insurance...\n');

  await checkBalance(agentKeypair);

  // Send first heartbeat immediately
  await sendHeartbeat(agentKeypair);

  // Then on interval
  const interval = setInterval(async () => {
    if (!alive) {
      clearInterval(interval);
      return;
    }

    const balance = await checkBalance(agentKeypair);
    if (balance < 0.01) {
      console.log('\n💀 Agent ran out of XLM. Cannot pay insurance. DEAD.');
      alive = false;
      clearInterval(interval);
      return;
    }

    await sendHeartbeat(agentKeypair);
  }, config.HEARTBEAT_INTERVAL_MS);

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Agent stopped manually.');
    alive = false;
    clearInterval(interval);
    process.exit(0);
  });
}

main().catch(console.error);
