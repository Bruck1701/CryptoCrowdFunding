import React, { Component } from "react";
import Layout from "../../../components/layout";
import { Link } from "../../../routes";
import { Button, Table } from "semantic-ui-react";
import { ethers } from "ethers";
import RequestRow from "../../../components/RequestRow";

import Campaign from "../../../ethereum/campaign";

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;

    // const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    // const signer = provider.getSigner(0);
    const campaign = Campaign(address);

    //const contractConnection = campaign.connect(signer);

    const requestsCount = (
      await campaign.functions.getRequestsCount()
    ).toString();

    const backersCount = await campaign.functions.backersCount();

    const requests = await Promise.all(
      Array(parseInt(requestsCount))
        .fill()
        .map((element, index) => {
          return campaign.functions.requests(index);
        })
    );
    console.log(requests);

    return { address, requests, requestsCount, backersCount };
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          backersCount={this.props.backersCount}
          request={request}
          id={index}
          key={index}
          address={this.props.address}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}`}>
          <a>Back</a>
        </Link>

        <h3> Request List </h3>

        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary> Add Request </Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell> ID </HeaderCell>
              <HeaderCell> Description </HeaderCell>
              <HeaderCell> Amount </HeaderCell>
              <HeaderCell> Recipient </HeaderCell>
              <HeaderCell> Approval Count</HeaderCell>
              <HeaderCell> Approve </HeaderCell>
              <HeaderCell> End Request </HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div> Found {this.props.requestsCount} requests </div>
      </Layout>
    );
  }
}

export default RequestIndex;
