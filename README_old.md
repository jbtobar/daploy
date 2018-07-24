# Commission Contract Update

CommissionContract.sol
JOTOracle.sol

# Functionality

Main functionality of CommissionContract is that it receives commission from an InvestContract. If commission is in ETH it will transfer commission to juryOnlineWallet. If commission is in JOT it will keep ETH until JOT tokens are transferred from ICO to CommissionContract, then ETH is transferred to ICO. The ETH/JOT price is received when the ICOContract calls an oracle. CommissionContract also holds information about ICO's and InvestContracts.

The CommissionContract has two mappings of an address to a structure. The first one stores information about all of the InvestContracts associated with a specific ICO. One accesses this structure with the address of the ICO and has information regarding the number of investcontracts, the number of investcontracts deposited, whether it pays commission in jot, and an array with addresses of the deposited investcontracts. The second mapping stores information about a specific investcontract: it stores the address of the ICO associated with it, the amount of payment, and whether it paid or not.

The first mapping is ICOCommissions.

The second mapping is CommissionInfo.


## Interaction between contracts

CommissionContract is deployed first.

Then, during deployment of the ICO contract it is defined whether it will pay commissions in ETH or JOT. This is done by setting a boolean variable during construction.

#### Approving an ICOContract in CommissionContract
A Jury.Online operator must add the address of the ICO to a list of accepted ICO's in the CommissionContract. This is done via the 'addWhitelist()' function in CommissionContract, which maps an address to a boolean variable.

#### ICOContract added to CommissionContract
Then, when the ICOContract is sealed by the project operator, the ICOContracts calls the 'addNewICO(uint commission, bool pay_in_jot)' function in the CommissionContract. This function adds an entry the ICOCommissions mapping in CommissionContract.

#### InvestContract added to CommissionContract
Then, when the project operator adds an InvestContract via the 'addInvestContract()' function in ICOContract, this function calls the 'addNewInvestContract(address, bool pay_in_jot, uint amount)' function in the CommissionContract. This function adds the InvestContract to the CommissionInfo mapping in CommissionContract.

#### Commission funds transferred to CommissionContract
When an investor deposits funds into InvestContract, the payable function transfers the amount to the CommissionContract (before it transferred commission to JuryOnlineWallet). It then calls the 'investContractDeposited()' function in the ICOContract.

When 'investContractDeposited()' is called in ICOContract, after transferring the tokens to the InvestContract, it will look at the commissionAmount in the InvestContract and whether it is set to pay in JOT or ETH.

If it is set to pay in JOT, the function will call the JOTOracle to get the exchange rate. Then it will approve a transfer of JOT tokens from its address to the CommissionContract address. If this approval is successful - i.e if the ICOContract has enough JOT balance - the contract calls the 'payCommission()' function in CommissionContract.

If it is set to pay in ETH, it will call the 'payCommission()' function as well, disregarding the ETH/JOT rate.

#### CommissionContract releasing commission

When 'payCommission()' is called, it will do the following:
- If commission is in JOT, it will transfer its JOT balance from the ICOContract to itself, and then transfer the ETH funds received from the commission and transfer them to the project. (It then keeps JOT in its balance, although it could transfer them to juryOnlineWallet)
- If the commission is in ETH, it will transfer the ETH to JuryOnlineWallet.

Then it will update information in both mappings.


## For Testing

in this directory, run

> truffle test test/miniTest.js

or run

> truffle test

to run all tests, although not all are completed.

Currently the contract is passing tests for paying with ETH and JOT, milestone initiation, dispute opening, voting, and execution of veredicts.

# Notes

To see the functionality and architecture of CommissionContract look at CommissionContract.sol.
