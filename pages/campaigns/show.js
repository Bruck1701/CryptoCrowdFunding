import React, { Component } from "react";
import Layout from "../../components/layout";
import Campaign from "../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import { ethers } from "ethers";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.functions.getSummary();
    //console.log(summary[1].toString());

    return {
      address: props.query.address,
      minimumContribution: summary[0].toString(),
      balance: ethers.utils.formatEther(summary[1]),
      requestsCount: summary[2].toString(),
      backersCount: summary[3].toString(),
      manager: summary[4],
    };
  }

  renderCards() {
    const {
      minimumContribution,
      balance,
      requestsCount,
      backersCount,
      manager,
    } = this.props;

    const items = [
      {
        header: manager,
        meta: "Address of the contract manager",
        description:
          "The manager that created this campaign can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become a backer of the campaign",
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract/Campaign. Requests must be aproved by backers. ",
      },
      {
        header: backersCount,
        meta: "Number of backers of the campaign",
        description: "Number of people who already invested in the campaign",
      },
      {
        header: balance,
        meta: "Campaign balance (ether)",
        description: "How much money this contract has to spend.",
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    //const { contractAddress } = this.props;

    return (
      <Layout>
        <h3> Campaign Details for</h3> <h4> {this.props.address}</h4>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={4}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary> View Requests </Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
