import './qty-selector.css';

function QuantitySelector({
    quantity,
    onDecrease,
    onIncrease,
    className = "",
}) {
    return (
        <div className={`quantity-selector ${className}`}>
            <button
                type="button"
                className="quantity-button"
                onClick={onDecrease}
            >
                −
            </button>

            <span className="quantity-value">
                {quantity}
            </span>

            <button
                type="button"
                className="quantity-button"
                onClick={onIncrease}
            >
                +
            </button>
        </div>
    );
}

export default QuantitySelector;