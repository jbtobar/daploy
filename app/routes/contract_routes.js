// WE IMPORT THE CONTRACT JSON ARTIFACTS
// referenceFile = require('../../reference.html')
bldToken = require('../../build/contracts/Token.json')
bldOracle = require('../../build/contracts/JOTOracle.json')
bldCommissionContract = require('../../build/contracts/CommissionContract.json')
bldICOContract = require('../../build/contracts/ICOContract.json')
bldInvestContract = require('../../build/contracts/InvestContract.json')

// WE USE THESE ADDRESSES IF THESE ARE ALREADY DEPLOYED
addressBaser = {
  jotOracleAddress: '0x52369239D5dee5cc4230C445AA8d49D2a3819aDE',
  jotTokenAddress: '0x6A970E725d077a7763531cafb69349Fb8F48e6B7',
  commissionContractAddress: '0xF004F99fD9Ca7D94cFa75178a23F85d526C86ba0'
}

module.exports = async function(app, web3) {

accounts = await web3.eth.getAccounts().then(function(d){return d})

ICOdefault = {
  projectWallet: accounts[9],
  sealTimestamp: 2000000000,
  minimumCap: 100,
  maximumCap: 100*10,
  minimalInvestment: 100,
  operator: accounts[5],
  quorum: 2,
  pay_in_jot: true,
}

investor = accounts[2]
operator: accounts[5]
tokenAmount = 100000;
etherAmount = 10000000000;
startTime = 1516620617;
duration = 3600;
description = "test milestone";
// console.log('ACCOUNTS')
// console.log(accounts);
//------------------------------------------------------------------------------
// CONSTANTS
// const ad1 = web3.eth.accounts[0]
const ad1 = '0x1bc9f43f55e86670dcf2cc1cd42c5e2c493562aa'
var JOTOracle = new web3.eth.Contract(bldOracle.abi);
var Token = new web3.eth.Contract(bldToken.abi);
var CommissionContract = new web3.eth.Contract(bldCommissionContract.abi)
var ICOContract = new web3.eth.Contract(bldICOContract.abi)
juryOnlineWallet = '0xbfa26f3a9f7daf0398c31bf754fb07ebe17c2937'

//------------------------------------------------------------------------------
    // This route will deploy contracts
    app.get('/', (req, res) => {
      res.sendFile('reference.html',{"root": __dirname})
    })

    app.post('/deployAll', async (req, res) => {

        console.log('ROUTE: /deployAll')


        console.log('---------- v ----------')
        console.log('JOTOracle Deploy Address')
        jotOracleAddress = await JOTOracle.deploy({ data: code = bldOracle.bytecode }).send({from:ad1, gas: 2000000, gasPrice: '30000000000'}).then(function(d){return d.options.address})
        addressBaser.jotOracleAddress = jotOracleAddress
        console.log(jotOracleAddress)
        console.log('---------- ^ ----------')


        console.log('---------- v ----------')
        console.log('JOT Token Deploy Address')
        var args = ['JOT','jot',18]
        console.log('ARGUMENTS:')
        console.log(args)
        jotTokenAddress = await Token.deploy({ data: code = bldToken.bytecode, arguments: args }).send({from:ad1, gas: 2000000, gasPrice: '30000000000'}).then(function(d){return d.options.address})
        addressBaser.jotTokenAddress = jotTokenAddress
        console.log(jotTokenAddress)
        console.log('---------- ^ ----------')


        console.log('---------- v ----------')
        console.log('Commission Contract Deploy Address')
        var args = [juryOnlineWallet, jotTokenAddress]
        console.log('ARGUMENTS:')
        console.log(args)
        commissionContractAddress = await CommissionContract.deploy({ data: code = bldCommissionContract.bytecode, arguments: args }).send({from:ad1, gas: 2000000, gasPrice: '30000000000'}).then(function(d){return d.options.address})
        addressBaser.commissionContractAddress = commissionContractAddress
        console.log(commissionContractAddress)
        console.log('---------- ^ ----------')


        res.status(200).json(addressBaser)
    })

    app.post('/contracts/interact/ICOContract/milestones', async (req, res) => {

      console.log('ROUTE: /contracts/interact/ICOContract/milestones')
      console.log('---------- v ----------')
      var juice = req.body
      console.log(juice)

      deployedICOContract = new web3.eth.Contract(bldICOContract.abi, juice.ICOAddress)
      var milestoneEdit = await deployedICOContract.methods.addMilestone(etherAmount, tokenAmount, startTime, duration, description).send({from:accounts[5], gas: 2000000, gasPrice: '30000000000'}).then(function(d){return d})
      // await icoContract.addMilestone(etherAmount, tokenAmount, startTime, duration, description, {from: accounts[0]});
      console.log(milestoneEdit)
      console.log('---------- ^ ----------')
      res.status(200).json(milestoneEdit)

    })

    app.post('/contracts/interact/ICOContract/seal', async (req, res) => {

      console.log('ROUTE: /contracts/interact/ICOContract/seal')
      console.log('---------- v ----------')
      var juice = req.body
      console.log(juice)

      deployedICOContract = new web3.eth.Contract(bldICOContract.abi, juice.ICOAddress)
      var sealResult = await deployedICOContract.methods.seal().send({from:accounts[5], gas: 2000000, gasPrice: '30000000000'}).then(function(d){return d})
      // await icoContract.addMilestone(etherAmount, tokenAmount, startTime, duration, description, {from: accounts[0]});
      console.log(sealResult)
      console.log('---------- ^ ----------')
      res.status(200).json(sealResult)

    })

    app.post('/contracts/interact/ICOContract/addInvestContract', async (req, res) => {

      console.log('ROUTE: /contracts/interact/ICOContract/addInvestContract')
      console.log('---------- v ----------')
      var juice = req.body
      console.log(juice)

      deployedICOContract = new web3.eth.Contract(bldICOContract.abi, juice.ICOAddress)
      var addInvestContractResult = await deployedICOContract.methods.addInvestContract(juice.InvestContractAddress).send({from:operator, gas: 2000000, gasPrice: '30000000000'}).then(function(d){return d})
      // await icoContract.addMilestone(etherAmount, tokenAmount, startTime, duration, description, {from: accounts[0]});
      console.log(addInvestContractResult)
      console.log('---------- ^ ----------')
      res.status(200).json(addInvestContractResult)

    })

    app.post('/contracts/deploy/InvestContract', async (req, res) => {

      console.log('ROUTE: /contracts/deploy/InvestContract')
      console.log('---------- v ----------')
      var juice = req.body
      var args = [juice.ICOAddress, investor, etherAmount, tokenAmount]
      console.log(args)

      InvestContract = new web3.eth.Contract(bldInvestContract.abi)
      var deployedInvestContract = await InvestContract.deploy({ data: code = bldInvestContract.bytecode, arguments: args }).send({from:ad1, gas: 4712388, gasPrice: '30000000000'}).then(function(d){return d})
      // await icoContract.addMilestone(etherAmount, tokenAmount, startTime, duration, description, {from: accounts[0]});
      console.log(deployedInvestContract.options.address)
      console.log('---------- ^ ----------')
      res.status(200).json(deployedInvestContract.options.address)

    })

    app.post('/contracts/deploy/ICOContract', async (req, res) => {


      console.log('---------- v ----------')
      console.log('Project Token Deploy Address')
      var args = ['Project Token','PJCT',18]
      console.log('ARGUMENTS:')
      console.log(args)
      deployedProjectToken = await Token.deploy({ data: code = bldToken.bytecode, arguments: args }).send({from:ad1, gas: 2000000, gasPrice: '30000000000'}).then(function(d){return d})
      ProjectTokenAddress = deployedProjectToken.options.address
      console.log(ProjectTokenAddress)
      console.log('---------- ^ ----------')


      console.log('---------- v ----------')
      console.log('ICO Contract Deploy Address')
      var args = [ProjectTokenAddress, ICOdefault.projectWallet, ICOdefault.sealTimestamp, ICOdefault.minimumCap, ICOdefault.maximumCap, ICOdefault.minimalInvestment, ICOdefault.operator, ICOdefault.quorum, ICOdefault.pay_in_jot, addressBaser.commissionContractAddress, juryOnlineWallet, addressBaser.jotTokenAddress,addressBaser.jotOracleAddress]
      console.log('ARGUMENTS:')
      console.log(args)
      ICOContractAddress = await ICOContract.deploy({ data: bldICOContract.bytecode, arguments: args }).send({from:ad1, gas: 4712388, gasPrice: '30000000000'}).then(function(d){return d.options.address})
      console.log(ICOContractAddress)
      console.log('---------- ^ ----------')


      console.log('---------- v ----------')
      console.log('Adding ICO to WhiteList')
      var args = ICOContractAddress
      console.log('ARGUMENTS:')
      console.log(args)
      var deployedCommissionContract = new web3.eth.Contract(bldCommissionContract.abi,addressBaser.commissionContractAddress);
      var whitelisted = await deployedCommissionContract.methods.addWhitelist(ICOContractAddress).send({from:ad1, gas: 2000000, gasPrice: '30000000000'}).then(function(d){return d})
      console.log(whitelisted)
      console.log('---------- ^ ----------')


      console.log('---------- v ----------')
      console.log('Minting Tokens to ICO')
      var args = [ICOContractAddress, tokenAmount*500]
      console.log('ARGUMENTS:')
      console.log(args)
      var mintation = await deployedProjectToken.methods.mint(ICOContractAddress, tokenAmount*500).send({from:ad1, gas: 2000000, gasPrice: '30000000000'}).then(function(d){return d})
      var startation= await deployedProjectToken.methods.start().send({from:ad1, gas: 2000000, gasPrice: '30000000000'}).then(function(d){return d})
      // var deployedProjectToken = new web3.eth.Contract(bldCommissionContract.abi,addressBaser.commissionContractAddress)
      console.log(startation)
      console.log('---------- ^ ----------')

      console.log('-----------------------')
      console.log('Deployed ICO address')
      console.log(ICOContractAddress)
      console.log('-----------------------')
      res.status(200).json(ICOContractAddress)

    })


    // app.post('/v1/contracts/deploy/ICOContract', async (req, res) => {
    //
    //   console.log('---------- v ----------')
    //   console.log('Project Token Deploy Address')
    //   var args = ['Project Token','PJCT',18]
    //   console.log('ARGUMENTS:')
    //   console.log(args)
    //   ProjectTokenAddress = await Token.deploy({ data: code = bldToken.bytecode, arguments: args }).send({from:ad1, gas: 2000000, gasPrice: '30000000000'}).then(function(d){return d.options.address})
    //   console.log(ProjectTokenAddress)
    //   console.log('---------- ^ ----------')
    //
    //   console.log('---------- v ----------')
    //   console.log('ICO Contract Deploy Address')
    //
    //   var args = [
    //     ProjectTokenAddress,
    //     ICOdefault.projectWallet,
    //     ICOdefault.sealTimestamp,
    //     ICOdefault.minimumCap,
    //     ICOdefault.maximumCap,
    //     ICOdefault.minimalInvestment,
    //     ICOdefault.operator,
    //     ICOdefault.quorum,
    //     ICOdefault.pay_in_jot,
    //     addressBaser.commissionContractAddress,
    //     juryOnlineWallet,
    //     addressBaser.jotTokenAddress,
    //     addressBaser.jotOracleAddress
    //   ]
    //   console.log('ARGUMENTS:')
    //   console.log(args)
    //   ICOContractAddress = await ICOContract.deploy({ data: bldICOContract.bytecode, arguments: args }).send({from:ad1, gas: 4712388, gasPrice: '30000000000'}).then(function(d){return d.options.address})
    //   console.log(ICOContractAddress)
    //   console.log('---------- ^ ----------')
    //   res.status(200).json(ICOContractAddress)
    //
    // })

    app.get('/addresses', (req, res) => {
      console.log('ROUTE: /addresses')
      res.status(200).json(app.locals.addressBaser)
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
