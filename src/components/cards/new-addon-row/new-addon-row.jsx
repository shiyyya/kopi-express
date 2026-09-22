import "./new-addon-row.css";

export default function NewAddonRow({ onClick }) {
    return (
        <button
            type="button"
            className="NewAddonRow"
            onClick={onClick}
        >
            <span className="NewAddonRowIcon">+</span>
            <span className="NewAddonRowText">New Add-on</span>
        </button>
    );
}