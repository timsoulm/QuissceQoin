import React, { useState, useEffect } from 'react';
import {
    useParams,
    Link
} from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import getDadScoreDescription from './DadScoreLookup.js';

function ViewDad({ quissceDads, dadData }) {
    const [dadImage, setDadImage] = useState(null);
    const { id } = useParams();
    useEffect(() => {
        if (!quissceDads || id == null) {
            return;
        }
        quissceDads.methods.tokenURI(id).call().then(tokenURI => {
            fetch(tokenURI).then((response) => response.json()).then(json => {
                setDadImage(json.image);
            });
        });
    }, [quissceDads, id]);

    if (id == null) {
        return null;
    }
    const currentDad = dadData.find(d => d.id === id);

    if (!currentDad || currentDad.isBurned) {
        return null;
    }

    return <Modal
        show={true}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
        <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
                {`${currentDad.firstName} ${currentDad.lastName}`}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div style={{ display: 'flex' }}>
                <img style={{ maxWidth: '50%', maxHeight: '500px' }} src={dadImage} alt={`Dad ${currentDad.id}`} />
                <ul style={{ fontSize: '24px' }}>
                    <li>Serial Number: {currentDad.id}</li>
                    <li>Favorite Food: {currentDad.favoriteFood}</li>
                    <li>Hobbies: {currentDad.hobbies}</li>
                    <li>Dad Score: {currentDad.dadScore}</li>
                    <ul>
                        <li>{getDadScoreDescription(currentDad.dadScore)}</li>
                    </ul>
                    <li>Etherscan Link: <a href={`https://etherscan.io/token/${quissceDads._address}?a=${currentDad.id}`} target="_blank" rel="noreferrer">link</a>
                    </li>
                </ul>
            </div>

        </Modal.Body>
        <Modal.Footer>
            <Button as={Link} to='/dads'>Close</Button>
        </Modal.Footer>
    </Modal>;
}

export default ViewDad;