
var ContractSimple = artifacts.require("ContractSimple");
var privateForKey = 'BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo='

module.exports = function(deployer) {
  // Pass 42 to the contract as the first constructor parameter
  deployer.deploy(ContractSimple, "my contract", "test.pdf", "{author: 'Chris B'}", false, {privateFor: [privateForKey]})
};
