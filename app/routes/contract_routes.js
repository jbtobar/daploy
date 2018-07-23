// note_routes.js
var Web3 = require('web3');
contractList = ['ICOContract','InvestContract','CommissionContract','JOTOracle','Token']

// bldICO = require('../../build/contracts/ICOContract.json')
// let abiICO = bldICO.abi
// let codeICO = bldICO.bytecode
// var ICOContract = new web3.eth.Contract(abiICO);
const ad1 = '0xe04202f262b79aa24e09f29a3461690efdf63f63'

bld = require('../../build/contracts/Token.json')
let abi = bld.abi
let code = bld.bytecode
// var Token = new web3.eth.Contract(abi);

bldICO = require('../../build/contracts/ICOContract.json')
let abiICO = bldICO.abi
let codeICO = bldICO.bytecode
// var ICOContract = new web3.eth.Contract(abiICO);

module.exports = function(app, web3) {

  app.get('/', (req, res) => {
    res.status(200).send('HI')
  })
  // web3 = new Web3(provider)
  const ICOContract = new web3.eth.Contract(abiICO);
  var Token = new web3.eth.Contract(abi);
  // const ad1 = provider.addresses[0]


  app.post('/notes', (req, res) => {
    res.status(200).json({hi:'hi'})
  });

  app.get('/notes', (req, res) => {
    // res.status(200).json({hi:'hi'})
    res.status(200).json(abiICO)
  });

  app.get('/contracts', (req, res) => {
    res.status(200).send(contractList)
  })

  app.get('/contracts/abi/:contractName', (req, res) => {
    var contractName = req.params.contractName
    console.log(contractName)
    bldICO = require('../../build/contracts/'+contractName+'.json')
    let abiICO = bldICO.abi
    // let codeICO = bldICO.bytecode
    // var ICOContract = new web3.eth.Contract(abiICO);
    res.send(abiICO)
  })
  app.post('/contracts/deploy/JOTOracle', (req, res) => {
    bld = require('../../build/contracts/JOTOracle.json')
    let abi = bld.abi
    let code = bld.bytecode
    var JOTOracle = new web3.eth.Contract(abi);
    function OracleDeploy() {
      // JOTOracle
      console.log('JOTORACLE Deploy')
      JOTOracle.deploy({
        data: code
      }).send({
        from: ad1,
        gas: 2000000,
        gasPrice: '30000000000'}, function(error, transactionHash){
          if (error) {
            console.log(error)
            res.status(207).send(error)
          } else {

            console.log(transactionHash)
            res.status(200).send(transactionHash)
          }

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
          console.log('JOTORACLE Deploy FINISHED')
          // res.status(200).json(ni)


        });

    }
    OracleDeploy()
  })


  app.post('/contracts/deploy/Token', (req, res) => {
    function TokenContractDeploy() {
      console.log('TOKEN CONTRACT DEPLOY')
      Token.deploy({
        data: code,
        arguments: ["JOT","jot",18]
      }).send({
        from: ad1,
        gas: 2000000,
        gasPrice: '30000000000'}, function(error, transactionHash){
          if (error) {
            console.log(error)
            res.status(207).send(error)
          } else {

            console.log(transactionHash)
            res.status(200).send(transactionHash)
          }
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
          console.log(ni)
          console.log('TOKEN CONTRACT DEPLOY FINISHED')
        });
    }
    var juice = req.body
    // TokenContractDeploy()
    console.log(juice)
    console.log(juice.tokenName)
    console.log(juice.tokenSymbol)
    console.log(juice.tokenDecimals)
    // console.log(req.query)
    // console.log(req.params)
    console.log(Object.keys(juice))
    res.status(200).send('yes')
  })

  // app.post('/contracts/deploy/JOTOracle', (req, res) => {
  //   console.log('ORACLE REQUESTED')
  //   bld = require('../../build/contracts/JOTOracle.json')
  //   let abi = bld.abi
  //   let code = bld.bytecode
  //   var JOTOracle = new web3.eth.Contract(abi);
  //   JOTOracle.deploy({
  //     data: code
  //   }).send({
  //     from:ad1,
  //     gas:2000000,
  //     gasPrice: '30000000000'
  //   }, function(error, txHash) {
  //     console.log('ERROR:')
  //     console.log(error)
  //     console.log('txHash:')
  //     console.log(txHash)
  //   }).then({
  //     function(newContractInstance) {
  //       console.log('NEW CONTRACT INSTANCE')
  //       console.log(newContractInstance)
  //       res.status(200).json(newContractInstance)
  //     }
  //   })
  //   // res.status(207).json({good:'good'})
  // })

  app.post('/contracts/deploy/ICOContract', (req, res) => {
    // console.log(req.query)
    // console.log(req.body)
    res.status(200).json({good:'good'})
  })

  // app.post('/contracts/deploy/ICOContract', (req, res) => {
  //   console.log(req)
  //   // TOKEN CUSTOM PARAMS
  //   tokenName = req.query.tokenName
  //   tokenSymbol = req.query.tokenSymbol
  //   tokenDecimals = req.query.tokenDecimals
  //   // ICO CUSTOM PARAMS
  //   projectWallet = req.query.projectWallet
  //   sealTimestamp = req.query.sealTimestamp
  //   minimalInvestment = req.query.minimalInvestment
  //   operator = req.query.operator
  //   quorum = req.query.quorum
  //   pay_in_jot = req.query.pay_in_jot
  //   // ICO DEFAULT PARAMS
  //   minimumCap = 100;
  //   maximumCap = 10*minimumCap;
  //   commissionContractAddress = '0xb659731556e4400B944a18aC9c037Bc2f3763309'
  //   juryOnlineWallet = ad1
  //   jotTokenAddress = '0x7DB792f5c27860D4fEC36F2Dd9f85090f22590B4'
  //   oracleAddress = '0x6F00A696cEAb4c6FCEf70c3cbdba443D03e61DeC'
  //
  //   console.log('BEGIN ICO DEPLOYMENT')
  //   console.log('--------------------')
  //   console.log('ARGUMENTS FOR TOKEN DEPLOYMENT:')
  //   console.log('tokenName: ', tokenName)
  //   console.log('tokenSymbol: ', tokenSymbol)
  //   console.log('tokenDecimals: ', tokenDecimals)
  //   console.log('Deploying Token...')
  //   Token.deploy({
  //     data: code,
  //     arguments: [tokenName,tokenSymbol,tokenDecimals]
  //   }).send({
  //     from: ad1,
  //     gas: 2000000,
  //     gasPrice: '30000000000'}, function(error, transactionHash){
  //       console.log(error);
  //       console.log(transactionHash)
  //     }).then(function(newContractInstance){
  //     var ni = {
  //       address:newContractInstance.options.address,
  //       jsonInterface:newContractInstance.options.jsonInterface,
  //       data:newContractInstance.options.data,
  //       from:newContractInstance.options.from,
  //       gasPrice:newContractInstance.options.gasPrice,
  //       gas:newContractInstance.options.gas,
  //     }
  //     console.log(ni)
  //     console.log('TOKEN CONTRACT DEPLOY FINISHED')
  //     console.log('TOKEN ADDRESS: ', newContractInstance.options.address)
  //     nextDeploy(newContractInstance.options.address,ni)
  //   });
  //   function nextDeploy(address,tokenInfo) {
  //
  //     console.log('ARGUMENTS FOR ICO DEPLOYMENT')
  //     tokenAddress = address
  //     icoDeployArgs = [
  //       tokenAddress,
  //       projectWallet,
  //       sealTimestamp,
  //       minimumCap,
  //       maximumCap,
  //       minimalInvestment,
  //       operator,
  //       quorum,
  //       pay_in_jot,
  //       commissionContractAddress,
  //       juryOnlineWallet,
  //       jotTokenAddress,
  //       oracleAddress,
  //     ]
  //     console.log(icoDeployArgs)
  //     console.log('BEGIN ICO DEPLOYMENT...')
  //     ICOContract.deploy({
  //       data:codeICO,
  //       arguments: icoDeployArgs
  //     }).send({
  //       from: ad1,
  //       gas: 4712388,
  //       gasPrice: '30000000000'}, function(error, transactionHash){
  //         console.log(error);
  //         console.log(transactionHash)
  //       }).then(function(newContractInstance){
  //         var ni = {
  //           address:newContractInstance.options.address,
  //           jsonInterface:newContractInstance.options.jsonInterface,
  //           data:newContractInstance.options.data,
  //           from:newContractInstance.options.from,
  //           gasPrice:newContractInstance.options.gasPrice,
  //           gas:newContractInstance.options.gas,
  //         }
  //         // grabba['then'] = ni
  //         // contractlog[newContractInstance.options.address] = ni
  //         // io.emit('make_escrow',{on:'then',data:ni})
  //         console.log(ni)
  //         console.log('ICO CONTRACT DEPLOY FINISHED')
  //         // console.log('ICO ADDRESS: ', newContractInstance.options.address)
  //         res.status(201).json({'ico':ni,'token':tokenInfo})
  //
  //       });
  //
  //   }
  //
  // })
};




// TOKEN CUSTOM PARAMS
// tokenName = req.params.tokenName
// tokenSymbol = req.params.tokenSymbol
// tokenDecimals = req.params.tokenDecimals
// // ICO CUSTOM PARAMS
// projectWallet = ad1
// sealTimestamp = 2000000000
// minimumCap = 100;
// maximumCap = 10*minimumCap;
// minimalInvestment = 100
// operator = ad1
// quorum = 2
// pay_in_jot = true
// // ICO DEFAULT PARAMS
// commissionContractAddress = '0xb659731556e4400B944a18aC9c037Bc2f3763309'
// juryOnlineWallet = ad1
// jotTokenAddress = '0x7DB792f5c27860D4fEC36F2Dd9f85090f22590B4'
// oracleAddress = '0x6F00A696cEAb4c6FCEf70c3cbdba443D03e61DeC'
