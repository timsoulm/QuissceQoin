import React, { useState, useEffect } from 'react';
import { InputGroup, FormControl, Form, Button, Card, ListGroup, Spinner } from 'react-bootstrap';
import { create } from 'ipfs-http-client';
import TransactionTracker from './TransactionTracker.js';
import ApprovingTracker from './ApprovingTracker.js';
import getDadScoreDescription from './DadScoreLookup.js';

function QuissceQoinTab({ web3, account, quissceQoin, quissceDads, quissceDadDollars }) {
    const [quissceQoinBalance, setQuissceQoinBalance] = useState('0');
    const [dadsOwnedByAddress, setDadsOwnedByAddress] = useState([]);
    const [dadDollarsBalance, setDadDollarsBalance] = useState('0');
    const [claimedDadDollars, setClaimedDadDollars] = useState(null);
    const [claimableDadDollarsBalance, setClaimableDadDollarsBalance] = useState(null);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [favoriteFood, setFavoriteFood] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [fileIsUploading, setFileIsUploading] = useState(false);
    const [fileUrl, updateFileUrl] = useState('');
    const [dadIsSubmitting, setDadIsSubmitting] = useState(false);

    const [needsUpdate, setNeedsUpdate] = useState(false);

    const [activeTransactionHash, setActiveTransactionHash] = useState(null);
    const [activeTransactionReceiptBlockHash, setActiveTransactionReceiptBlockHash] = useState(null);
    const [activeTransactionEtherscanURL, setActiveTransactionEtherscanURL] = useState(null);

    const [showApprovalTracker, setShowApprovalTracker] = useState(false);
    const [dadImages, setDadImages] = useState({});

    const ipfsClient = create('https://ipfs.infura.io:5001/api/v0');

    async function onFileUploadChange(e) {
        setFileIsUploading(true);
        const file = e.target.files[0]
        try {
            const added = await ipfsClient.add(file);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            updateFileUrl(url);
            setFileIsUploading(false);
        } catch (error) {
            alert('Error uploading image file: ', error);
            setFileIsUploading(false);
        }
    }

    async function onFormSubmit(e) {
        e.preventDefault();

        let dadCounter = await quissceDads.methods.dadCounter().call();

        setDadIsSubmitting(true);
        let uploadedJsonURI;
        try {
            const metaObj = {
                "name": `${firstName} ${lastName}`,
                "description": `This dad enjoys eating ${favoriteFood}. Their hobbies include ${hobbies}.`,
                "image": fileUrl,
                "external_url": `https://www.quissce.biz/dads/${dadCounter}`
            };
            const jsonObj = JSON.stringify(metaObj);
            const added = await ipfsClient.add(jsonObj);
            uploadedJsonURI = `https://ipfs.infura.io/ipfs/${added.path}`;
        } catch (error) {
            alert('Error uploading metadata file: ', error);
            setDadIsSubmitting(false);
            return;
        }

        setDadIsSubmitting(false);

        quissceQoin.methods.approve(quissceDads._address, web3.utils.toWei('100000', 'Ether')).send({ from: account }).on('transactionHash', () => {
            window.scrollTo(0, 0);
            setShowApprovalTracker(true);
        }).on('receipt', (receipt) => {
            setShowApprovalTracker(false);
            quissceDads.methods.createDad(firstName, lastName, favoriteFood, hobbies, uploadedJsonURI).send({ from: account }).on('transactionHash', (hash) => {
                setActiveTransactionHash(hash);
                setActiveTransactionEtherscanURL(`https://kovan.etherscan.io/tx/${hash}`);

                setFirstName('');
                setLastName('');
                setFavoriteFood('');
                setHobbies('');
            }).on('receipt', (receipt) => {
                setActiveTransactionReceiptBlockHash(receipt.blockHash);
            });
        });
    }

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

    useEffect(() => {
        if (!quissceDads || !dadsOwnedByAddress.length) {
            return;
        }
        dadsOwnedByAddress.forEach(dad => {
            quissceDads.methods.tokenURI(dad.id).call().then(tokenURI => {
                fetch(tokenURI).then((response) => response.json()).then(json => {
                    setDadImages(prevState => {
                        return { ...prevState, [dad.id]: json.image }
                    });
                });
            })
        });
    }, [dadsOwnedByAddress, quissceDads]);

    return <div className="quissce-qoin-info-container">
        <ApprovingTracker isShown={showApprovalTracker} />
        <TransactionTracker
            activeTransactionHash={activeTransactionHash}
            activeTransactionEtherscanURL={activeTransactionEtherscanURL}
            activeTransactionReceiptBlockHash={activeTransactionReceiptBlockHash}
            onClose={() => {
                setActiveTransactionHash(null);
                setActiveTransactionEtherscanURL(null);
                setActiveTransactionReceiptBlockHash(null);
                setNeedsUpdate(true);
            }} />
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
                    value={claimableDadDollarsBalance === null || claimedDadDollars === null ? 0 : claimableDadDollarsBalance - claimedDadDollars}
                />
                <Button variant="outline-secondary" onClick={() => {
                    quissceDadDollars.methods.claimDadDollars().send({ from: account }).on('transactionHash', (hash) => {
                        setActiveTransactionHash(hash);
                        setActiveTransactionEtherscanURL(`https://kovan.etherscan.io/tx/${hash}`);
                    }).on('receipt', (receipt) => {
                        setActiveTransactionReceiptBlockHash(receipt.blockHash);
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
                    let dadScoreText = getDadScoreDescription(dad.dadScore);
                    return <Card key={dad.id} style={{ width: '14rem', marginRight: '16px', marginBottom: '16px' }}>
                        <Card.Img style={{ objectFit: 'cover', height: '300px', width: '100%' }} variant="top" src={dadImages[dad.id]} />
                        <Card.Body>
                            <Card.Title><a href={`https://kovan.etherscan.io/token/${quissceDads._address}?a=${dad.id}`} target="_blank" rel="noreferrer">{dad.firstName} {dad.lastName}</a></Card.Title>
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
            <Form onSubmit={onFormSubmit}>
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
                <Form.Group className="mb-3">
                    <Form.Label style={{ marginRight: '8px' }}>Upload a dad photo </Form.Label>
                    <Form.Control type="file" size="lg" onChange={onFileUploadChange} />
                    {fileIsUploading ? <Spinner style={{ marginLeft: '4px' }} animation="border" size="sm" /> : null}
                </Form.Group>
                <Button type="submit" disabled={!firstName || !lastName || !favoriteFood || !hobbies || !fileUrl}>Mint this Dad (costs 100,000 Quissce Qoin)</Button>
                {dadIsSubmitting ? <Spinner style={{ marginLeft: '4px' }} animation="border" size="sm" /> : null}
            </Form>
        </div>
    </div>;
}

export default QuissceQoinTab;