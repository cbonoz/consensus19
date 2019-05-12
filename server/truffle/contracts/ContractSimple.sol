// ContractSimple: Contract solidity file for an uploaded real estate contract.
// File: `./contracts/ContractSimple.sol`
// recommend: https://remix.ethereum.org/#optimize=false&version=soljson-v0.5.0+commit.1d4f565a.js
pragma solidity ^0.5.0;

contract ContractSimple {
 
  address public owner;
  string name;
  string metadata;
  string uploadUrl;
  bool active;
  bool isPrivate;
 
  constructor(string memory _name, string memory _uploadUrl, string memory _metadata, bool _isPrivate) public {
    owner = msg.sender;
    name = _name;
    metadata = _metadata;
    isPrivate = _isPrivate;
    uploadUrl = _uploadUrl;
    active = true;
  }
 
  event ContractEdited(string editor, string uploadUrl, string metadata);
  event ContractViewed(string viewer);
  event ContractSigned(string signer);

  /// Input validators.
  modifier onlyBefore(uint _time) {require(now < _time); _;}
  modifier onlyAfter(uint _time) {require(now > _time); _;}

  function edited(string memory _username, string memory _uploadUrl, string memory _metadata) public {
    emit ContractEdited(_username, _uploadUrl, _metadata);
  }

  function signed(string memory _username) public {
    emit ContractSigned(_username);
  }

  function viewed(string memory _username) public {
    emit ContractViewed(_username);
  }

  function setActive(bool _active) public {
    active = _active;
  }
}
