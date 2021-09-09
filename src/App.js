import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import QuissceQoin from './abis/QuissceQoin.json';
import QuissceDads from './abis/QuissceDads.json';
import QuissceDadDollars from './abis/QuissceDadDollars.json';
import { Container, Nav, Navbar } from 'react-bootstrap';
import QuissceQoinTab from './QuissceQoinTab.js';
import BrowseDadDBTab from './BrowseDadDBTab.js';
import getWeb3 from "./getWeb3";

function App() {
  const [account, setAccount] = useState('loading...');

  const [quissceQoin, setQuissceQoin] = useState(undefined);
  const [quissceDads, setQuissceDads] = useState(undefined);
  const [quissceDadDollars, setQuissceDadDollars] = useState(undefined);

  const [web3, setWeb3] = useState(undefined);

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
    return <div style={{ display: "flex", flexDirection: "column" }}>
      <h4>
        This browser doesn't support web3. Please use a desktop browser with a tool such as <a href="https://metamask.io/">Metamask</a> to use the Quissce Qoin Execution Console™.
      </h4>
      <img src="sadhorse.jpg" alt="horse" />
    </div>;
  }

  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Quissce Qoin Execution Terminal</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dads">Browse Dad DB</Nav.Link>
              <Nav.Link href="#" disabled>Soup Cents (coming soon)</Nav.Link>
              <Nav.Link href="#" disabled>Synergy Spheres (coming soon)</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Switch>
        <Route path='/dads/:id?'>
          <BrowseDadDBTab
            web3={web3}
            account={account}
            quissceDads={quissceDads}
            quissceQoin={quissceQoin} />
        </Route>
        <Route path='/'>
          <QuissceQoinTab
            web3={web3}
            account={account}
            quissceQoin={quissceQoin}
            quissceDads={quissceDads}
            quissceDadDollars={quissceDadDollars} />
        </Route>
      </Switch>
    </Router>
  );
}


export default App;
