import React from "react";
import {Header,Segment,Visibility,Responsive,Grid} from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import Head from "next/head";


export default (props,{ mobile }) => {

  const getWidth = () => {
    const isSSR = typeof window === 'undefined'
  
    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
  }
  

  return (
    <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
      <Head>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
        />
        <link 
          rel="stylesheet"
          href="indexlayout.css"
        />
      </Head>
      <Visibility
          once={false}
          //onBottomPassed={this.showFixedMenu}
          //onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 700, padding: '1em 0em' }}
            vertical
          >

      <Header 
       as='h1'
       content='Crypto Crowdfunding'
       inverted
       style={{
         fontFamily: "Helvetica",
         fontSize: mobile ? '2em' : '4em',
         fontWeight: 'normal',
         marginBottom: 0,
         marginTop: mobile ? '1.5em' : '3em',
       }}
      
      
      
      
      />
      <Header
      as='h2'
      content='A Ethereum Based crowd funding plaftorm  '
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    (currently running on the Rinkeby test network.)
  </Segment>
  </Visibility>



  <Container>
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
        <Grid.Row>
      {props.children}
      </Grid.Row>
      </Grid>
      
    </Segment>
  </Container>

    </Responsive>
  );
};
