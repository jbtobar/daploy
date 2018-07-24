// require('dotenv').config()
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const express        = require('express');
const bodyParser     = require('body-parser');
// const jwt = require('jsonwebtoken')
// var Web3 = require('web3');
// var HDWalletProvider = require("truffle-hdwallet-provider");
// const mnemonic = process.env.MNEMONIC
// var provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/${process.env.INFURA_ACCESS_TOKEN}");
// web3 = new Web3(provider)
// console.log(provider.addresses)

// var Web3 = require("web3");
// var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// console.log(Object.keys(web3.eth))
// var accounts = await web3.eth.getAccounts()
// console.log(accounts)
const app            = express();

const port = 3001;

app.locals.addressBaser = {
  jotOracleAddress: '0x52369239D5dee5cc4230C445AA8d49D2a3819aDE',
  jotTokenAddress: '0x6A970E725d077a7763531cafb69349Fb8F48e6B7',
  commissionContractAddress: '0xF004F99fD9Ca7D94cFa75178a23F85d526C86ba0'
}
// app.locals.addressBaser = {
//   jotOracleAddress: '',
//   jotTokenAddress: '',
//   commissionContractAddress: ''
// }

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

// server.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
// server.use(jsonServer.defaults());

// require('./app/routes')(app, {});
require('./app/routes')(app, web3);


// bld = require('./build/contracts/Token.json')
// let abi = bld.abi
// let code = bld.bytecode
// var Token = new web3.eth.Contract(abi);


app.listen(port, () => {
  console.log('We are live on ' + port);
  console.log(web3.eth.accounts[0])
});
