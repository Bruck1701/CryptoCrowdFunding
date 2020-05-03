import React, { Component } from "react";
import Layout from "../../components/layout";
import Campaign from "../../ethereum/campaign";
import { Card } from "semantic-ui-react";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);
    const summary = await campaign.functions.getSummary();
    //console.log(summary[0].toString());

    return {
      contractName: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      backersCount: summary[3],
      manager: summary[4],
    };
  }

  render() {
    return (
      <Layout>
        <h3> Campaign Details for {this.contractName}</h3>
      </Layout>
    );
  }
}

export default CampaignShow;
