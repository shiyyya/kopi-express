import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./customization.css";

import Badge from "/src/components/elements/badge/badge";
import BackButton from "/src/components/elements/button/back-button/back-button";
import QuantitySelector from "/src/components/elements/quantity-selector/qty-selector";

import HotIcon from "/src/assets/icons/hot.svg?react";
import IcedIcon from "/src/assets/icons/iced.svg?react";
import CheckIcon from "/src/assets/icons/check.svg?react";

const ADD_ONS = [
    {
        id: "extra-shot",
        name: "Extra Shot",
        price: 30,
    },
    {
        id: "vanilla-syrup",
        name: "Vanilla Syrup",
        price: 30,
    },
    {
        id: "oat-milk",
        name: "Oat Milk",
        price: 30,
    },
    {
        id: "whipped-cream",
        name: "Whipped Cream",
        price: 30,
    },
    {
        id: "caramel-drizzle",
        name: "Caramel Drizzle",
        price: 30,
    },
];

export default function Customization({
    //changes
    product: productProp,
    onClose,
    onAddToOrder,
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const product = productProp || location.state?.product;

    const [selectedTemperature, setSelectedTemperature] = useState(null);
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState("");
    const [temperatureError, setTemperatureError] = useState(false);

    if (!product) {
        return (
            <div className="customization-page">
                <BackButton />
                <p className="customization-not-found">
                    Product not found.
                </p>
            </div>
        );
    }

    const hasTemperature =
        Array.isArray(product.temperature) &&
        product.temperature.length > 0;

    const requiresTemperature =
        hasTemperature &&
        product.temperature.includes("hot") &&
        product.temperature.includes("iced");

    const hasAddOns = ADD_ONS.length > 0;

    const toggleTemperature = (temperature) => {
        setSelectedTemperature((current) =>
            current === temperature ? null : temperature
        );

        setTemperatureError(false);
    };

    const toggleAddOn = (addOnId) => {
        setSelectedAddOns((current) =>
            current.includes(addOnId)
                ? current.filter((id) => id !== addOnId)
                : [...current, addOnId]
        );
    };

    const addOnsTotal = selectedAddOns.reduce(
        (total, addOnId) => {
            const addOn = ADD_ONS.find(
                (item) => item.id === addOnId
            );

            return total + (addOn?.price || 0);
        },
        0
    );

    const totalPrice =
        (Number(product.price) + addOnsTotal) * quantity;

    const handleAddToOrder = () => {
        if (requiresTemperature && !selectedTemperature) {
            setTemperatureError(true);
            return;
        }

        const selectedAddOnDetails = ADD_ONS.filter((addOn) =>
            selectedAddOns.includes(addOn.id)
        );

        const newCartItem = {
            id: `cart-item-${Date.now()}`,
            product: {
                id: product.id,
                name: product.name,
                price: Number(product.price),
                image: product.image,
            },
            temperature: selectedTemperature,
            addOns: selectedAddOnDetails,
            quantity,
            notes,
            total: totalPrice,
        };
        //para mag pag mag add order sa staff di mapunta sa  cart ng customer

        if (onAddToOrder) {
            onAddToOrder(newCartItem);
            return;
        }

        const existingCart = JSON.parse(
            localStorage.getItem("cartItems") || "[]"
        );

        const updatedCart = [
            ...existingCart,
            newCartItem,
        ];

        localStorage.setItem(
            "cartItems",
            JSON.stringify(updatedCart)
        );

        navigate("/");
    };

    const handleBack = () => {
        if (onClose) {
            onClose();
            return;
        }

        navigate(-1);
    };

    return (
        <div className="customization-page">

            <div className="customization-image">

                <img
                    src="/src/assets/images/menu/kopi.png"
                    alt={product.name}
                />

                <button
                    type="button"
                    className="customization-back-button"
                    onClick={handleBack}
                >
                    <BackButton />
                </button>

                {product.badge &&
                    product.badge !== "soldOut" && (
                        <Badge
                            type={product.badge}
                            className="customization-badge"
                        />
                    )}

            </div>

            <div className="customization-content">

                <div className="customization-product-info">

                    <span className="customization-category">
                        {product.category}
                    </span>

                    <h1 className="customization-name">
                        {product.name}
                    </h1>

                    <p className="customization-price">
                        ₱{Number(product.price).toFixed(2)}
                    </p>

                    <p className="customization-description">
                        {product.description}
                    </p>

                </div>

                {hasTemperature && (
                    <section className="customization-section">

                        <h2 className="customization-section-title">
                            Temperature
                            {requiresTemperature && " *"}
                        </h2>

                        <div
                            className={`temperature-options ${
                                temperatureError ? "error" : ""
                            }`}
                        >

                            {product.temperature.includes("hot") && (
                                <button
                                    type="button"
                                    className={`temperature-option temperature-hot ${
                                        selectedTemperature === "hot"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        toggleTemperature("hot")
                                    }
                                >
                                    <HotIcon className="temperature-icon" />
                                    <span>Hot</span>
                                </button>
                            )}

                            {product.temperature.includes("iced") && (
                                <button
                                    type="button"
                                    className={`temperature-option temperature-iced ${
                                        selectedTemperature === "iced"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        toggleTemperature("iced")
                                    }
                                >
                                    <IcedIcon className="temperature-icon" />
                                    <span>Iced</span>
                                </button>
                            )}

                        </div>

                        {temperatureError && (
                            <p className="temperature-error">
                                Please select a temperature.
                            </p>
                        )}

                    </section>
                )}

                {hasAddOns && (
                    <section className="customization-section">

                        <h2 className="customization-section-title">
                            Add-ons <span>Optional</span>
                        </h2>

                        <div className="addon-list">

                            {ADD_ONS.map((addOn) => {

                                const isSelected =
                                    selectedAddOns.includes(addOn.id);

                                return (
                                    <button
                                        key={addOn.id}
                                        type="button"
                                        className={`addon-option ${
                                            isSelected
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            toggleAddOn(addOn.id)
                                        }
                                    >

                                        <span className="addon-check">
                                            {isSelected && (
                                                <CheckIcon />
                                            )}
                                        </span>

                                        <span className="addon-name">
                                            {addOn.name}
                                        </span>

                                        <span className="addon-price">
                                            +₱{addOn.price.toFixed(2)}
                                        </span>

                                    </button>
                                );
                            })}

                        </div>

                    </section>
                )}

                <section className="customization-section quantity-section">

                    <h2 className="customization-section-title">
                        Quantity
                    </h2>

                    <QuantitySelector
                        quantity={quantity}
                        onDecrease={() =>
                            setQuantity((current) =>
                                Math.max(1, current - 1)
                            )
                        }
                        onIncrease={() =>
                            setQuantity((current) =>
                                current + 1
                            )
                        }
                    />

                </section>

                <section className="customization-section notes-section">

                    <h2 className="customization-section-title">
                        Additional Notes
                    </h2>

                    <textarea
                        className="customization-notes"
                        value={notes}
                        onChange={(event) =>
                            setNotes(event.target.value)
                        }
                        placeholder="Add notes..."
                    />

                </section>

                <button
                    type="button"
                    className="customization-order-button"
                    onClick={handleAddToOrder}
                >
                    <span>Add to Order</span>

                    <span>
                        ₱{totalPrice.toFixed(2)}
                    </span>
                </button>

            </div>

        </div>
    );
}