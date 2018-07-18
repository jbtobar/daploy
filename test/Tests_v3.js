//Soon to be ported from private repository

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
pay_in_jot = true;


tokenAmount = 100000;
etherAmount = 10000000000;
startTime = 1516620617;
duration = 3600;
description = "test milestone";

// 0x30753E4A8aad7F8597332E813735Def5dD395028
// 0x30753e4a8aad7f8597332e813735def5dd395028
// 0x30753e4a8aad7f8597332e813735def5dd395028


contract('ICOContract', function(accounts) {

  it('Deploy Oracle', async function() {
    oracle = await Oracle.new({from:accounts[0]})
    // console.log(oracle.address)
  })
  it('Changes Oracle value', async function() {
    await oracle.setJOT(8,{from:accounts[0]})
  })
  it('Appropriate Oracle value', async function() {
    var eth_jot_price = await oracle.JOTtoETH()
    assert.equal(eth_jot_price.valueOf(), 8,'fakiki')
  })

  it('Deploy JOT Token', async function() {
    TokenJOT = await Token.new('JOT', 'JOT', 18, {from:accounts[0]})
    // console.log('TokenJOT address')
    // console.log(TokenJOT.address)
  });

  // it('Mint JOT Tokens', async function(){});

  it('Deploy Project Token Contract', async function() {
    token = await Token.new('testname', 'testsymbol', 3, {from:accounts[0]})
  });

  it('Deploy CommissionContract', async function() {
    commissionContract = await CommissionContract.new({from:accounts[0]})
  })

  it('Deploy ICOContract', async function() {
    icoContract = await ICOContract.new(token.address,projectWallet, sealTimestamp, minimumCap, maximumCap, minimalInvestment,operator,quorum,pay_in_jot,commissionContract.address,juryOnlineWallet,TokenJOT.address, {from:accounts[0]});
    // icoContract = await ICOContract.new(token.address, projectWallet, sealTimestamp, minimumCap, maximumCap, minimalInvestment, accounts[0],quorum,pay_in_jot,TokenJOT.address,CommissionContract.address, {from: accounts[0]});
  })
  it('logs projectWallet address', async function() {
    var blu = await icoContract.projectWallet()
    console.log('project wallet address')
    console.log(blu.valueOf())
  })
  it('adds the new ICO to the Commission Contract whitelist', async function() {
    var ica = icoContract.address
    console.log('ICO address')
    await commissionContract.addWhitelist(ica)
    // console.log(ica)
  })
  it('Is set to pay_in_jot', async function() {
    pij = await icoContract.pay_in_jot()
    // assert.equal(pij.valueOf(),true,'you fucked son')
    console.log('Paying in JOT?')
    console.log(pij.valueOf())
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

  it('Adding milestones', async function() {
      await icoContract.addMilestone(etherAmount, tokenAmount, startTime, duration, description, {from: accounts[0]});
      await icoContract.addMilestone(etherAmount*5, tokenAmount*2, startTime, duration, description, {from: accounts[0]});
      await icoContract.addMilestone(etherAmount*2, tokenAmount*5, startTime, duration, description, {from: accounts[0]});
      len = await icoContract.milestonesLength.call();
      assert.equal(len.valueOf(), 3, "Milestones have not been added");
  });
  it('Sealing ICOContract', async function() {
      tstampBeforeSeal = await icoContract.sealTimestamp();
      assert.equal(tstampBeforeSeal.valueOf(), sealTimestamp, 'Initial sealTimestamp is not correct');

      await icoContract.seal({from: accounts[0]});

      tstampAfterSeal = await icoContract.sealTimestamp();
      assert.notEqual(tstampAfterSeal.valueOf(), sealTimestamp, 'Seal timestamp has not been updated');
      await mineNBlocks(20);
  });
  // it('JOT balance for ICO', async function(){
  //   await mineNBlocks(5);
  //
  //     console.log('JOT balanceOf icoContract address')
  //     bal = await TokenJOT.balanceOf(icoContract.address);
  //     console.log(bal.valueOf())
  //
  //
  // })
  it('commission contract ico counter has gone up one', async function() {
    var ico_counter = await commissionContract.ico_counter()
    assert.equal(1,ico_counter.valueOf(),'counter did not go up')
  });

  it('Create InvestContract 1', async function(){
      investContract = await InvestContract.new(icoContract.address, investor, etherAmount, tokenAmount);
      await icoContract.addInvestContract(investContract.address, {from: accounts[0]})
      investContractAddress = investContract.address;
  });
  it('has correct arbiterAcceptCount', async function() {
    var vola = await investContract.arbiterAcceptCount()
    var tola = await investContract.quorum()
    assert.equal(vola.valueOf(),3,'problem')
    assert.equal(tola.valueOf(),2,'problem')
  })
  // it('Logs JuryOnlineWallet balance', async function() {
  //
  //   console.log('Initial ETH juryOnlineWallet')
  //   var v2 = await web3.eth.getBalance(juryOnlineWallet)
  //   console.log(v2.toNumber())
  //
  //   console.log('Initial ETH juryOnlineWallet')
  //   var v2 = await web3.eth.getBalance(juryOnlineWallet)
  //   console.log(v2.toNumber())
  //
  //
  // })
  it('JOT Balances', async function(){
    // await mineNBlocks(20);

      console.log('JOT balanceOf icoContract address')
      bal = await TokenJOT.balanceOf(icoContract.address);
      console.log(bal.valueOf())

      console.log('JOT balanceOf commissionContract address')
      bal = await TokenJOT.balanceOf(commissionContract.address);
      console.log(bal.valueOf())


  })
  it('Logs out the commission amount from InvestContract', async function() {
    var commissionAmount = await investContract.commissionAmount();
    console.log('Commission amount from investContract.commissionAmount().')
    console.log(commissionAmount.valueOf())
  })
  it('Logs of ETH balances before sending money to invest contract', async function() {
    // console.log('investContract.address')
    // var v1 = await web3.eth.getBalance(investContract.address)
    // console.log(v1.toNumber())
    // console.log('commissionContract.address')
    // var v2 = await web3.eth.getBalance(commissionContract.address)
    // console.log(v2.toNumber())
    console.log('juryOnlineWallet.address')
    var v2 = await web3.eth.getBalance('0x3e134C5dAf56e0e28bd04beD46969Bd516932f02')
    console.log(v2.toNumber())
  });
  it('Send money to InvestContract 1', async function() {
      amountToPay = await investContract.amountToPay();
      // console.log(amountToPay.valueOf())


      // try {
      //     await web3.eth.sendTransaction({from: investor, value: amountToPay.valueOf(), to: investContract.address, gas: 4000000});
      // } catch(e) {
      //     true
      // }amountToPay = await investContract.amountToPay();

      await web3.eth.sendTransaction({from: investor, value: amountToPay, to: investContractAddress, gas: 4000000});
      // assert.notEqual(web3.eth.getBalance(investContract.address).toNumber(), Math.floor(etherAmount*10*1.01), '2nd invest contract has not received correct amount of Ether');
  });
  // it('will log commission contract address', async function() {
  //   bal = await icoContract.commission_contract_address()
  //   console.log(bal)
  // })
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
})
