const ethers = require("ethers");
const dotenv = require("dotenv").config();

const compiledFactory = require("./build/CampaignFactory.json");

const bytecode = compiledFactory.evm.bytecode.object;
const abi = compiledFactory.abi;
const contractAddress = null;

const provider = ethers.getDefaultProvider("rinkeby");

const mnemonic = process.env.MNEMONIC;
const privateKey = new ethers.Wallet.fromMnemonic(mnemonic).privateKey;

const wallet = new ethers.Wallet(privateKey, provider);
console.log("Wallet Address: " + wallet.address);
//

(async function () {
  // Create an instance of a Contract Factory
  let factory = new ethers.ContractFactory(abi, bytecode, wallet);
  let contract = await factory.deploy();

  // The address the Contract WILL have once mined
  // See: https://rinkeby.etherscan.io/address/<Contractaddress>

  console.log("Contract Address:", contract.address);

  // The transaction that was sent to the network to deploy the Contract
  // See: https://rinkeby.etherscan.io/tx/<trasnsactionHash>
  console.log("Transaction Hash:", contract.deployTransaction.hash);

  // The contract is NOT deployed yet; we must wait until it is mined
  await contract.deployed();

  // Done! The contract is deployed.
})();
