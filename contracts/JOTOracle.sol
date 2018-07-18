pragma solidity ^0.4.17;

contract JOTOracle {
  // Contract owner
  address public owner;

  // BTC Marketcap Storage
  // uint public btcMarketCap;
  uint public JOTtoETH;

  // Callback function
  event CallbackGetJOT();

  constructor() public {
    owner = msg.sender;
  }

  function updateJOT() public {
    // Calls the callback function
    emit CallbackGetJOT();
  }

  function setJOT(uint _price) public {
    // If it isn't sent by a trusted oracle
    // a.k.a ourselves, ignore it
    require(msg.sender == owner);
    JOTtoETH = _price;
  }

  function getRTS() constant public returns (uint) {
    return JOTtoETH;
  }
}
