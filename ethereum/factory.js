import { ethers } from "ethers";

import CampaignFactory from "./build/CampaignFactory.json";

let contractInstance;
let provider;
const contractAddress = "0x10f6F85FA43AAad238f53d7c96B91A50a5f1D000";
const abi = CampaignFactory.abi;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  //running on the browser not on the server and user has metamask installed

  provider = new ethers.providers.Web3Provider(web3.currentProvider);
} else {
  //
  provider = ethers.getDefaultProvider("rinkeby");
}

contractInstance = new ethers.Contract(contractAddress, abi, provider);

export default contractInstance;
