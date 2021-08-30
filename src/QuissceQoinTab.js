import React, { useState, useEffect } from 'react';
import { InputGroup, FormControl, Form, Button, Card, ListGroup } from 'react-bootstrap';

function QuissceQoinTab({ web3, account, quissceQoin, quissceDads, quissceDadDollars }) {
    const [quissceQoinBalance, setQuissceQoinBalance] = useState('0');
    const [dadsOwnedByAddress, setDadsOwnedByAddress] = useState([]);
    const [dadDollarsBalance, setDadDollarsBalance] = useState('0');
    const [claimedDadDollars, setClaimedDadDollars] = useState('0');
    const [claimableDadDollarsBalance, setClaimableDadDollarsBalance] = useState('0');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [favoriteFood, setFavoriteFood] = useState('');
    const [hobbies, setHobbies] = useState('');

    const [needsUpdate, setNeedsUpdate] = useState(false);

    useEffect(() => {
        if (!quissceQoin || !quissceDads || !quissceDadDollars) {
            return;
        }
        setNeedsUpdate(false);
        const fetch = async () => {
            let quissceQoinBalance = await quissceQoin.methods.balanceOf(account).call();
            setQuissceQoinBalance(quissceQoinBalance.toString());
            let dadsOwnedByAddress = await quissceDads.methods.getDadsOwnedByAddress().call();
            setDadsOwnedByAddress(dadsOwnedByAddress);
            let dadDollarsBalance = await quissceDadDollars.methods.balanceOf(account).call();
            setDadDollarsBalance(dadDollarsBalance);
            let claimableDadDollarsBalance = await quissceDads.methods.claimableDadDollars(account).call();
            setClaimableDadDollarsBalance(claimableDadDollarsBalance);
            let claimedDadDollars = await quissceDadDollars.methods.claimedDadDollars(account).call();
            setClaimedDadDollars(claimedDadDollars);
        }
        fetch();
    }, [quissceQoin, quissceDads, quissceDadDollars, account, needsUpdate]);

    return <div className="quissce-qoin-info-container">
        <div className="quisse-qoin-info-container-component">
            <h4 className="quissce-qoin-info-container-component-header">Your Quissce Qoin Info</h4>
            <InputGroup className="mb-3">
                <InputGroup.Text id="wallet-address-add-on">Wallet Address</InputGroup.Text>
                <FormControl
                    readOnly
                    value={account}
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text id="quissce-qoin-balance-add-on">Current Quissce Qoin Balance</InputGroup.Text>
                <FormControl
                    readOnly
                    value={web3.utils.fromWei(quissceQoinBalance, 'Ether')}
                />
                <InputGroup.Text id="quissce-qoin-balance-add-on-2">QWIS</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text id="dad-dollars-balance-add-on">Current Dad Dollar Balance</InputGroup.Text>
                <FormControl
                    readOnly
                    value={web3.utils.fromWei(dadDollarsBalance, 'Ether')}
                />
                <InputGroup.Text id="dad-dollars-balance-add-on-2">QDDOL</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text id="quissce-dad-balance-add-on">Number of Quissce Dads Owned</InputGroup.Text>
                <FormControl
                    readOnly
                    value={dadsOwnedByAddress.length}
                />
                <InputGroup.Text id="uissce-dad-balance-add-on-2">QDAD</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text id="dad-dollars-balance-add-on">Claimable Dad Dollars</InputGroup.Text>
                <FormControl
                    readOnly
                    value={claimableDadDollarsBalance - claimedDadDollars}
                />
                <Button variant="outline-secondary" onClick={() => {
                    quissceDadDollars.methods.claimDadDollars().send({ from: account }).on('transactionHash', (hash) => {
                        alert('dad dollars successfully claimed! Refreshing in 5 seconds after close...');

                        setTimeout(() => {
                            setNeedsUpdate(true);
                        }, 5000);
                    });
                }}>
                    Claim
                </Button>
            </InputGroup>
        </div>
        <div className="quisse-qoin-info-container-component">
            <h4 className="quissce-qoin-info-container-component-header">Your Quissce Dad NFTs</h4>
            <div className="quissce-dad-cards">
                {dadsOwnedByAddress.length ? dadsOwnedByAddress.map(dad => {
                    let dadScoreText = '';
                    if (dad.dadScore < 50) {
                        dadScoreText = 'This dad score is so bad that its good!';
                    } else if (dad.dadScore >= 50 && dad.dadScore < 150) {
                        dadScoreText = 'This dad score is horrendous';
                    } else if (dad.dadScore >= 150 && dad.dadScore < 300) {
                        dadScoreText = 'This dad score is pretty bad';
                    } else if (dad.dadScore >= 300 && dad.dadScore < 450) {
                        dadScoreText = 'This dad score is not great';
                    } else if (dad.dadScore >= 450 && dad.dadScore < 600) {
                        dadScoreText = 'This dad score is good';
                    } else if (dad.dadScore >= 600 && dad.dadScore < 750) {
                        dadScoreText = 'This dad score is really quite good';
                    } else if (dad.dadScore >= 750 && dad.dadScore < 900) {
                        dadScoreText = 'This dad score is incredible';
                    } else if (dad.dadScore >= 900 && dad.dadScore < 950) {
                        dadScoreText = 'This dad score is mind boggling';
                    } else if (dad.dadScore >= 950 && dad.dadScore < 990) {
                        dadScoreText = 'This dad score is making my head spin its so ridiculously high';
                    } else if (dad.dadScore >= 990) {
                        dadScoreText = 'Dad scores do not get much higher than this. This is an ultimate father.';
                    }
                    return <Card key={dad.id} style={{ width: '14rem', marginRight: '16px' }}>
                        <Card.Img variant="top" src="dadFace.png" />
                        <Card.Body>
                            <Card.Title>{dad.firstName} {dad.lastName}</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>Favorite Food: {dad.favoriteFood}</ListGroup.Item>
                                <ListGroup.Item>Hobbies: {dad.hobbies}</ListGroup.Item>
                                <ListGroup.Item>Dad Score: {dad.dadScore}</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">{dadScoreText}</small>
                        </Card.Footer>
                    </Card>;
                }) : <div>You don't own any dads yet :(</div>}
            </div>
        </div>
        <div className="quisse-qoin-info-container-component">
            <h4>Mint a Quissce Dad</h4>
            <h6>This will create an entry in the Dad DB</h6>
            <Form onSubmit={e => {
                e.preventDefault();
                quissceQoin.methods.approve(quissceDads._address, web3.utils.toWei('100000', 'Ether')).send({ from: account }).on('transactionHash', (hash) => {
                    quissceDads.methods.createDad(firstName, lastName, favoriteFood, hobbies).send({ from: account }).on('transactionHash', (hash) => {
                        alert('quissce dad successfully created! Refreshing in 5 seconds after close...');

                        setTimeout(() => {
                            setNeedsUpdate(true);
                        }, 5000);

                        setFirstName('');
                        setLastName('');
                        setFavoriteFood('');
                        setHobbies('');
                    });
                });
            }}>
                <InputGroup className="dad-form-item">
                    <InputGroup.Text>Dad First Name</InputGroup.Text>
                    <FormControl id="formDadFirstName" placeholder="Richard" onChange={({ target: { value } }) => setFirstName(value)} value={firstName} />
                </InputGroup>
                <InputGroup className="dad-form-item">
                    <InputGroup.Text>Dad Last Name</InputGroup.Text>
                    <FormControl id="formDadLastName" placeholder="Dunn" onChange={({ target: { value } }) => setLastName(value)} value={lastName} />
                </InputGroup>
                <InputGroup className="dad-form-item">
                    <InputGroup.Text>Favorite Food</InputGroup.Text>
                    <FormControl id="formDadFavoriteFood" placeholder="Pizza" onChange={({ target: { value } }) => setFavoriteFood(value)} value={favoriteFood} />
                </InputGroup>
                <InputGroup className="dad-form-item">
                    <InputGroup.Text>Hobbies</InputGroup.Text>
                    <FormControl id="formDadHobbies" placeholder="Skating" onChange={({ target: { value } }) => setHobbies(value)} value={hobbies} />
                </InputGroup>
                <Button type="submit" disabled={!firstName || !lastName || !favoriteFood || !hobbies}>Mint this Dad (costs 100,000 Quissce Qoin)</Button>
            </Form>
        </div>
    </div>;
}

export default QuissceQoinTab;