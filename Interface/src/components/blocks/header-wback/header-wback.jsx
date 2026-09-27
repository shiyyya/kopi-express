import './header-wback.css';
import Back from '/src/components/elements/button/back-button/back-button.jsx';

function HeaderWithBack({ title }) {
    return (
        <div className="headerWithBack">
            <Back />
            <h1 className="title">{title}</h1>
        </div>
    );
}

export default HeaderWithBack