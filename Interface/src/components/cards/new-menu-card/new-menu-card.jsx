import "./new-menu-card.css";

function NewMenuCard({ onClick }) {
    return (
        <button
            type="button"
            className="NewMenuCard"
            onClick={onClick}
        >
            <span className="NewMenuCardIcon">+</span>
            <span className="NewMenuCardTitle">New Menu</span>
            <span className="NewMenuCardDescription">
                Create a new product
            </span>
        </button>
    );
}

export default NewMenuCard;