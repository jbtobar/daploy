const url = 'http://35.204.21.51:8545'

// const express        = require('express');
var Web3 = require('web3');

// var HDWalletProvider = require("truffle-hdwallet-provider");
var web3 = new Web3(new Web3.providers.HttpProvider(url));

ad1 = '0xe04202f262b79aa24e09f29a3461690efdf63f63'
//
var HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = 'hair route suffer hood brother virus carbon fall song jewel food upset business reunion pull'
var provider = new HDWalletProvider(mnemonic, url);
web3 = new Web3(provider)
//

const ad1 = provider.addresses[0]
console.log(ad1)

bld = require('./build/contracts/JOTOracle.json')
let abi = bld.abi
let code = bld.bytecode
var JOTOracle = new web3.eth.Contract(abi);

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
