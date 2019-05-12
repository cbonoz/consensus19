
var SimpleStorage = artifacts.require("SimpleStorage");
var privateForKey = 'BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo='

module.exports = function(deployer) {
  // Pass 42 to the contract as the first constructor parameter
  deployer.deploy(SimpleStorage, 42, {privateFor: [privateForKey]})
};
