import { Alert, Button } from 'react-bootstrap';

function TransactionTracker({
    activeTransactionHash,
    activeTransactionEtherscanURL,
    activeTransactionReceiptBlockHash,
    onClose
}) {
    return <Alert show={activeTransactionHash !== null} variant={activeTransactionReceiptBlockHash ? 'success' : 'info'}>
        <Alert.Heading>Transaction {activeTransactionReceiptBlockHash ? 'Complete' : 'Underway'}</Alert.Heading>
        <div>Transaction hash: {activeTransactionHash}</div>
        {activeTransactionReceiptBlockHash ? <div>Receipt Block Hash: {activeTransactionReceiptBlockHash}</div> : <div>Waiting for receipt...</div>}
        {activeTransactionReceiptBlockHash ? <><br /><div>You're good to hit the close and refresh button now</div></> : null}
        <br />
        <Alert.Link target="_blank" rel="noreferrer" href={activeTransactionEtherscanURL}>Etherscan link</Alert.Link>
        <hr />
        <div className="d-flex justify-content-end">
            <Button onClick={() => onClose()} variant="outline-info">
                Close and Refresh
            </Button>
        </div>
    </Alert>;
}

export default TransactionTracker;