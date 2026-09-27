import "./order-item.css";
import Badge from "/src/components/elements/badge/badge.jsx";
import CloseIcon from "/src/assets/icons/close.svg?react";

function OrderItem({
    item,
    showRemove = false,
    onRemove,
}) {
    const product = item?.product;
    if (!product) {
        return null;
    }
    const temperature = item.temperature;
    const addOns = item.addOns || [];
    const quantity = item.quantity || 1;
    return (
        <div className="order-item">
            <img
                src={product.image}
                alt={product.name}
                className="order-item-image"
            />
            <div className="order-item-info">
                <div className="order-item-details">
                    <h3 className="order-item-name">
                        {product.name}
                    </h3>
                    <p className="order-item-price">
                        ₱{Number(product.price).toFixed(2)}
                    </p>
                </div>
                {(temperature || addOns.length > 0) && (
                    <div className="order-item-customization">
                        {temperature && (
                            <Badge
                                type={temperature.toLowerCase()}
                                className="order-item-temperature"
                            />
                        )}
                        {addOns.map((addOn, index) => (
                            <span
                                key={addOn.id || index}
                                className="order-item-addon"
                            >
                                {addOn.name}
                            </span>
                        ))}
                    </div>
                )}
                <div className="order-item-bottom">
                    <span className="order-item-quantity">
                        × {quantity}
                    </span>
                    {showRemove && (
                        <button
                            type="button"
                            className="order-item-remove"
                            onClick={onRemove}
                            aria-label={`Remove ${product.name}`}
                        >
                            <CloseIcon />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderItem;