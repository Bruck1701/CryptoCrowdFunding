import React, { Component } from "react";
import { ethers } from "ethers";
import Campaign from "../ethereum/campaign";
import { Table, Button } from "semantic-ui-react";

class RequestRow extends Component {
  approveRequest = async () => {


    const provider = new ethers.providers.Web3Provider(web3.currentProvider);

    const campaign = Campaign(this.props.address);
    const signer = provider.getSigner(0);
    const campaignConnection = campaign.connect(signer);
    await campaignConnection.functions.aproveRequest(this.props.id);

    
  };

  endRequest = async () => {
    const provider = new ethers.providers.Web3Provider(web3.currentProvider);

    const campaign = Campaign(this.props.address);
    const signer = provider.getSigner(0);
    const campaignConnection = campaign.connect(signer);
    await campaignConnection.functions.finalizeRequest(this.props.id);
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, backersCount } = this.props;
    const readyToFinalize = request.approvalCount > backersCount / 2;

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id} </Cell>
        <Cell>{request.description} </Cell>
        <Cell>{ethers.utils.formatEther(request.value || "0")}</Cell>
        <Cell>{request.recipient} </Cell>
        <Cell>
          {(request.approvalCount || "0").toString()}/{backersCount.toString()}{" "}
          {}{" "}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="green" onClick={this.approveRequest}>
              {" "}
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="red" onClick={this.endRequest}>
              End Request
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
