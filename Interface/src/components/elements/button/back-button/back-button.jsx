import Back from '/src/assets/icons/back.svg?react';
import { useNavigate } from 'react-router';
import './back-button.css';

function BackButton() {
    const navigate = useNavigate();

    return (
        <div className="backButton" onClick={() => navigate(-1)}>
            <Back />
        </div>
    );
}

export default BackButton