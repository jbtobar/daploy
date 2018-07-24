var ICOContract = artifacts.require("./ICOContract.sol");
var InvestContract = artifacts.require("./InvestContract.sol");
var Token = artifacts.require("./Token.sol");
var TokenJOT = artifacts.require("./Token.sol");
var CommissionContract = artifacts.require("./CommissionContract.sol")
var artifactor = require("truffle-artifactor");

JOTOracle = artifacts.require('./JOTOracle.sol')
// Contructor variables to deploy ICOContract

// operator = Token.address // it does this after deploying the token
// token = Token(_tokenAddress);
// projectWallet = "0x9f301d69efd0bf163cc443849727d977c7e50c31";
projectWallet = web3.eth.accounts[1];
sealTimestamp = Date.now() + 1000000000;
minimumCap = 10;
maximumCap = 40000000000000;
minimalInvestment = 1;
operator = web3.eth.accounts[0]
quorum = 2
pay_in_jot = true;

juryOnlineWallet = web3.eth.accounts[9]
jotTokenAddress = 0x7DB792f5c27860D4fEC36F2Dd9f85090f22590B4
// module.exports = function(deployer) {
//     //deployer.deploy(ICOContract, "");
//     // First deploys token, then depoloys ICOContract with Token address and other parameters
//     deployer.deploy(Token, "test", "ttt", 3).then(function() {
//         // return deployer.deploy(ICOContract, Token.address, "0xc9584E27Adf724121C24fc887b4E79B6aEca6cA4");
//
//         // In the above deployer function, it gives following error:
//         // Error: ICOContract contract constructor expected 7 arguments, received 2
//         // So I add the remaining parameters: projectWallet, sealTimestamp, minimumCap, maximumCap, minimalInvestment
//         return deployer.deploy(ICOContract, Token.address,projectWallet, sealTimestamp, minimumCap, maximumCap, minimalInvestment,operator,quorum,pay_in_jot);
//     });
//     //ICOContract.addMilestone();
//     //deployer.link(ConvertLib, MetaCoin);
// };


module.exports = function(deployer) {
  deployer.deploy(TokenJOT, "JOT", "jot",18).then(function() {
    return deployer.deploy(CommissionContract,juryOnlineWallet,TokenJOT.address).then(function() {
      deployer.deploy(Token,"test","ttt",3).then(function() {
        return deployer.deploy(ICOContract, Token.address,projectWallet, sealTimestamp, minimumCap, maximumCap, minimalInvestment,operator,quorum,pay_in_jot,CommissionContract.address,juryOnlineWallet,TokenJOT.address,"0xc9584E27Adf724121C24fc887b4E79B6aEca6cA4")
      })
    })
  })
  // deployer.deploy(JOTOracle)
}


// JOTOracle.new().then(_ic => { ic = _ic})
