// REQUEST TEST SCRIPT
var request = require('request');
var rp = require('request-promise')
var expect  = require('chai').expect;
var assert = require('assert');
var chai = require('chai')
chaiHttp = require('chai-http');
chai.use(chaiHttp);
// API URL
const url = 'http://localhost:3001/contracts'


// USEFUL NOTES
//https://ethereum.stackexchange.com/questions/7255/deploy-contract-from-nodejs-using-web3


juryOnlineWallet = '0xe04202f262b79aa24e09f29a3461690efdf63f63'
jotTokenAddress = '0x7DB792f5c27860D4fEC36F2Dd9f85090f22590B4'

commissionContractAddress = '0x85b95120365B328dBe4cF159D3C48f05AD9c1CFa'
jotOracleAddress = '0x53C28f4688f59d57a8c73B42Dc7948c6f092c52C'

params = {
  tokenName:'BTC',
  tokenSymbol:'btchj',
  tokenDecimals:18,
  projectWallet:0xe04202f262b79aa24e09f29a3461690efdf63f63,
  minimalInvestment:100,
  operator:0xe04202f262b79aa24e09f29a3461690efdf63f63,
  quorum:2,
  pay_in_jot:true,
  sealTimestamp:2000000000
}

// describe('sample tests:', function() {
//   it('promise', function(done) {
//     request.post('http://localhost:3001/contracts/deploy/ICOContract',params, function(err, res, body) {
//       console.log(res.statusCode)
//       assert.equal(res.statusCode,300,'problem')
//       done()
//     })
//   });
// })
// describe('API MAIN ROUTES', function() {
//   it('promise', function(done) {
//     request.get('http://localhost:3001/', function(err, res, body) {
//       // console.log(res.statusCode)
//       assert.equal(res.statusCode,300,'problem')
//       done()
//     })
//   });
// })

urlBase= 'http://localhost:3001'
describe('API MAIN ROUTES', function() {

  // THE BASE URL SHOULD RETURN A 200 STATUS
  it('GET request returns STATUS 200 on urlBase = '+urlBase, function(done) {
    request.get(urlBase, function(err,res,body) {
      assert.equal(res.statusCode, 200, 'Service might not be online')
      done()
    })
  })

  // THE /contracts route should return a list of contracts and status 200
  // var contractList,
  it('GET request returns status 200 and list of contracts on route = /contracts', function(done) {
    request.get(urlBase+'/contracts', function(err, res, body) {
      assert.equal(res.statusCode,200)
      console.log('         LIST OF CONTRACTS BELOW:')
      console.log('         ------------------------')
      console.log('         '+res.body)
      contractList = res.body
      done()
    })
  })

  // it('Deploys a JOT Oracle',  function (done) {
  //   request.post(urlBase+'/contracts/deploy/JOTOracle', function (err, res, body){
  //     expect(res.statusCode).to.equal(200);
  //     // expect(res.body).to.equal('wrong header');
  //     console.log('         TxHash Below:')
  //     console.log('         '+res.body)
  //     console.log('         ------------------------')
  //     console.log('         Response Status Code Below:')
  //     console.log('         '+res.statusCode)
  //     done();
  //   });
  // });

  // it('Deploys a Token', function(done) {
  //   params = {
  //     tokenName: 'YES Token',
  //     tokenSymbol: 'YEST',
  //     tokenDecimals: 18.00
  //   }
  //   request.post({
  //     headers: {'content-type' : 'application/x-www-form-urlencoded'},
  //     url:     urlBase+'/contracts/deploy/Token',
  //     // json:require('querystring').stringify(params)
  //     form:params
  //   },function(err, res) {
  //     expect(res.statusCode).to.equal(200);
  //     // expect(res.body).to.equal('wrong header');
  //     console.log('         TxHash Below:')
  //     console.log('         '+res.body)
  //     console.log('         ------------------------')
  //     console.log('         Response Status Code Below:')
  //     console.log('         '+res.statusCode)
  //     done()
  //   })
  // })

  // it('Deploys a CommissionContract', function(done) {
  //   params = {
  //     juryOnlineWallet: juryOnlineWallet,
  //     jotTokenAddress: jotTokenAddress
  //   }
  //   request.post({
  //     headers: {'content-type' : 'application/x-www-form-urlencoded'},
  //     url:     urlBase+'/contracts/deploy/CommissionContract',
  //     // json:require('querystring').stringify(params)
  //     form:params
  //   },function(err, res) {
  //     // console.log(Object.keys(res))
  //     // console.log(res.statusMessage)
  //     // console.log(res.body)
  //     expect(res.statusCode).to.equal(200);
  //     // expect(res.body).to.equal('wrong header');
  //     console.log('         TxHash Below:')
  //     console.log('         '+res.body)
  //     console.log('         ------------------------')
  //     console.log('         Response Status Code Below:')
  //     console.log('         '+res.statusCode)
  //     done()
  //   })
  //
  // })

  // it('Deploys an ICOContract', function(done) {
  //   this.timeout(2000000000);
  //   params = {
  //     tokenName:'BTC',
  //     tokenSymbol:'btchj',
  //     tokenDecimals:18,
  //     projectWallet:'0xe04202f262b79aa24e09f29a3461690efdf63f63',
  //     minimalInvestment:100,
  //     operator:'0xe04202f262b79aa24e09f29a3461690efdf63f63',
  //     quorum:2,
  //     pay_in_jot:true,
  //     sealTimestamp:2000000000
  //   }
  //   // OTHER PARAMS FOR THIS FUNCTION INCLUDE
  //
  //   request.post({
  //     headers: {'content-type' : 'application/x-www-form-urlencoded'},
  //     url:     urlBase+'/contracts/deploy/ICOContract',
  //     // json:require('querystring').stringify(params)
  //     form:params
  //   },function(err, res) {
  //     // console.log(Object.keys(res))
  //     // console.log(res.statusMessage)
  //     // console.log(res.body)
  //     expect(res.statusCode).to.equal(200);
  //     // expect(res.body).to.equal('wrong header');
  //     console.log('         TxHash Below:')
  //     console.log('         '+res.body)
  //     console.log('         ------------------------')
  //     console.log('         Response Status Code Below:')
  //     console.log('         '+res.statusCode)
  //     done()
  //   })
  // })

  // it('adds an ICO to the CommissionContract Whitelist', function(done) {
  //   params = {
  //     ICOContractAddress: '0xBc337E449252b9548000e65c49A22da2E08D7047'
  //   }
  //   request.post({
  //     headers: {'content-type' : 'application/x-www-form-urlencoded'},
  //     url:     urlBase+'/contracts/interact/CommissionContract',
  //     // json:require('querystring').stringify(params)
  //     form:params
  //   }, function(err, res) {
  //       expect(res.statusCode).to.equal(200);
  //       console.log('         TxHash Below:')
  //       console.log('         '+res.body)
  //       console.log('         ------------------------')
  //       console.log('         Response Status Code Below:')
  //       console.log('         '+res.statusCode)
  //       done()
  //   })
  // })

  it('Deploys an Invest Contract', function(done) {
    this.timeout(2000000000);
      params = {
        ICOContractAddress: '0xBc337E449252b9548000e65c49A22da2E08D7047',
        investorAddress: '0xe04202f262b79aa24e09f29a3461690efdf63f63',
        etherAmount:10000,
        tokenAmount:5000,
      }

      request.post({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     urlBase+'/contracts/deploy/InvestContract',
        // json:require('querystring').stringify(params)
        form:params
      },function(err, res) {
        // console.log(Object.keys(res))
        // console.log(res.statusMessage)
        // console.log(res.body)
        expect(res.statusCode).to.equal(200);
        // expect(res.body).to.equal('wrong header');
        console.log('         TxHash Below:')
        console.log('         '+res.body)
        console.log('         ------------------------')
        console.log('         Response Status Code Below:')
        console.log('         '+res.statusCode)
        done()
      })


  })




    // it('WORKS', async function(done) {
    //     pito = await rp.post(urlBase+'/contracts/deploy/JOTOracle', function(err, res, body) {
    //       // console.log(res.statusCode)
    //       assert.equal(res.statusCode,201)
    //       done()
    //     })
    //     console.log(pito)
    // })

    // it('Can Deploy an Oracle Contract', async function() {
    //   pito = await request.post(urlBase+'/contracts/deploy/JOTOracle', function(err, res, body) {
    //     // console.log(res.statusCode)
    //     assert.equal(res.statusCode,201)
    //     // done()
    //   })
    //   console.log(pito)
    // })

    // it('fails, as expected', function(done) { // <= Pass in done callback
    //   chai.request(urlBase+'/contracts/deploy/JOTOracle')
    //   .post('/')
    //   .end(function(err, res) {
    //     expect(res).to.have.status(123);
    //     done();                               // <= Call done to signal callback end
    //   });
    // });

    // it('should return 400', function (done) {
    //
    //   var eventFired = false;
    //
    //   request.post(urlBase+'/contracts/deploy/JOTOracle', function (err, res, body){
    //     expect(res.statusCode).to.equal(200);
    //     expect(res.body).to.equal('wrong header');
    //     eventFired = true;
    //     done();
    //   });
    //
    //   setTimeout(done, 0);
    //
    //   // setTimeout( function () {
    //   //   expect(eventFired).to.equal(true);
    //   //   done();
    //   // }, 200000);
    // });










})
// describe('')

//
// describe('API MAIN ROUTES', function() {
//   it('')
// })

// describe('API MAIN ROUTES', function() {
//   it('Is online',  function() {
//     console.log('MUKA')
//     request.post(
//         'http://localhost:3001/contracts/deploy/ICOContract',
//         { json: params },
//         function (error, response, body) {
//             if (!error && response.statusCode == 200) {
//                 // console.log(reponse.statusCode)
//             }
//             // console.log
//             assert.equal(400, response.statusCode)
//             done()
//             // return response.statusCode
//             // console.log(error)
//             // console.log(response.statusCode)
//
//             // console.log(body)
//         }
//     );
//
//     // mario = await request.post(
//       // 'http://localhost:3001/contracts/deploy/ICOContract',
//       // {json:params}
//     // )
//     // console.log(mario.body)
//     // console.log(vario)
//     // code = await request.
//     // console.log(code)
//     // request(url, function(err, response, body) {
//     //   console.log(response.statusCode)
//     //   // expect(response.statusCode).to.equal(20)
//     //   assert.equal(response.statusCode, 200,'problem')
//     //   done()
//     // })
//     // try {
//     //     var moon = await request.get(url); // this should throw exception
//     //     console.log(moon)
//     // } catch (err) {
//     //     console.log(err)
//     //     expect(err.statusCode).to.be.equal(401); // this is called
//     // }
//   })
// })


// const agent = require('superagent');
//
// describe('login()', function() {
//   it('success', async function() {
//     const params = {
//       email: 'test@test.com',
//       password: 'helloworld'
//     };
//
//     const token = await agent.post('/login', params);
//
//     assert.ok(token);
//     assert.ok(token._id);
//   });
// });
