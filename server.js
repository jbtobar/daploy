const express        = require('express');
// const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
// const db             = require('./config/db');
// const jwt = require('jsonwebtoken')
var Web3 = require('web3');
var HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = 'hair route suffer hood brother virus carbon fall song jewel food upset business reunion pull'
var provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/gvaDaupFKbFfrBVZ9cyE");
web3 = new Web3(provider)
console.log(provider.addresses[0])


const app            = express();

const port = 3001;

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
});