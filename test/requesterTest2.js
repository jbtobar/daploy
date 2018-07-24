// REQUEST TEST SCRIPT
var request = require('request');
var rp = require('request-promise')
var expect  = require('chai').expect;
var assert = require('assert');
var chai = require('chai')
chaiHttp = require('chai-http');
chai.use(chaiHttp);
// API URL
// const url = 'http://localhost:3001/contracts'
urlBase= 'http://localhost:3001'

describe('API MAIN ROUTES', function() {
    // it('IS ON', function(done) {
    //     params = {
    //       a:'a'
    //     }
    //     request.post({
    //         headers: {'content-type' : 'application/x-www-form-urlencoded'},
    //         url:     urlBase+'/deployAll',
    //         form:params
    //     }, function(err, res) {
    //         expect(res.statusCode).to.equal(200);
    //         console.log(res.body)
    //         done()
    //     })
    // })

    // it('Deploys ICO', function(done) {
    //   params = {
    //     default:true,
    //   }
    //   request.post({
    //       headers: {'content-type' : 'application/x-www-form-urlencoded'},
    //       url:     urlBase+'/contracts/deploy/ICOContract',
    //       form:params
    //   }, function(err, res) {
    //       expect(res.statusCode).to.equal(200);
    //       console.log(res.body)
    //       done()
    //   })
    // })

    // it('adds a milestone to an ico', function(done) {
    //   params = {
    //     default:true,
    //     defaultNumber: 3,
    //     ICOAddress:'0x7Ba11E66BBb5d1aF0dBBb1CbE433cafa81649916',
    //   }
    //   request.post({
    //       headers: {'content-type' : 'application/x-www-form-urlencoded'},
    //       url:     urlBase+'/contracts/interact/ICOContract/milestones',
    //       form:params
    //   }, function(err, res) {
    //       expect(res.statusCode).to.equal(200);
    //       console.log(res.body)
    //       done()
    //   })
    // })

    // it('seals an ico', function(done) {
    //   params = {
    //     default:true,
    //     ICOAddress:'0x7Ba11E66BBb5d1aF0dBBb1CbE433cafa81649916',
    //   }
    //   request.post({
    //       headers: {'content-type' : 'application/x-www-form-urlencoded'},
    //       url:     urlBase+'/contracts/interact/ICOContract/seal',
    //       form:params
    //   }, function(err, res) {
    //       expect(res.statusCode).to.equal(200);
    //       console.log(res.body)
    //       done()
    //   })
    // })

    // it('Investor launches Invest Contract', function(done) {
    //   params = {
    //     default:true,
    //     ICOAddress:'0x7Ba11E66BBb5d1aF0dBBb1CbE433cafa81649916',
    //   }
    //   request.post({
    //       headers: {'content-type' : 'application/x-www-form-urlencoded'},
    //       url:     urlBase+'/contracts/deploy/InvestContract',
    //       form:params
    //   }, function(err, res) {
    //       expect(res.statusCode).to.equal(200);
    //       console.log(res.body)
    //       done()
    //   })
    // })

    it('ICO operator adds Invest Contract', function(done) {
      params = {
        default:true,
        InvestContractAddress:'0xf6573A467aC26275b989AE69bE2681B0F5D55b35',
        ICOAddress:'0x7Ba11E66BBb5d1aF0dBBb1CbE433cafa81649916',
      }
      request.post({
          headers: {'content-type' : 'application/x-www-form-urlencoded'},
          url:     urlBase+'/contracts/interact/ICOContract/addInvestContract',
          form:params
      }, function(err, res) {
          expect(res.statusCode).to.equal(200);
          console.log(res.body)
          done()
      })
    })


    // it('RETURN ADDRESSES', function(done) {
    //   request.get(urlBase+'/addresses',function(err, res,body) {console.log(res.body);done()})
    // })

})
