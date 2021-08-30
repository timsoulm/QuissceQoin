import React, { useState, useEffect } from 'react';
import './App.css';
import QuissceQoin from './abis/QuissceQoin.json';
import QuissceDads from './abis/QuissceDads.json';
import QuissceDadDollars from './abis/QuissceDadDollars.json';
import { Container, Nav, Navbar } from 'react-bootstrap';
import QuissceQoinTab from './QuissceQoinTab.js';
import BrowseDadDBTab from './BrowseDadDBTab.js';
import getWeb3 from "./getWeb3";

const TABS = {
  'QUISSCE_QOIN': 'QUISSCE_QOIN',
  'BROWSE_DAD_DB': 'BROWSE_DAD_DB',
};

function App() {
  const [account, setAccount] = useState('loading...');

  const [quissceQoin, setQuissceQoin] = useState(undefined);
  const [quissceDads, setQuissceDads] = useState(undefined);
  const [quissceDadDollars, setQuissceDadDollars] = useState(undefined);

  const [web3, setWeb3] = useState(undefined);
  const [currentTab, setCurrentTab] = useState(TABS.QUISSCE_QOIN);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const currentAccount = accounts[0];
        web3.eth.defaultAccount = currentAccount;

        setWeb3(web3);
        setAccount(currentAccount);

        const networkId = await web3.eth.net.getId();

        const quissceQoinData = QuissceQoin.networks[networkId];
        if (quissceQoinData) {
          const quissceQoin = new web3.eth.Contract(QuissceQoin.abi, quissceQoinData.address, {
            from: currentAccount
          });
          setQuissceQoin(quissceQoin);
        } else {
          window.alert('quissce qoin contract not deployed to detected network');
        }

        const quissceDadsData = QuissceDads.networks[networkId];
        if (quissceDadsData) {
          const quissceDads = new web3.eth.Contract(QuissceDads.abi, quissceDadsData.address, {
            from: currentAccount
          });
          setQuissceDads(quissceDads);
        } else {
          window.alert('quissce dads contract not deployed to detected network');
        }

        const quissceDadDollarsData = QuissceDadDollars.networks[networkId];
        if (quissceDadDollarsData) {
          const quissceDadDollars = new web3.eth.Contract(QuissceDadDollars.abi, quissceDadDollarsData.address, {
            from: currentAccount
          });
          setQuissceDadDollars(quissceDadDollars);
        } else {
          window.alert('quissce dad dollars contract not deployed to detected network');
        }

      } catch (error) {
        alert('Failed to load web3, accounts, or contract');
        console.error(error);
      }
    }
    init();
  }, []);

  if (!web3) {
    return <div />;
  }

  let activeTab = <div />;
  switch (currentTab) {
    case TABS.QUISSCE_QOIN:
      activeTab = <QuissceQoinTab
        web3={web3}
        account={account}
        quissceQoin={quissceQoin}
        quissceDads={quissceDads}
        quissceDadDollars={quissceDadDollars} />;
      break;
    case TABS.BROWSE_DAD_DB:
      activeTab = <BrowseDadDBTab
        web3={web3}
        account={account}
        quissceDads={quissceDads}
        quissceQoin={quissceQoin} />
      break;
    default:
      activeTab = 'Error';
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#" onClick={() => setCurrentTab(TABS.QUISSCE_QOIN)}>Quissce Qoin Execution Terminal</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => setCurrentTab(TABS.BROWSE_DAD_DB)}>Browse Dad DB</Nav.Link>
              <Nav.Link href="#" disabled>Soup Cents (coming soon)</Nav.Link>
              <Nav.Link href="#" disabled>Synergy Spheres (coming soon)</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {activeTab}
    </>
  );
}


export default App;
