import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import TransactionTracker from './TransactionTracker';
import ApprovingTracker from './ApprovingTracker.js';
import ViewDad from './ViewDad.js';

function BrowseDadDBTab({ web3, account, quissceDads, quissceQoin }) {
    const [dadData, setDadData] = useState([]);
    const [ownedDads, setOwnedDads] = useState([]);
    const [dadIdToTransfer, setDadIdToTransfer] = useState(undefined);
    const [dadIdToList, setDadIdToList] = useState(undefined);
    const [accountToTransferDad, setAccountToTransferDad] = useState(undefined);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showListModal, setShowListModal] = useState(false);
    const [listedDadPrice, setListedDadPrice] = useState('');

    const [activeTransactionHash, setActiveTransactionHash] = useState(null);
    const [activeTransactionReceiptBlockHash, setActiveTransactionReceiptBlockHash] = useState(null);
    const [activeTransactionEtherscanURL, setActiveTransactionEtherscanURL] = useState(null);

    const [showApprovalTracker, setShowApprovalTracker] = useState(false);

    const [dadImages, setDadImages] = useState({});

    const handleTransferModalClose = () => {
        setDadIdToTransfer('');
        setShowTransferModal(false);
    }
    const handleTransferModalShow = (dadId) => {
        setDadIdToTransfer(dadId);
        setShowTransferModal(true);
    }
    const handleTransferModalTransfer = () => {
        setShowTransferModal(false);
        quissceDads.methods.safeTransferFrom(account, accountToTransferDad, dadIdToTransfer).send().on('transactionHash', (hash) => {
            window.scrollTo(0, 0);

            setActiveTransactionHash(hash);
            setActiveTransactionEtherscanURL(`https://etherscan.io/tx/${hash}`);

            setDadIdToTransfer('');
        }).on('receipt', (receipt) => {
            setActiveTransactionReceiptBlockHash(receipt.blockHash);
        });
    };

    const handleListModalClose = () => {
        setDadIdToList('');
        setShowListModal(false);
    }
    const handleListModalShow = (dadId) => {
        setDadIdToList(dadId);
        setShowListModal(true);
    }
    const handleListModalList = () => {
        setShowListModal(false);
        updateSalePrice(dadIdToList, web3.utils.toWei(listedDadPrice, 'Ether'));
    };

    const [needsUpdate, setNeedsUpdate] = useState(false);

    useEffect(() => {
        if (!quissceDads) {
            return;
        }

        setNeedsUpdate(false);
        const fetch = async () => {
            let dadData = await quissceDads.methods.getDadData().call();
            setDadData(dadData);
            let dadsOwnedByAddress = await quissceDads.methods.getDadsOwnedByAddress().call();
            setOwnedDads(dadsOwnedByAddress);
        }
        fetch();
    }, [quissceDads, needsUpdate]);

    useEffect(() => {
        if (!quissceDads || !dadData.length) {
            return;
        }

        dadData.forEach(dad => {
            quissceDads.methods.tokenURI(dad.id).call().then(tokenURI => {
                fetch(tokenURI).then((response) => response.json()).then(json => {
                    setDadImages(prevState => {
                        return { ...prevState, [dad.id]: json.image }
                    })
                });
            });
        });
    }, [dadData, quissceDads]);

    function burnDad(dadId) {
        quissceDads.methods.burnDad(dadId).send({ from: account }).on('transactionHash', (hash) => {
            window.scrollTo(0, 0);

            setActiveTransactionHash(hash);
            setActiveTransactionEtherscanURL(`https://etherscan.io/tx/${hash}`);
        }).on('receipt', (receipt) => {
            setActiveTransactionReceiptBlockHash(receipt.blockHash);
        });
    }

    function updateSalePrice(dadId, amount) {
        quissceDads.methods.approve(quissceDads._address, dadId).send({ from: account }).on('transactionHash', () => {
            window.scrollTo(0, 0);
            setShowApprovalTracker(true);
        }).on('receipt', (receipt) => {
            setShowApprovalTracker(false);
            quissceDads.methods.updateSalePrice(dadId, amount).send({ from: account }).on('transactionHash', (hash) => {


                setActiveTransactionHash(hash);
                setActiveTransactionEtherscanURL(`https://etherscan.io/tx/${hash}`);
            }).on('receipt', (receipt) => {
                setActiveTransactionReceiptBlockHash(receipt.blockHash);
            });
        });
    }

    function buyDad(dadId, amount) {
        quissceQoin.methods.approve(quissceDads._address, amount).send({ from: account }).on('transactionHash', () => {
            window.scrollTo(0, 0);
            setShowApprovalTracker(true);
        }).on('receipt', (receipt) => {
            setShowApprovalTracker(false);
            quissceDads.methods.buyDadWithQuissceQoin(dadId).send({ from: account }).on('transactionHash', (hash) => {
                setActiveTransactionHash(hash);
                setActiveTransactionEtherscanURL(`https://etherscan.io/tx/${hash}`);
            }).on('receipt', (receipt) => {
                setActiveTransactionReceiptBlockHash(receipt.blockHash);
            });
        });
    }

    function onRowClick(history, dadId) {
        history.push(`/dads/${dadId}`);
    }

    const transferDadModal = <Modal show={showTransferModal} onHide={handleTransferModalClose}>
        <Modal.Header>
            <Modal.Title>Transfer this Dad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="transfer-modal-text">
                Who would you like to transfer this Dad to?
            </div>
            <InputGroup className="mb-3">
                <InputGroup.Text id="ethereum-address-addon1">Ethereum Address</InputGroup.Text>
                <FormControl onChange={({ target: { value } }) => setAccountToTransferDad(value)} value={accountToTransferDad} />
            </InputGroup>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleTransferModalClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleTransferModalTransfer}>
                Transfer
            </Button>
        </Modal.Footer>
    </Modal>;

    const listDadForSaleModal = <Modal show={showListModal} onHide={handleListModalClose}>
        <Modal.Header>
            <Modal.Title>List this Dad for sale</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="transfer-modal-text">
                How many Quissce Qoins would you like to sell this Dad for?
            </div>
            <InputGroup className="mb-3">
                <FormControl onChange={({ target: { value } }) => setListedDadPrice(value)} value={listedDadPrice} />
                <InputGroup.Text id="quissce-qoin-addon1">QWIS</InputGroup.Text>
            </InputGroup>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleListModalClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleListModalList}>
                List
            </Button>
        </Modal.Footer>
    </Modal>;

    const history = useHistory();

    return <div className="browse-dad-db-table">
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
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Favorite Food</th>
                    <th>Hobbies</th>
                    <th>Dad Score (from 0 to 999)</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {dadData.filter(d => !d.isBurned).map(dad => <tr key={dad.id}>
                    <td className="rowClickable" onClick={() => onRowClick(history, dad.id)}>{dad.id}</td>
                    <td className="rowClickable" onClick={() => onRowClick(history, dad.id)}><img style={{ maxWidth: '150px', maxHeight: '150px' }} src={dadImages[dad.id]} alt={`Dad ${dad.id}`} /></td>
                    <td className="rowClickable" onClick={() => onRowClick(history, dad.id)}>{dad.firstName}</td>
                    <td className="rowClickable" onClick={() => onRowClick(history, dad.id)}>{dad.lastName}</td>
                    <td className="rowClickable" onClick={() => onRowClick(history, dad.id)}>{dad.favoriteFood}</td>
                    <td className="rowClickable" onClick={() => onRowClick(history, dad.id)}>{dad.hobbies}</td>
                    <td className="rowClickable" onClick={() => onRowClick(history, dad.id)}>{dad.dadScore}</td>
                    {ownedDads.find(d => d.id === dad.id) ? <td>
                        {web3.utils.fromWei(dad.salePrice, 'Ether') === '0' ? <Button style={{ marginRight: '4px' }} variant="success" size="sm" onClick={() => handleListModalShow(dad.id)}>
                            List for sale
                        </Button> : <Button style={{ marginRight: '4px' }} variant="secondary" size="sm" onClick={() => updateSalePrice(dad.id, '0')}>
                            Delist (current price {web3.utils.fromWei(dad.salePrice, 'Ether')} QWIS)
                        </Button>}
                        <Button style={{ marginRight: '4px' }} variant="primary" size="sm" onClick={() => handleTransferModalShow(dad.id)}>
                            Transfer
                        </Button>
                        {transferDadModal}
                        {listDadForSaleModal}
                        <Button variant="danger" size="sm" onClick={() => burnDad(dad.id)}>
                            Burn (get 50k QWIS)
                        </Button></td> :
                        <td>{dad.salePrice === '0' ? "This dad is not for sale" : <Button variant="info" size="sm" onClick={() => buyDad(dad.id, dad.salePrice)}>
                            Buy this dad ({web3.utils.fromWei(dad.salePrice, 'Ether')} QWIS)
                        </Button>}</td>
                    }
                </tr>)}
            </tbody >
        </Table >
        <ViewDad quissceDads={quissceDads} dadData={dadData} />
    </div >;
}

export default BrowseDadDBTab;