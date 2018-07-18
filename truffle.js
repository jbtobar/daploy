/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
 module.exports = {
     networks: {
         local: {
             host: "localhost",
             port: 8545,
             network_id: "*", // Match any network id
         },
         live: {
             network_id: 1,
             host: "localhost",
             port: 8546   // Different than the default below
         },
         ropsten: {
            host: '144.76.8.56/testnet',
            port: 80,
            network_id: "3", // ropsten
            // from: "0xc6e74d537e2b8de41cf4a682ab7d9a1f8b91f8e1", //sender address
            gas: 2000000
        }
     }
 };
