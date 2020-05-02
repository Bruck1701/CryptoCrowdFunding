import React, { Component } from "react";
import Layout from "../../components/layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import contractInstance from "../../ethereum/factory";
import { ethers } from "ethers";

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault(); //prevent the browser to submit the form to the server ....

    if (window.ethereum) {
      try {
        //metamask asks for the user authorization before providing access to the data such as address on his wallet.
        await window.ethereum.enable();
      } catch (err) {
        this.setState({ errorMessage: err.message });
        console.log("User has denied access to metamask");
      }

      try {
        this.setState({ loading: true, errorMessage: "" });
        const provider = new ethers.providers.Web3Provider(
          web3.currentProvider
        );
        const signer = provider.getSigner(0);
        const contractConnection = contractInstance.connect(signer);

        await contractConnection.functions.createCampaign(
          this.state.minimumContribution
        );
      } catch (err) {
        this.setState({ errorMessage: err.message });
      }

      this.setState({ loading: false });
    } else {
      console.log(
        "Non Ethereum browser detected. Consider installing Metamask! "
      );
    }
  };

  render() {
    return (
      <Layout>
        <h3> Create a new Campaign! </h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution </label>
            <Input
              value={this.state.minimumContribution}
              label="wei"
              labelPosition="right"
              onChange={(event) =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>

          <Message
            error
            header="Ops! An Error has occurred"
            content={this.state.errorMessage}
          />

          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
