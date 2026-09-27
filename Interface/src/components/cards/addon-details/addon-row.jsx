import "./addon-row.css";

export default function AddonRow({ addon, onClick }) {
    return (
        <button
            type="button"
            className={`AddonRow ${!addon.available ? "sold-out" : ""}`}
            onClick={() => onClick?.(addon)}
        >
            <div className="AddonRowInfo">
                <div className="AddonRowName">{addon.name}</div>
            </div>
            <div className="AddonRowRight">
                <span className="AddonRowPrice">
                    ₱{Number(addon.price).toFixed(2)}
                </span>
                <span
                    className={`AddonRowAvailability ${
                        addon.available ? "available" : "sold-out"
                    }`}
                >
                    {addon.available ? "Available" : "Sold Out"}
                </span>
            </div>
        </button>
    );
}