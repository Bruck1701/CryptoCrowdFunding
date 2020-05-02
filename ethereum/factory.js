import { ethers } from "ethers";

import CampaignFactory from "./build/CampaignFactory.json";

let contractInstance;
let provider;
const contractAddress = "0x360D1B8A931FF6032CF1B74eda7D67D637691b87";
const abi = CampaignFactory.abi;

if (typeof window !== "undefined" && window.web3 !== "undefined") {
  //running on the browser not on the server and user has metamask installed

  provider = new ethers.providers.Web3Provider(web3.currentProvider);
} else {
  //
  provider = ethers.getDefaultProvider("rinkeby");
}

contractInstance = new ethers.Contract(contractAddress, abi, provider);

export default contractInstance;
