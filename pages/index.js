import React, { Component } from "react";
import contractInstance from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/layout";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await contractInstance.functions.getDeployedCampaigns();
    return { campaigns };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => {
      return {
        header: address,
        description: <a>View Campaign</a>,
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>

          <Button
            floated="right"
            content="Create Campaign"
            icon="add circle"
            primary
          />

          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
