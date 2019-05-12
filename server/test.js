// const myContract = new web3.eth.Contract([...], '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', {
//     defaultAccount: '0x1234567890123456789012345678901234567891', // default from address
//     defaultGasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
// });
const Web3 = require('web3')

const NODE_PORT = 22000
const web3 = new Web3(new Web3.providers.HttpProvider(`http://localhost:${NODE_PORT}`))


web3.eth.getAccounts().then(console.log)

console.log(web3.eth.contract)
var version = Web3.version.api;
console.log('ver', version)