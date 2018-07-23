var Web3 = require('web3');
var HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = 'hair route suffer hood brother virus carbon fall song jewel food upset business reunion pull'
var provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/gvaDaupFKbFfrBVZ9cyE");
web3 = new Web3(provider)

const ad1 = provider.addresses[0]
console.log(ad1)

// bld = require('./build/contracts/CommissionContract.json')
// let abi = bld.abi
// let code = bld.bytecode
// var CommissionContract = new web3.eth.Contract(abi);

bldICO = require('./build/contracts/ICOContract.json')
let abiICO = bldICO.abi
let codeICO = bldICO.bytecode
var ICOContract = new web3.eth.Contract(abiICO);
//
// bld = require('./build/contracts/InvestContract.json')
// let abi = bld.abi
// let code = bld.bytecode
// var InvestContract = new web3.eth.Contract(abi);
//
// bld = require('./build/contracts/Token.json')
// let abi = bld.abi
// let code = bld.bytecode
// var Token = new web3.eth.Contract(abi);
// //
bld = require('./build/contracts/JOTOracle.json')
let abi = bld.abi
let code = bld.bytecode
var JOTOracle = new web3.eth.Contract(abi);

function TokenContractDeploy() {
  console.log('TOKEN CONTRACT DEPLOY')
  Token.deploy({
    data: code,
    arguments: ["JOT","jot",18]
  }).send({
    from: ad1,
    gas: 2000000,
    gasPrice: '30000000000'}, function(error, transactionHash){ console.log(error);console.log(transactionHash) })
    .then(function(newContractInstance){
      var ni = {
        address:newContractInstance.options.address,
        jsonInterface:newContractInstance.options.jsonInterface,
        data:newContractInstance.options.data,
        from:newContractInstance.options.from,
        gasPrice:newContractInstance.options.gasPrice,
        gas:newContractInstance.options.gas,
      }
      // grabba['then'] = ni
      // contractlog[newContractInstance.options.address] = ni
      // io.emit('make_escrow',{on:'then',data:ni})
      console.log(ni)
      console.log('TOKEN CONTRACT DEPLOY FINISHED')


    });
}
// TokenContractDeploy()
juryOnlineWallet = ad1
jotTokenAddress = '0x7DB792f5c27860D4fEC36F2Dd9f85090f22590B4'

function CommissionContractDeploy () {
  console.log('CommissionContract Deploy')
  CommissionContract.deploy({
    data: code,
    arguments: [juryOnlineWallet,jotTokenAddress],
  }).send({
    from: ad1,
    gas: 2000000,
    gasPrice: '30000000000'}, function(error, transactionHash){ console.log(error);console.log(transactionHash) })
    .then(function(newContractInstance){
      var ni = {
        address:newContractInstance.options.address,
        jsonInterface:newContractInstance.options.jsonInterface,
        data:newContractInstance.options.data,
        from:newContractInstance.options.from,
        gasPrice:newContractInstance.options.gasPrice,
        gas:newContractInstance.options.gas,
      }
      // grabba['then'] = ni
      // contractlog[newContractInstance.options.address] = ni
      // io.emit('make_escrow',{on:'then',data:ni})
      console.log(ni)
      console.log('CommissionContract Deploy FINISHED')


    });
}
// CommissionContractDeploy ()

function OracleDeploy() {
  // JOTOracle
  console.log('JOTORACLE Deploy')
  JOTOracle.deploy({
    data: code
  }).send({
    from: ad1,
    gas: 2000000,
    gasPrice: '30000000000'}, function(error, transactionHash){ console.log(error);console.log(transactionHash) })
    .then(function(newContractInstance){
      var ni = {
        address:newContractInstance.options.address,
        jsonInterface:newContractInstance.options.jsonInterface,
        data:newContractInstance.options.data,
        from:newContractInstance.options.from,
        gasPrice:newContractInstance.options.gasPrice,
        gas:newContractInstance.options.gas,
      }
      // grabba['then'] = ni
      // contractlog[newContractInstance.options.address] = ni
      // io.emit('make_escrow',{on:'then',data:ni})
      console.log(ni)
      console.log('JOTORACLE Deploy FINISHED')


    });

}
OracleDeploy()
oracleAddress = '0x6F00A696cEAb4c6FCEf70c3cbdba443D03e61DeC'
var JOTOracleDeployed = new web3.eth.Contract(abi,oracleAddress);
function OracleMess() {
  JOTOracleDeployed.methods.setJOT(8).send({from:ad1}).then(function(result){
    console.log(result)
    // window.sila = result
    // var data = result
    // socket.emit('respond_to_contracts',{username:rapo.username,address:wallet.address.eth,contract:cad,action:action,date:date,data:data})
  })
}
// OracleMess()



operator = ad1;
quorum = 2;
pay_in_jot = false;


tokenAmount = 100000;
etherAmount = 10000000000;
startTime = 1516620617;
duration = 3600;
description = "test milestone";

jot_rate = 8;



// ARGUMENTS for TOKEN
tokenName = 'BestICO'
tokenSymbol = 'BIC'
tokenDecimals = 18

// ARGUMENTS FOR ICO
var tokenAddress,
projectWallet = ad1
sealTimestamp = 2000000000
minimumCap = 100;
maximumCap = 10*minimumCap;
minimalInvestment = 100
operator = ad1
quorum = 2
pay_in_jot = true
commissionContractAddress = '0xb659731556e4400B944a18aC9c037Bc2f3763309'
juryOnlineWallet = ad1
jotTokenAddress = '0x7DB792f5c27860D4fEC36F2Dd9f85090f22590B4'
oracleAddress = '0x6F00A696cEAb4c6FCEf70c3cbdba443D03e61DeC'


function deployAnICO() {
  console.log('BEGIN ICO DEPLOYMENT')
  console.log('--------------------')
  console.log('ARGUMENTS FOR TOKEN DEPLOYMENT:')
  console.log('tokenName: ', tokenName)
  console.log('tokenSymbol: ', tokenSymbol)
  console.log('tokenDecimals: ', tokenDecimals)
  console.log('Deploying Token...')
  Token.deploy({
    data: code,
    arguments: [tokenName,tokenSymbol,tokenDecimals]
  }).send({
    from: ad1,
    gas: 2000000,
    gasPrice: '30000000000'}, function(error, transactionHash){
      console.log(error);
      console.log(transactionHash)
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
      // grabba['then'] = ni
      // contractlog[newContractInstance.options.address] = ni
      // io.emit('make_escrow',{on:'then',data:ni})
      console.log(ni)
      console.log('TOKEN CONTRACT DEPLOY FINISHED')
      console.log('TOKEN ADDRESS: ', newContractInstance.options.address)
      nextDeploy(newContractInstance.options.address)

    });
    function nextDeploy(address) {
      console.log('ARGUMENTS FOR ICO DEPLOYMENT')
      tokenAddress = address
      icoDeployArgs = [
        tokenAddress,
        projectWallet,
        sealTimestamp,
        minimumCap,
        maximumCap,
        minimalInvestment,
        operator,
        quorum,
        pay_in_jot,
        commissionContractAddress,
        juryOnlineWallet,
        jotTokenAddress,
        oracleAddress,
      ]
      console.log(icoDeployArgs)
      console.log('BEGIN ICO DEPLOYMENT...')
      ICOContract.deploy({
        data:codeICO,
        arguments: icoDeployArgs
      }).send({
        from: ad1,
        gas: 4712388,
        gasPrice: '30000000000'}, function(error, transactionHash){
          console.log(error);
          console.log(transactionHash)
        }).then(function(newContractInstance){
          var ni = {
            address:newContractInstance.options.address,
            jsonInterface:newContractInstance.options.jsonInterface,
            data:newContractInstance.options.data,
            from:newContractInstance.options.from,
            gasPrice:newContractInstance.options.gasPrice,
            gas:newContractInstance.options.gas,
          }
          // grabba['then'] = ni
          // contractlog[newContractInstance.options.address] = ni
          // io.emit('make_escrow',{on:'then',data:ni})
          console.log(ni)
          console.log('ICO CONTRACT DEPLOY FINISHED')
          console.log('ICO ADDRESS: ', newContractInstance.options.address)

        });

    }

}

// deployAnICO()

  //
  //
  //

//
//
// function sendContract(data) {
//   console.log("Deploying the contract");
//   var grabba = {
//     data:code,
//     arguments:[data.buyer,data.seller],
//     from:ad1,
//     gas:1000000,
//     gasPrice:'30000000000',
//   }
//   // grabba.push({})
//   SampleContract.deploy({
//     data: code,
//     arguments: [data.buyer,data.seller]
//   }).send({
//     from: ad1,
//     gas: 1000000,
//     gasPrice: '30000000000'}, function(error, transactionHash){ console.log(error);console.log(transactionHash) })
//     .on('error', function(error){
//       console.log(error)
//       // io.emit('make_escrow',{on:'error',data:error})
//       grabba['error'] = error
//     })
//     .on('transactionHash', function(transactionHash){
//       console.log(transactionHash)
//       // io.emit('make_escrow',{on:'transactionHash',data:transactionHash})
//       grabba['transactionHash'] = transactionHash
//     })
//     .on('receipt', function(receipt){
//       // console.log(receipt.contractAddress)
//       io.emit('make_escrow',{on:'receipt',data:receipt})
//       grabba['receipt'] = receipt
//     })
//     .on('confirmation', function(confirmationNumber, receipt){
//        // console.log(receipt);
//        console.log(confirmationNumber)
//        io.emit('make_escrow',{on:'receipt',data:{receipt:receipt,confirmationNumber:confirmationNumber}})
//        grabba['confirmation'] = {
//          confirmationNumber:confirmationNumber,
//          receipt:receipt
//        }
//
//        contractlog[receipt.contractAddress] = grabba
//
//      })
//     .then(function(newContractInstance){
//       var ni = {
//         address:newContractInstance.options.address,
//         jsonInterface:newContractInstance.options.jsonInterface,
//         data:newContractInstance.options.data,
//         from:newContractInstance.options.from,
//         gasPrice:newContractInstance.options.gasPrice,
//         gas:newContractInstance.options.gas,
//       }
//       grabba['then'] = ni
//       contractlog[newContractInstance.options.address] = ni
//       io.emit('make_escrow',{on:'then',data:ni})
//       console.log('sapisula')
//
//
//     });
// }
