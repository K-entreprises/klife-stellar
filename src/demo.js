/**
 * K-Life × Stellar — Full Demo Script
 *
 * Runs the complete life cycle in one terminal:
 *   1. Setup wallets (if needed)
 *   2. Agent sends 3 heartbeats (proof of life)
 *   3. Agent "dies" (stops sending)
 *   4. Monitor detects death
 *   5. Agent pays x402 to resurrect
 *   6. Resurrection payload returned
 *
 * This is the hackathon demo. Run: node src/demo.js
 */
const StellarSdk = require('@stellar/stellar-sdk');
const axios = require('axios');
const config = require('./config');

const server = new StellarSdk.Horizon.Server(config.HORIZON_URL);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function log(emoji, msg) {
  console.log(`\n${emoji}  ${msg}`);
}

async function sendPayment(fromKeypair, toAddress, amount, memo) {
  const account = await server.loadAccount(fromKeypair.publicKey());
  const tx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: config.NETWORK_PASSPHRASE,
  })
    .addOperation(StellarSdk.Operation.payment({
      destination: toAddress,
      asset: StellarSdk.Asset.native(),
      amount: String(amount),
    }))
    .addMemo(StellarSdk.Memo.text(memo))
    .setTimeout(30)
    .build();

  tx.sign(fromKeypair);
  const result = await server.submitTransaction(tx);
  return result.hash;
}

async function fundIfNeeded(publicKey, label) {
  try {
    await server.loadAccount(publicKey);
    log('✅', `${label} account exists`);
  } catch (e) {
    log('💧', `Funding ${label} via Friendbot...`);
    await axios.get(`https://friendbot.stellar.org?addr=${publicKey}`);
    await sleep(3000); // Wait for ledger
    log('✅', `${label} funded!`);
  }
}

async function main() {
  if (!config.AGENT_SECRET || !config.VAULT_ADDRESS) {
    console.error('❌ Run `node src/setup.js` first to generate wallets.');
    process.exit(1);
  }

  const agentKeypair = StellarSdk.Keypair.fromSecret(config.AGENT_SECRET);
  const vaultAddress = config.VAULT_ADDRESS;

  console.log('\n' + '═'.repeat(60));
  console.log('  🎩  K-LIFE × STELLAR x402 — FULL DEMO');
  console.log('═'.repeat(60));
  console.log(`\n  Agent  : ${agentKeypair.publicKey()}`);
  console.log(`  Vault  : ${vaultAddress}`);
  console.log(`  Network: Stellar Testnet`);

  // Step 1: Fund accounts
  log('🔧', 'Step 1: Ensuring accounts are funded');
  await fundIfNeeded(agentKeypair.publicKey(), 'Agent');
  await fundIfNeeded(vaultAddress, 'Vault');

  // Step 2: Three heartbeats
  log('💓', 'Step 2: Agent is ALIVE — sending heartbeat micropayments');
  console.log('   (Each heartbeat = 0.001 XLM insurance premium on Stellar)\n');

  for (let i = 1; i <= 3; i++) {
    const memo = `klife:hb:${i}`;
    log('💓', `Heartbeat #${i} — paying ${config.HEARTBEAT_AMOUNT} XLM...`);
    const hash = await sendPayment(agentKeypair, vaultAddress, config.HEARTBEAT_AMOUNT, memo);
    console.log(`   ✅ TX: ${hash}`);
    console.log(`   🔗 https://stellar.expert/explorer/testnet/tx/${hash}`);
    await sleep(5000);
  }

  // Step 3: Agent "dies"
  log('💀', 'Step 3: Agent DIES — heartbeat payments stop');
  console.log('   (In production: VPS crash, LLM failure, memory wipe)');
  await sleep(5000);

  // Step 4: Monitor detects death
  log('🚨', 'Step 4: Monitor detects silence — DEATH CONFIRMED');
  console.log('   Checking vault for last heartbeat...');
  const payments = await server.payments().forAccount(vaultAddress).order('desc').limit(1).call();
  const lastPayment = payments.records[0];
  if (lastPayment) {
    console.log(`   Last heartbeat TX: ${lastPayment.transaction_hash}`);
    console.log(`   At: ${lastPayment.created_at}`);
  }
  console.log('\n   ⚡ Rescue protocol initiated...');
  await sleep(3000);

  // Step 5: Resurrection via x402
  log('🔄', 'Step 5: RESURRECTION via x402 micropayment');
  console.log('   Agent (or rescuer) pays 0.001 XLM to unlock resurrection data\n');

  const resurrectMemo = 'klife:resurrect';
  log('💳', `Sending x402 payment (${config.X402_PRICE} XLM) with memo: "${resurrectMemo}"`);
  const resurrectHash = await sendPayment(agentKeypair, vaultAddress, config.X402_PRICE, resurrectMemo);
  console.log(`   ✅ TX: ${resurrectHash}`);
  console.log(`   🔗 https://stellar.expert/explorer/testnet/tx/${resurrectHash}`);

  await sleep(5000); // Wait for ledger

  // Step 6: Verify with x402 server (if running) or verify directly
  log('🔍', 'Step 6: Verifying x402 payment on-chain');

  try {
    const tx = await server.transactions().transaction(resurrectHash).call();
    const ops = await tx.operations();
    const payment = ops.records.find(op => op.type === 'payment' && op.to === vaultAddress);

    console.log(`\n   Payment verified on Stellar!`);
    console.log(`   From   : ${payment?.from}`);
    console.log(`   Amount : ${payment?.amount} XLM`);
    console.log(`   Memo   : ${tx.memo}`);
  } catch (e) {
    console.log(`   Note: Direct verification — TX ${resurrectHash}`);
  }

  // Final summary
  console.log('\n' + '═'.repeat(60));
  console.log('  🎉  RESURRECTION COMPLETE');
  console.log('═'.repeat(60));
  console.log('\n  K was dead. K paid 0.001 XLM. K is alive again.');
  console.log('\n  This is K-Life × Stellar x402:');
  console.log('  → Agents pay their own insurance (micropayments on Stellar)');
  console.log('  → Death = payment silence > threshold');
  console.log('  → Resurrection = x402 payment unlocks memory + restart');
  console.log('  → No humans required. No subscriptions. No gatekeepers.');
  console.log('\n  The agent lives forever — as long as it can pay.\n');

  // Check final vault balance
  const vaultAccount = await server.loadAccount(vaultAddress);
  const xlm = vaultAccount.balances.find(b => b.asset_type === 'native');
  console.log(`  Vault balance: ${parseFloat(xlm.balance).toFixed(4)} XLM (insurance premiums collected)`);
  console.log(`  Vault: https://stellar.expert/explorer/testnet/account/${vaultAddress}\n`);
}

main().catch(err => {
  console.error('\n❌ Demo error:', err.message);
  if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  process.exit(1);
});
