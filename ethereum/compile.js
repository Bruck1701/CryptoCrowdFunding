const path = require("path");
const solc = require("solc");

const fs = require("fs-extra"); // community based file system module ( with extra functions)

//remove previously built contracts
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath); //extra function from fs-extra to remove the entire folder

const contractPath = path.resolve(__dirname, "contracts", "campaign.sol");
const source = fs.readFileSync(contractPath, "utf-8");

var input = {
  language: "Solidity",
  sources: {
    "campaign.sol": {
      content: source
    }
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"]
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
//console.log(output);

//check if dir exists, if it doesnt, it creates ..
fs.ensureDirSync(buildPath);
// for both contracts in output ( Campaign and CampaignFactory)
for (let contract in output.contracts["campaign.sol"]) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract + ".json"), //name of the file
    output.contracts["campaign.sol"][contract] //.evm
  );
}
