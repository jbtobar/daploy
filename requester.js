// REQUEST TEST SCRIPT

// this is the script to check the contracts API
var request = require('request');

// API URL
const url = 'http://localhost:3001'

// CHECK 1 - API is LIVE
//
//
// request.post(
//     'http://localhost:3001/contracts/deploy/ICOContract',
//     { json: params },
//     function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             console.log(body)
//         }
//         // console.log(error)
//         console.log(response)
//         // console.log(body)
//     }
// );



// localhost:3001/contracts/deploy/ICOContract
// ?
// tokenName=BTC&
// tokenSymbol=btchj&
// tokenDecimals=18&
// projectWallet=0xe04202f262b79aa24e09f29a3461690efdf63f63&
// minimalInvestment=100&
// operator=0xe04202f262b79aa24e09f29a3461690efdf63f63&
// quorum=2&
// pay_in_jot=true&
// sealTimestamp=2000000000

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



request.post(
    'http://localhost:3001/contracts/deploy/ICOContract',
    { json: params },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
        // console.log(error)
        // console.log(response)
        // console.log(body)
    }
);
