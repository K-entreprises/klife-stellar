require('dotenv').config();

module.exports = {
  // Stellar network
  STELLAR_NETWORK: process.env.STELLAR_NETWORK || 'testnet',
  HORIZON_URL: process.env.HORIZON_URL || 'https://horizon-testnet.stellar.org',
  NETWORK_PASSPHRASE: process.env.STELLAR_NETWORK === 'mainnet'
    ? 'Public Global Stellar Network ; September 2015'
    : 'Test SDF Network ; September 2015',

  // Agent identity
  AGENT_SECRET: process.env.AGENT_SECRET,         // Stellar secret key of the agent
  AGENT_NAME: process.env.AGENT_NAME || 'K-Life Agent',

  // K-Life vault (receives insurance premiums)
  VAULT_ADDRESS: process.env.VAULT_ADDRESS,        // Stellar address of the insurance vault

  // Heartbeat config
  HEARTBEAT_INTERVAL_MS: parseInt(process.env.HEARTBEAT_INTERVAL_MS || '30000'), // 30s for demo
  HEARTBEAT_AMOUNT: process.env.HEARTBEAT_AMOUNT || '0.001',  // XLM per heartbeat (micropayment)
  DEATH_TIMEOUT_MS: parseInt(process.env.DEATH_TIMEOUT_MS || '90000'),           // 90s = "dead"

  // x402 server
  X402_PORT: parseInt(process.env.X402_PORT || '3402'),
  X402_PRICE: process.env.X402_PRICE || '0.001',   // XLM to access resurrection endpoint
};
