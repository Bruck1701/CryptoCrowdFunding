import React, { Component } from "react";
import Layout from "../../../components/layout";
import { Link } from "../../../routes";
import { Button } from "semantic-ui-react";

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  render() {
    return (
      <Layout>
        <h3> Request List </h3>

        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary> Add Request </Button>
          </a>
        </Link>
      </Layout>
    );
  }
}

export default RequestIndex;
