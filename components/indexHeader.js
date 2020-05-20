import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes";
import Header from "semantic-ui-react";

export default () => {

  const getWidth = () => {
    const isSSR = typeof window === 'undefined'
  
    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
  }


  return (
    // <Menu style={{ marginTop: "15px" }}>
    //   <Link route="/">
    //     <a className="item">CryptoCrowdFunding</a>
    //   </Link>

    //   <Menu.Menu position="right">
    //     <Link route="/">
    //       <a className="item">Campaigns</a>
    //     </Link>

    //     <Link route="/campaigns/new">
    //       <a className="item">+</a>
    //     </Link>
    //   </Menu.Menu>
    // </Menu>
    <Header
    as='h1'
    content='Crypto crowdfunding'
    inverted
    style={{
      fontSize: mobile ? '2em' : '4em',
      fontWeight: 'normal',
      marginBottom: 0,
      marginTop: mobile ? '1.5em' : '3em',
    }}
    />


  );
};
