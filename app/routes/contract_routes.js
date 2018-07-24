// THESE ARE THE CONTRACTS CURRENTLY IN OPERATION

bldToken = require('../../build/contracts/Token.json')
bldOracle = require('../../build/contracts/JOTOracle.json')
bldCommissionContract = require('../../build/contracts/CommissionContract.json')
bldICOContract = require('../../build/contracts/ICOContract.json')
bldInvestContract = require('../../build/contracts/InvestContract.json')



module.exports = function(app, web3) {
//------------------------------------------------------------------------------
// CONSTANTS
// const ad1 = web3.eth.accounts[0]
const ad1 = '0x1bc9f43f55e86670dcf2cc1cd42c5e2c493562aa'
//------------------------------------------------------------------------------
    // This route will deploy ALL Contracts
    app.post('/deployAll', async (req, res) => {
        console.log('-------ONE-------')
        // newInstance = deployOracle()
        var code = bldOracle.bytecode
        var abi = bldOracle.abi
        var JOTOracle = new web3.eth.Contract(abi);
        newInstance = await JOTOracle.deploy({ data: code }).send({from:ad1, gas: 2000000, gasPrice: '30000000000'})
        console.log('-------FIVE-------')
        console.log(newInstance)
        console.log('sending back')
        res.status(200).json(newInstance)
    })
    // THIS IS THE END OF THE ROUTES
//------------------------------------------------------------------------------
// HELPER FUNCTIONS BEGIN
function deployOracle() {
  console.log('-------TWO-------')
  var code = bldOracle.bytecode
  var abi = bldOracle.abi
  var JOTOracle = new web3.eth.Contract(abi);
  console.log('BEGIN ORACLE DEPLOY')
  JOTOracle.deploy({
    data: code
  }).send({
      from: '0x1bc9f43f55e86670dcf2cc1cd42c5e2c493562aa',
      gas: 2000000,
      gasPrice: '30000000000',
    }, function(error, txHash) {
      console.log('ERROR BELOW')
      console.log(error)
      console.log('TxHASH BELOW')
      console.log(txHash)
      console.log('-------THREE-----')
    })
    .then(function(newContractInstance){
      var ni = {
        address:newContractInstance.options.address,
        jsonInterface:newContractInstance.options.jsonInterface,
        data:newContractInstance.options.data,
        from:newContractInstance.options.from,
        gasPrice:newContractInstance.options.gasPrice,
        gas:newContractInstance.options.gas,
      }
      console.log('NEW CONTRACT INSTANCE')
      console.log('-------FOUR------')
      return ni
    })
}
// HELPER FUNCTIONS END
}
