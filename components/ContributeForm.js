import React, { Component } from "react";
import { ethers } from "ethers";
import { Form, Input, Button, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";

class ContributeForm extends Component {
  state = {
    contribution: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    try {
      //metamask asks for the user authorization before providing access to the data such as address on his wallet.
      await window.ethereum.enable();

      this.setState({ loading: true, errorMessage: "" });
      const provider = new ethers.providers.Web3Provider(web3.currentProvider);
      console.log(provider);
      const signer = provider.getSigner(0);
      console.log(signer);

      const campaign = Campaign(this.props.address);
      const contractConnection = campaign.connect(signer);

      const overrides = {
        value: ethers.utils.parseEther(this.state.contribution),
      };

      await contractConnection.functions.contribute(overrides);
    } catch (err) {
      this.setState({ errorMessage: err.message });
      //console.log("User has denied access to metamask");
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label> Contribute to this campaign </label>
          <Input
            value={this.state.contribution}
            label="ether"
            labelPosition="right"
            onChange={(event) =>
              this.setState({ contribution: event.target.value })
            }
          />
        </Form.Field>

        <Message error header="Error" content={this.state.errorMessage} />

        <Button loading={this.state.loading} primary>
          Contribute
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
