// ContractSimple: Contract solidity file for an uploaded real estate contract.
// File: `./contracts/ContractSimple.sol`
// recommend: https://remix.ethereum.org/#optimize=false&version=soljson-v0.5.0+commit.1d4f565a.js
pragma solidity ^0.5.0;

contract ContractSimple {
 
  address public owner;
  string name;
  string metadata;
  bool active;
  bool is_private;
 
  constructor(string memory _name, string memory _metadata, bool memory _is_private) public {
    owner = msg.sender;
    name = _name;
    metadata = _metadata;
    is_private = _is_private
    active = true;
    emit ContractCreated(owner, name)
  }
 
  event ContractCreated(address creator, string name)
  event ContractEdited(string editor, string metadata);
  event ContractViewed(string viewer);
  event ContractSigned(string signer);

  /// Modifiers are a convenient way to validate inputs to
  /// functions. `onlyBefore` is applied to `bid` below:
  /// The new function body is the modifier's body where
  /// `_` is replaced by the old function body.
  modifier onlyBefore(uint _time) {require(now < _time); _;}
  modifier onlyAfter(uint _time) {require(now > _time); _;}

  function edited(string memory _username, string memory _metadata) public {
    emit ContractEdited(_username, _metadata);
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
