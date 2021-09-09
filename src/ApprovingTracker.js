import { Spinner } from 'react-bootstrap';

function ApprovingTracker({ isShown }) {
    return isShown ?
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '32px', marginRight: '12px' }}>Approving...</div><Spinner animation="border" />
        </div > : null;
}

export default ApprovingTracker;