pragma solidity ^0.4.20;
import "./ERC20Token.sol";
import "./JOTOracle.sol";
// PRELIMINARY CONSIDERATIONS:

// A commission is initiated with the funding of an InvestContract, thus
// One commission is associated with one InvestContract, and
// One InvestContract is associated to one ICOContract.

// An ICOContract has many InvestContracts, and thus many commissions


// Commissions in ETH only depend on the Investor Funding the Contract.
// Commissions in JOT depend on the ICO address having an allowance.

/*
CommissionContract sample architecture:

Mappings:
 -- commissions_inv
        Here the key is the address of the InvestContract, and the value is a
        struct containing:
        - address ICOAddress; (address of ICO associated with InvestContract)
        - uint payment; (amount of commission that has to be payed)
        - bool payed; (whether the InvestContract was deposited)

 -- commissions_ico
        Here the key is the address of the ICOContract, and the value is a
        struct containing:
        - uint number_of_invest_contracts; (counts how many InvestContract added)
        - uint number_of_payed_contracts; (counts how many InvestContract deposited)
        - uint commission; (commission in percentage defined by ICOContract)
        - bool jot; (whether commission is in JOT or not)
        - address[] invest_contracts; (a list of the addresses of payed InvestContracts)

These two mappings allow to find whether a specific investment contract as payed
and the amount required, and also to find all of the investcontracts associated
with a specific ICO.

Functionality:

- When an ICOContract is deployed, it calls this contract so that it adds
    that ICO to the mapping of ICO's
- When an InvestContract is added, either InvestContract or ICOContract call
    this contract so that it adds information about pending InvestContracts
- When an InvestContract is payed, either InvestContract or ICOContract call
    this contract so it updates the payment information

Payment Logic:

(At the moment, ETH commission is done as a transfer directly from InvestContract
    to JuryOnlineWallet. We can change it to the following, so that
    CommissionContract handles the payments)

- InvestContract transfers ETH commission to CommissionContract.
- If commission payment is set as ETH, then CommissionContract immediately
    transfers commission to JuryOnlineWallet
- If commission payment is set as JOT, then CommissionContract holds the ETH
    payment, checks if ICOContract has enough JOT allowance to give to Jury,
    if it does, then JOT allowance is made and ETH is transfered to Project.


Changes in ICO and InvestContract:

InvestContract changes:
    - the payable function, instead of having a transfer to JuryOnlineWallet, it
    could have a transfer to CommissionContract.
        (Note: if we do this, then ETH commissions have to go through 2 transfers
        instead of directly, so we could have a logic the if its ETH payment, then
        transfer is done directly to juryOnlineWallet and if its JOT, then transfer
        ETH to CommissionContract. However, this would not compartmentalize
        commission handling)
ICOContract changes:
    - When InvestContract calls investContractDeposited(), if commission is in
    JOT, then contract makes an allowance for JOT tokens. If allowance is made
    succesfully then notifies CommissionContract. CommissionContract then
    releases ETH to project.







 */
// Right now no protection to what contracts can addNewICO
// There are no modifiers


contract CommissionContract {
    using SafeMath for uint256;
    // only WhiteListed ICO contracts can interact with this contract
    // Only JuryOnlineOperator can add ICO's to whitelist
    mapping(address => bool) public whitelistedICO;
    //--------------------------------------------------------------------------
    // The below maps the address of the InvestContract with a CommissionInfo struct
    // This only allows access by knowing address of InvestContract
    struct commissionInfo {
        address ICOAddress;
        // JOT field may be redundant since it is set by ICOContract
        bool jot;
        uint payment;
        bool payed;
    }
    mapping(address => commissionInfo) public commissionsInvestContracts;
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    // The below maps the address of an ICOContract with a list of InvestContracts
    // This allows access to the InvestContracts associated with an ICOContract
    struct ICOCommissions {
        uint numberOfInvestContracts;
        uint numberOfPayedContracts;
        uint commission;
        bool jot;
        address[] investContracts;
    }
    mapping(address => ICOCommissions) public commissionsICO;
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    uint public icoCounter = 0;
    uint public commissionPaymentCounter = 0;
    Token public tokenJOT;
    address public juryOnlineWallet;
    address public jotTokenAddress;
    //address public juryOnlineWallet = 0x3e134C5dAf56e0e28bd04beD46969Bd516932f02;
    //address public jotTokenAddress = 0xaa588d3737b611bafd7bd713445b314bd453a5c8;
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    modifier onlyApprovedICO() {
      require(whitelistedICO[msg.sender] == true);
      _;
    }

    /* modifier onlyOperator() {
      require()
    } */
    constructor(address _juryOnlineWallet, address _jotTokenAddress) public {
        juryOnlineWallet = _juryOnlineWallet;
        jotTokenAddress = _jotTokenAddress;
        tokenJOT = Token(jotTokenAddress);
    }

    function addWhitelist(address _approvedICO) public {
      whitelistedICO[_approvedICO] = true;
    }


    function addNewICO(uint _commission, bool payInJOT) public onlyApprovedICO {
        // Called by ICOContract, creates entry in commissions_ico mapping
        commissionsICO[msg.sender].commission = _commission;
        commissionsICO[msg.sender].jot = payInJOT;

        commissionsICO[msg.sender].numberOfInvestContracts = 0;
        commissionsICO[msg.sender].numberOfPayedContracts = 0;
        icoCounter = icoCounter.add(1);
        /* ico_counter = ico_counter + 1; */
    }

    function addNewInvestContract(address _investContractAddress, bool payInJOT, uint _payment) public onlyApprovedICO {
        // Called by ICOContract, creates entry in commissions_inv mapping
        commissionsInvestContracts[_investContractAddress].ICOAddress = msg.sender;
        commissionsInvestContracts[_investContractAddress].jot = payInJOT;
        commissionsInvestContracts[_investContractAddress].payment = _payment;
        commissionsInvestContracts[_investContractAddress].payed = false;

        commissionsICO[msg.sender].numberOfInvestContracts = commissionsICO[msg.sender].numberOfInvestContracts.add(1);
    }

    function() payable public {
      /* commission_payment_counter = commission_payment_counter + 1; */
    }

    function payCommission(bool payInJOT, address _investContractAddress, uint _commisionPaid, uint _commissioninJOT, address _projectWallet) public onlyApprovedICO {
        // Called by ICOContract funds deposited and commission can be payed

        //require(commissions_inv[msg.sender].payment == _payment) maybe unnecesary because already defined in InvestContract

        if (payInJOT) {
            // Logic to Pay in JOT
            assert(tokenJOT.transferFrom(msg.sender, this, _commissioninJOT));
            // This sends ETH to Project Wallet since it was paid in JOT
            _projectWallet.transfer(_commisionPaid);
            tokenJOT.approve(juryOnlineWallet, _commissioninJOT);
        } else {
            // ETH Logic, send ETH to JuryOnlineWallet
            juryOnlineWallet.transfer(_commisionPaid);
        }

        //
        commissionsInvestContracts[_investContractAddress].payed = true;


        // Do I need to Storage?
        ICOCommissions storage commIco = commissionsICO[msg.sender];
        uint numPayedContracts = commIco.numberOfPayedContracts;
        /* comm_ico.invest_contracts[npc] = msg.sender; */
        commIco.numberOfPayedContracts = numPayedContracts.add(1);
        commIco.investContracts.push(msg.sender);

    }


}
