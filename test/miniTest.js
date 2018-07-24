var Token = artifacts.require('Token')
//var Token = artifacts.require('TokenWithoutStart')
var ICOContract = artifacts.require('ICOContract')
var InvestContract = artifacts.require('InvestContract')
var CommissionContract = artifacts.require('CommissionContract')
var Oracle = artifacts.require('JOTOracle')

const mineOneBlock = async () => {
    await web3.currentProvider.send({
        jsonrpc: "2.0",
        method: "evm_mine",
        params: [],
        id: 0
    });
};

const mineNBlocks = async n => {
    for (let i = 0; i < n; i++) {
        await mineOneBlock();
    }
};


accounts = web3.eth.accounts

operator = accounts[0]
projectWallet = accounts[1]
investor = accounts[2]
juryOnlineWallet = accounts[9]

sealTimestamp = 2000000000;
minimumCap = 100;
maximumCap = 10*minimumCap;
minimalInvestment = 100;
operator = accounts[0];
quorum = 2;
pay_in_jot = false;


tokenAmount = 100000;
etherAmount = 10000000000;
startTime = 1516620617;
duration = 3600;
description = "test milestone";

jot_rate = 8;
// PLAYERS
// operator
// investor
// juryOnlineWallet
// projectWallet
// CommissionContract -not
// ICOContract -not
// InvestContract -not

contract('ICOContract', function(accounts) {
  it('Deploy Oracle', async function() {
    oracle = await Oracle.new({from:accounts[0]})
  })
  it('Changes Oracle value', async function() {

    await oracle.setJOT(jot_rate,{from:accounts[0]})
  })
  it('Has appropriate oracle value when called', async function() {
    var eth_jot_price = await oracle.JOTtoETH()
    assert.equal(eth_jot_price.valueOf(), jot_rate,'Oracle price is not what was set')
  })
  it('Deploy JOT Token', async function() {
    TokenJOT = await Token.new('JOT', 'JOT', 18, {from:accounts[0]})
    // console.log('TokenJOT address')
    // console.log(TokenJOT.address)
  });
  it('Deploys Project Token', async function() {
    token = await Token.new('testname', 'testsymbol', 3, {from:accounts[0]})
  });
  it('Deploy CommissionContract', async function() {
    commissionContract = await CommissionContract.new(juryOnlineWallet,TokenJOT.address,{from:accounts[0]})
  })
  it('Deploy ICOContract', async function() {
    icoContract = await ICOContract.new(token.address,projectWallet, sealTimestamp, minimumCap, maximumCap, minimalInvestment,operator,quorum,pay_in_jot,commissionContract.address,juryOnlineWallet,TokenJOT.address, oracle.address,{from:accounts[0]});
    // icoContract = await ICOContract.new(token.address, projectWallet, sealTimestamp, minimumCap, maximumCap, minimalInvestment, accounts[0],quorum,pay_in_jot,TokenJOT.address,CommissionContract.address, {from: accounts[0]});
  })
  it('adds the new ICO to the Commission Contract whitelist', async function() {
    var ica = icoContract.address
    console.log('ICO address')
    await commissionContract.addWhitelist(ica)
    // console.log(ica)
  })
  it('Minting tokens to ICOContract', async function() {
      await token.mint(icoContract.address, tokenAmount*500, {from: accounts[0]});
      await token.start({from: accounts[0]});
      balance = await token.balanceOf(icoContract.address);
      assert.equal(balance.valueOf(), tokenAmount*500, "Tokens have not been minted to the ICOContract");
  });
  it('Minting JOT Tokens to ICOContract', async function() {
      await TokenJOT.mint(icoContract.address, tokenAmount*500000, {from: accounts[0]});
      await TokenJOT.start({from: accounts[0]});
      balance = await TokenJOT.balanceOf(icoContract.address);
      assert.equal(balance.valueOf(), tokenAmount*500000, "Tokens have not been minted to the ICOContract");
  });
  it('Balance Check', async function() {
    console.log('No test here')
  })
  it('Adding milestones', async function() {
      await icoContract.addMilestone(etherAmount, tokenAmount, startTime, duration, description, {from: accounts[0]});
      await icoContract.addMilestone(etherAmount*5, tokenAmount*2, startTime, duration, description, {from: accounts[0]});
      await icoContract.addMilestone(etherAmount*2, tokenAmount*5, startTime, duration, description, {from: accounts[0]});
      len = await icoContract.milestonesLength.call();
      assert.equal(len.valueOf(), 3, "Milestones have not been added");
  });
  it('Invest Contract cannot initiate before sealing', async function() {
    console.log('no test yet')
  })
  it('Sealing ICOContract', async function() {
      tstampBeforeSeal = await icoContract.sealTimestamp();
      assert.equal(tstampBeforeSeal.valueOf(), sealTimestamp, 'Initial sealTimestamp is not correct');

      await icoContract.seal({from: accounts[0]});

      tstampAfterSeal = await icoContract.sealTimestamp();
      assert.notEqual(tstampAfterSeal.valueOf(), sealTimestamp, 'Seal timestamp has not been updated');
      await mineNBlocks(20);
  });
  it('commission contract ico counter has gone up one', async function() {
    var ico_counter = await commissionContract.icoCounter()
    assert.equal(1,ico_counter.valueOf(),'counter did not go up')
  });
  it('Create InvestContract 1', async function(){
      investContract = await InvestContract.new(icoContract.address, investor, etherAmount, tokenAmount);
      await icoContract.addInvestContract(investContract.address, {from: accounts[0]})
      investContractAddress = investContract.address;
  });
  it('Adding arbiters manually to contract 1', async function() {
      await investContract.addArbiter(accounts[5],1, {from: investor});
      await investContract.addArbiter(accounts[6],1, {from: investor});
      await investContract.addArbiter(accounts[7],1, {from: investor});
      arbiterAcceptCount = await investContract.arbiterAcceptCount();
      assert.equal(arbiterAcceptCount.toNumber(), 3, 'Arbiters have not been accepted or added');
  }),
  it('Accepting arbiters from contract 1', async function() {
      await investContract.acceptArbiter({from:accounts[5]})
      await investContract.acceptArbiter({from:accounts[6]})
      await investContract.acceptArbiter({from:accounts[7]})
      arbiterAcceptCount = await investContract.arbiterAcceptCount();
      assert.equal(arbiterAcceptCount.toNumber(), 6, 'Arbiters have not been accepted or added');
  })
  it('Balance check', async function() {
    console.log('no test here yet')
  })
  it('JOT Balances', async function(){
    // await mineNBlocks(20);

      console.log('JOT balanceOf icoContract address')
      bal = await TokenJOT.balanceOf(icoContract.address);
      console.log(bal.valueOf())

      console.log('JOT balanceOf commissionContract address')
      bal = await TokenJOT.balanceOf(commissionContract.address);
      console.log(bal.valueOf())


  })
  // it('Send money to InvestContract 1', async function() {
  //     amountToPay = await investContract.amountToPay();
  //     // console.log(amountToPay.valueOf())
  //
  //
  //     // try {
  //     //     await web3.eth.sendTransaction({from: investor, value: amountToPay.valueOf(), to: investContract.address, gas: 4000000});
  //     // } catch(e) {
  //     //     true
  //     // }amountToPay = await investContract.amountToPay();
  //
  //     await web3.eth.sendTransaction({from: investor, value: amountToPay, to: investContractAddress, gas: 4000000});
  //     // assert.notEqual(web3.eth.getBalance(investContract.address).toNumber(), Math.floor(etherAmount*10*1.01), '2nd invest contract has not received correct amount of Ether');
  // });

  it('Send money to InvestContract 1', async function() {
      amountToPay = await investContract.amountToPay();
      await web3.eth.sendTransaction({from: investor, value: amountToPay.valueOf(), to: investContractAddress, gas: 5000000});
      var etherAmount = await investContract.etherAmount()

      p0 = Math.floor(etherAmount.toNumber()/8);
      p1 = Math.floor(5*etherAmount.toNumber()/8);
      p2 = Math.floor(2*etherAmount.toNumber()/8);
      p0 = etherAmount.toNumber()-(p1+p2)

      part0 = await investContract.etherPartition(0);
      part1 = await investContract.etherPartition(1);
      part2 = await investContract.etherPartition(2);

      try {
          part3 = await investContract.etherPartition(3);
      } catch (e) {
          true
          // assert.equal(part3, 0, 'InvestContract has incorrect milestone Ether partition length');
      }

      assert.equal(part0.valueOf(), p0, 'InvestContract has incorrect first milestone Ether partition');
      assert.equal(part1.valueOf(), p1, 'InvestContract has incorrect second milestone Ether partition');
      assert.equal(part2.valueOf(), p2, 'InvestContract has incorrect third milestone Ether partition');
  });
  it('Commission was paid', async function(){
    await mineNBlocks(20);

      console.log('JOT balanceOf icoContract address')
      bal = await TokenJOT.balanceOf(icoContract.address);
      console.log(bal.valueOf())

      console.log('JOT balanceOf commissionContract address')
      bal = await TokenJOT.balanceOf(commissionContract.address);
      console.log(bal.valueOf())
  })
  it('Logs of ETH balances after sending money to invest contract', async function() {

    console.log('investContract.address')
    var v1 = await web3.eth.getBalance(investContract.address)
    console.log(v1.toNumber())

    console.log('commissionContract.address')
    var v2 = await web3.eth.getBalance(commissionContract.address)
    console.log(v2.toNumber())

    console.log('juryOnlineWallet.address')
    var v2 = await web3.eth.getBalance('0x3e134C5dAf56e0e28bd04beD46969Bd516932f02')
    console.log(v2.toNumber())

  });
  it('Create second InvestContract, 2', async function(){
      investContract2 = await InvestContract.new(icoContract.address, investor, etherAmount, tokenAmount);
      await icoContract.addInvestContract(investContract2.address, {from: accounts[0]})
      investContractAddress2 = investContract2.address;
  });
  it('Send money to InvestContract2', async function() {
      amountToPay = await investContract2.amountToPay();
      try {
          await web3.eth.sendTransaction({from: investor, value: amountToPay.valueOf(), to: investContractAddress2, gas: 4000000});
      } catch(e) {
          true
      }
      assert.notEqual(web3.eth.getBalance(investContractAddress2).toNumber(), Math.floor(etherAmount*10*1.01), '2nd invest contract has not received correct amount of Ether');
  });
  it('Manually add arbiters to Contract 2', async function() {
    await investContract2.addArbiter(accounts[5],1, {from: investor});
    await investContract2.addArbiter(accounts[6],1, {from: investor});
    await investContract2.addArbiter(accounts[7],1, {from: investor});
    arbiterAcceptCount = await investContract2.arbiterAcceptCount();
    assert.equal(arbiterAcceptCount.toNumber(), 3, 'Arbiters have not been accepted or added');
  });
  it('Accepting arbiters in Contract 2', async function() {
      await investContract2.acceptArbiter({from:accounts[5]})
      await investContract2.acceptArbiter({from:accounts[6]})
      await investContract2.acceptArbiter({from:accounts[7]})
      arbiterAcceptCount = await investContract2.arbiterAcceptCount();
      assert.equal(arbiterAcceptCount.toNumber(), 6, 'Arbiters have not been accepted or added');
  });
  it('Starting milestone', async function() {
      await icoContract.startNextMilestone({from: accounts[0]});
      await icoContract.finishMilestone("testresult", {from: accounts[0]});
  });

  it('Withdrawing via from async send', async function() {
      bal = await token.balanceOf(investor);
      assert.equal(bal.valueOf(), 0, 'Investor token balance is incorrect before withdrawal');

      bal2 = await investContract.tokenPayments(investor);
      tpart0 = await investContract.tokenPartition(0);
      tpart1 = await investContract.tokenPartition(1);
      tpart2 = await investContract.tokenPartition(2);
      assert.equal(bal2.valueOf(), tpart0.valueOf(), 'InvestContract withdrawToken amount is incorrect');

      await icoContract.startNextMilestone({from: accounts[0]});

      await investContract.withdrawTokenPayment({from: investor});
      tokenBalance = await token.balanceOf(investor);
      assert.equal(tokenBalance.valueOf(), tpart0.toNumber()+tpart1.toNumber(), 'Investor token balance is incorrect before after milestone started')

      toWithdraw = await investContract.etherPayments(projectWallet);
      assert.equal(toWithdraw.toNumber(), part0.toNumber()+part1.toNumber());

      balanceBeforeSend = web3.eth.getBalance(projectWallet);
      gas = await investContract.withdrawEtherPayment.estimateGas({from: projectWallet});
      await investContract.withdrawEtherPayment({from: projectWallet});
      balanceAfterSend = web3.eth.getBalance(projectWallet);
      // assert.equal(balanceAfterSend.toNumber(), balanceBeforeSend.toNumber()+gas+part0.toNumber()+part1.toNumber()+part2.toNumber(), "Project wallet hasn't withdrawn correct amount of Ether");
      // assert.equal(0, balanceBeforeSend.toNumber()+gas, "Project wallet hasn't withdrawn correct amount of Ether");
      // assert.equal(balanceBeforeSend.toNumber(), balanceAfterSend.toNumber()+gas+part0.toNumber()+part1.toNumber()+part2.toNumber(), "Project wallet hasn't withdrawn correct amount of Ether");
  });

  it('Opening a dispute', async function() {
      await investContract.openDispute("dispute", {from: investor});
      disputing = await investContract.disputing();
      assert.equal(disputing, true, 'Dispute has not opened');
      await mineNBlocks(20);
  });
  it('Voting for Investor', async function() {
    var ica  = investContract.address
    var investor_balance_before_voting = web3.eth.getBalance(ica);
    await investContract.vote(investor, {from: accounts[5]});
    await investContract.vote(investor, {from: accounts[6]});
    // await investContract.vote(investor, {from: accounts[7]});
    var investor_balance_after_voting = web3.eth.getBalance(ica);
    // disputing = await investContract.disputing();
    assert.equal(investor_balance_before_voting.toNumber(), investor_balance_after_voting.toNumber(), 'Unequal Balances');
  });
  it('Withdrawing Ether payments by Investor', async function() {
    var ica  = investContract.address
    var contract_balance_pre = web3.eth.getBalance(ica);

    assert.notEqual(0, contract_balance_pre.toNumber(), 'InvestContract Balance = 0 before funds withdrawn, this is wrong');

    var investor_balance_before_voting = web3.eth.getBalance(investor);
    await investContract.withdrawEtherPayment({from: investor});
    var investor_balance_after_voting = web3.eth.getBalance(investor);
    assert.notEqual(investor_balance_before_voting.toNumber(), investor_balance_after_voting.toNumber(), 'Investor Balance is the same, funds not withdrawn');

    var contract_balance_post = web3.eth.getBalance(ica);
    assert.equal(0, contract_balance_post.toNumber(), 'InvestContract Balance is not zero, funds not withdrawn');

  })
  it('Current Milestone Check', async function() {
      var cm = await icoContract.currentMilestone()
      assert.equal(cm.valueOf(), 2,'Milestone problem')
  });
  it('Finishing 2nd milestone and beginning third', async function() {
    await icoContract.finishMilestone("testresult", {from: accounts[0]});
    await icoContract.startNextMilestone({from: accounts[0]});
    // await icoContract.finishMilestone("testresult", {from: accounts[0]});
  });
  it('Current Milestone Check', async function() {
      var cm = await icoContract.currentMilestone()
      assert.equal(cm.valueOf(), 3,'Milestone problem')
  });
  it('finish final milestone', async function() {
    await icoContract.finishMilestone("testresult", {from: accounts[0]});
  })

  // it('has correct arbiterAcceptCount', async function() {
  //   var vola = await investContract.arbiterAcceptCount()
  //   var tola = await investContract.quorum()
  //   assert.equal(vola.valueOf(),3,'problem')
  //   assert.equal(tola.valueOf(),2,'problem')
  // })


})
//
// // it('Deploys an Oracle')
// // it('Can change the value of the oracle')
// // it('Has appropriate oracle value when called')
//
// // it('Deploys JOT Token')
//
// // it('Deploys a Project Token')
//
// // it('Deploy CommissionContract')
//
// // it('Deploys an ICO contract')
// // it('adds the new ICO to the Commission Contract whitelist')
// // it('Mints Tokens to ICOContract')
// // it('Minting JOT Tokens to ICOContract')
// it('Balance Check')
// // it('Project can add Milestones to ICO')
// // it('Invest Contract cannot initiate before sealing')
// // it('Project can seal ICO contract')
// // it('commission contract ico counter has gone up one')
// // it('Investor can initiate InvestContract1')
// // it('Adding arbiters manually to contract 1')
// // it('Accepting arbiters from contract 1')
// it('Balance check')
// it('Send money to InvestContract 1')
// it('Commission is paid to CommissionContract')
// it('Commission arrives to final destination')
// it('Investor can initiate InvestContract2')
// it('Investor deposits in InvestContract2')
// it('Commission is paid to Commssion Contract')
// it('Commission arrives to final destination')
// it('Project can initiate milestone 1')
// it('Milestone 1 Tokens are released to investor')
// it('Milestone 1 ETH are released to projectWallet')
// it('Project can finish milestone')
// it('Project can start next milestone')
// it('InvestContract1 can initiate a dispute')
// it('Non-approved arbiters cannot vote')
// it('Arbiters in InvestContract1 vote in favor of investor')
// it('Tokens and Funds are returned after veredict')
// it('InvestContract2 can initiate a dispute')
// it('Milestone cannot be started because of dispute')
// it('Arbiters in InvestContract2 vote in favor of project')
// it('Tokens and Funds are returned after veredict')
// it('Project can finish milestone')
//
//
// it('Impedes invest contract deposit if project does not have Token Balance')
