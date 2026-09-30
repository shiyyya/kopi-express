import Back from '/src/assets/icons/back.svg?react';
import { useNavigate } from 'react-router';
import './back-button.css';

function BackButton({ onClick }) {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            className="backButton"
            aria-label="Go back"
            onClick={onClick ?? (() => navigate(-1))}
        >
            <Back />
        </button>
    );
}

export default BackButton;