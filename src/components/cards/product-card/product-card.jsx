import { useState } from "react";
import Badge from "/src/components/elements/badge/badge";
import Button from "/src/components/elements/button/button";
import "./product-card.css";

function ProductCard({
    name,
    description,
    price,
    image,
    badge,
    temperature = [],
    available = true,
    onAddToOrder,
    onClick,
    className = "",
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    // temp muna para functional
    const isAvailable = available && badge !== "soldOut";

    const handleCardClick = () => {
        if (onClick) {
            onClick();
            return;
        }
        if (!isAvailable) {
            return;
        }
        setIsExpanded((current) => !current);
    };

    const handleAddToOrder = (event) => {
        event.stopPropagation();
        if (!isAvailable) {
            return;
        }
        onAddToOrder?.();
    };

    return (
        <div
            className={`product-card ${
                isExpanded ? "expanded" : ""
            } ${!isAvailable ? "sold-out" : ""} ${className}`}
            onClick={handleCardClick}
        >
            <img
                src={image}
                alt={name}
                className="product-image"
            />
            <div className="product-overlay">
                <div className="product-info">
                    <h3 className="product-name">{name}</h3>
                    {!isExpanded && badge && <Badge type={badge} />}
                    {isExpanded && (
                        <>
                            <p className="product-description">{description}</p>
                            <p className="product-price">
                                ₱{Number(price).toFixed(2)}
                            </p>
                            {temperature.length > 0 && (
                                <div className="temperature-badges">
                                    {temperature.map((type) => (
                                        <Badge key={type} type={type} />
                                    ))}
                                </div>
                            )}
                            {onAddToOrder && (
                                <Button
                                    className="add-to-order-button"
                                    onClick={handleAddToOrder}
                                >
                                    Add to Order
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductCard;