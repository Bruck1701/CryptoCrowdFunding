const assert = require("assert");
const ganache = require("ganache-cli");

const ethers = require("ethers");

//const url = "http://localhost:8545";

// Or if you are running the UI version, use this instead:
// const url = "http://localhost:7545"

//const provider = new ethers.providers.JsonRpcProvider();

const provider = new ethers.providers.Web3Provider(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;
let contract;

beforeEach(async () => {
  accounts = await provider.listAccounts();

  //console.log(provider);

  const contractByteCode = compiledFactory.evm.bytecode.object;
  const contractAbi = compiledFactory.abi;
  const contractAddress = null;

  factory_builder = await new ethers.ContractFactory(
    contractAbi,
    contractByteCode,
    provider.getSigner(0)
  );

  factory = await factory_builder.deploy();

  // try {
  await factory.deployed();
  // } catch (error) {
  //   console.log("Failed to deploy in TX:", error.transactionHash);
  //   throw error;
  // }

  //console.log("Factory address", contract.address);

  await factory.functions.createCampaign("1000");

  [campaignAddress] = await factory.functions.getDeployedCampaigns();

  //console.log("single campaign address", campaignAddress);

  campaign = new ethers.Contract(
    campaignAddress,
    compiledCampaign.abi,
    provider.getSigner(0)
  );
  //console.log(campaign);
});

describe("Campaigns", () => {
  it("Deploys a factory and a campaign", () => {
    assert.ok(factory.address);
    assert.ok(campaign.address);
  });

  it("Marks createCampaign caller as campaign manager", async () => {
    const manager = await campaign.functions.manager();
    assert.equal(accounts[0], manager);
  });

  it("Check if campaign can be contributed to", async () => {
    //console.log(accounts[1]);

    const contractAsAccount1 = campaign.connect(provider.getSigner(1));
    const contractAsAccount0 = campaign.connect(provider.getSigner(0));

    const overrides = {
      value: 2000,
    };

    await contractAsAccount1.functions.contribute(overrides);
    const isBacker = await contractAsAccount0.functions.backers(accounts[1]);

    assert(isBacker);
  });

  it("Requires a minimum contribution", async () => {
    const contracAsAccount1 = campaign.connect(provider.getSigner(1));
    const overrides = {
      value: 90,
    };

    try {
      await contracAsAccount1.functions.contribute(overrides);
      assert(false); //this code should not be run since the statement above has to fail
    } catch (err) {
      assert(err);
    }
  });

  it("Check if managger can create a Spending Request", async () => {
    const contractAsManager = campaign.connect(provider.getSigner(0));
    await contractAsManager.functions.createRequest(
      "Buy batteries",
      100,
      accounts[1]
    );
    const request = await campaign.functions.requests(0);

    assert.equal("Buy batteries", request.description);
  });

  it("Process requests", async () => {
    let prevBalance = await provider.getBalance(accounts[2]);
    prevBalance = ethers.utils.formatEther(prevBalance);
    prevBalance = parseFloat(prevBalance);

    const wei_value = ethers.utils.parseEther("10");
    //console.log(wei.toString(10));
    const contractAsManager = campaign.connect(provider.getSigner(0));

    const contractAsAccount1 = campaign.connect(provider.getSigner(1));

    //
    const overrides = {
      value: wei_value,
    };

    await contractAsAccount1.functions.contribute(overrides);

    await contractAsManager.functions.createRequest(
      "Request A",
      ethers.utils.parseEther("5"),
      accounts[2]
    );

    await contractAsAccount1.functions.aproveRequest(0);

    await contractAsManager.functions.finalizeRequest(0);

    let balance = await provider.getBalance(accounts[2]);
    balance = ethers.utils.formatEther(balance);
    balance = parseFloat(balance);

    //console.log(prevBalance, "<", balance);
    assert(balance > prevBalance);
  });

  it("Blocks the function finalizeRequest before the correct number of aprovals", async () => {
    let wei_value = ethers.utils.parseEther("5");
    const overrides = {
      value: wei_value,
    };

    const contractAsManager = campaign.connect(provider.getSigner(0));

    const contractAsAccount0 = campaign.connect(provider.getSigner(1));
    const contractAsAccount1 = campaign.connect(provider.getSigner(2));
    const contractAsAccount2 = campaign.connect(provider.getSigner(3));

    await contractAsAccount0.functions.contribute(overrides);
    await contractAsAccount1.functions.contribute(overrides);
    await contractAsAccount2.functions.contribute(overrides);

    await contractAsManager.functions.createRequest(
      "Request B",
      ethers.utils.parseEther("3"),
      accounts[4]
    );
    await contractAsAccount0.functions.aproveRequest(0);

    try {
      await contractAsManager.functions.finalizeRequest(0);
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Check if half of the aprovals is enough to finalize request", async () => {
    let prevBalance = await provider.getBalance(accounts[4]);
    prevBalance = ethers.utils.formatEther(prevBalance);
    prevBalance = parseFloat(prevBalance);

    let wei_value = ethers.utils.parseEther("2");
    const overrides = {
      value: wei_value,
    };

    const contractAsManager = campaign.connect(provider.getSigner(0));

    const contractAsAccount0 = campaign.connect(provider.getSigner(1));
    const contractAsAccount1 = campaign.connect(provider.getSigner(2));
    const contractAsAccount2 = campaign.connect(provider.getSigner(3));

    await contractAsAccount0.functions.contribute(overrides);
    await contractAsAccount1.functions.contribute(overrides);
    await contractAsAccount2.functions.contribute(overrides);

    await contractAsManager.functions.createRequest(
      "Request C",
      ethers.utils.parseEther("3"),
      accounts[4]
    );
    await contractAsAccount0.functions.aproveRequest(0);
    await contractAsAccount1.functions.aproveRequest(0);

    await contractAsManager.functions.finalizeRequest(0);

    let balance = await provider.getBalance(accounts[4]);
    balance = ethers.utils.formatEther(balance);
    balance = parseFloat(balance);

    //console.log(prevBalance, "<", balance);
    assert(balance > prevBalance);
  });

  it("Blocks other users to create a Spending Request", async () => {
    let wei_value = ethers.utils.parseEther("2");
    const overrides = {
      value: wei_value,
    };

    const contractAsAccount0 = campaign.connect(provider.getSigner(1));
    const contractAsAccount1 = campaign.connect(provider.getSigner(2));

    await contractAsAccount0.functions.contribute(overrides);
    await contractAsAccount1.functions.contribute(overrides);

    try {
      await contractAsAccount0.functions.createRequest(
        "Request D",
        ethers.utils.parseEther("3"),
        accounts[5]
      );

      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Blocks others user to finalizeRequest", async () => {
    let wei_value = ethers.utils.parseEther("2");
    const overrides = {
      value: wei_value,
    };

    const contractAsManager = campaign.connect(provider.getSigner(0));

    const contractAsAccount0 = campaign.connect(provider.getSigner(1));
    const contractAsAccount1 = campaign.connect(provider.getSigner(2));

    await contractAsAccount0.functions.contribute(overrides);
    await contractAsAccount1.functions.contribute(overrides);

    await contractAsManager.functions.createRequest(
      "Request C",
      ethers.utils.parseEther("3"),
      accounts[5]
    );

    await contractAsAccount0.functions.aproveRequest(0);
    await contractAsAccount1.functions.aproveRequest(0);

    try {
      await contractAsAccount0.functions.finalizeRequest(0);

      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Blocks the function finalizeRequest to send more than the available funds.", async () => {
    let wei_value = ethers.utils.parseEther("5");
    const overrides = {
      value: wei_value,
    };

    let balance = await provider.getBalance(campaignAddress);
    console.log("before contribution::", ethers.utils.formatEther(balance));

    const contractAsManager = campaign.connect(provider.getSigner(0));

    const contractAsAccount0 = campaign.connect(provider.getSigner(1));

    await contractAsAccount0.functions.contribute(overrides);

    balance = await provider.getBalance(campaignAddress);
    console.log("after contribution::", ethers.utils.formatEther(balance));

    //await contractAsAccount0.functions.aproveRequest(0);

    try {
      await contractAsManager.functions.createRequest(
        "Request X",
        balance + 10,
        accounts[4]
      );
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
});
