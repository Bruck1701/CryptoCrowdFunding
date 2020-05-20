import { ethers } from "ethers";
import Campaign from "./build/Campaign.json";

export default address => {
  const abi = Campaign.abi;
  let provider;

  //console.log(address);

  if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
    //running on the browser not on the server and user has metamask installed

    provider = new ethers.providers.Web3Provider(web3.currentProvider);
  } else {
    //
    provider = ethers.getDefaultProvider("rinkeby");
  }

  return new ethers.Contract(address, abi, provider);
};
