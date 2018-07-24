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
    it('IS ON', function(done) {
        params = {
          a:'a'
        }
        request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url:     urlBase+'/deployAll',
            form:params
        }, function(err, res) {
            // console.log(Object.keys(res))
            // console.log(res.statusMessage)
            // console.log(res.body)
            expect(res.statusCode).to.equal(200);
            console.log(res.body)
            // // expect(res.body).to.equal('wrong header');
            // console.log('         TxHash Below:')
            // console.log('         '+res.body)
            // console.log('         ------------------------')
            // console.log('         Response Status Code Below:')
            // console.log('         '+res.statusCode)
            done()
        })
    })

})
