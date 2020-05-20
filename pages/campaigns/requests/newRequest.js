import React, { Component } from "react";
import Layout from "../../../components/layout";
import { Grid, Form, Button, Input, Message } from "semantic-ui-react";
import { ethers } from "ethers";
import Campaign from "../../../ethereum/campaign";
import { Link, Router } from "../../../routes";

class RequestNew extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  state = {
    errorMessage: "",
    loading: false,
    descr: "",
    amount: "",
    recipient: "",
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });
    console.log("Creating request");
    try {
      await window.ethereum.enable();
      const provider = new ethers.providers.Web3Provider(web3.currentProvider);
      const signer = provider.getSigner(0);
      const campaign = Campaign(this.props.address);

      const contractConnection = campaign.connect(signer);
      await contractConnection.functions.createRequest(
        this.state.descr,
        ethers.utils.parseEther(this.state.amount),
        this.state.recipient
      );
      this.setState({ loading: false, errorMessage: "" });
      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h3> Create a Request </h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                  <label> Description </label>
                  <Input
                    value={this.state.descr}
                    onChange={(event) =>
                      this.setState({ descr: event.target.value })
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <label> Amount of Ether </label>
                  <Input
                    value={this.state.amount}
                    onChange={(event) =>
                      this.setState({ amount: event.target.value })
                    }
                  />
                </Form.Field>
                <Form.Field>
                  <label> Recipient </label>
                  <Input
                    value={this.state.recipient}
                    onChange={(event) =>
                      this.setState({ recipient: event.target.value })
                    }
                  />
                </Form.Field>

                <Message
                  error
                  header="Ops! An Error has occurred"
                  content={this.state.errorMessage}
                />

                <Button primary loading={this.state.loading}>
                  Create
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default RequestNew;
