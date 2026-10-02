import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./customization.css";
import Badge from "/src/components/elements/badge/badge";
import BackButton from "/src/components/elements/button/back-button/back-button";
import QuantitySelector from "/src/components/elements/quantity-selector/qty-selector";
import HotIcon from "/src/assets/icons/hot.svg?react";
import IcedIcon from "/src/assets/icons/iced.svg?react";
import CheckIcon from "/src/assets/icons/check.svg?react";
import { getAddOns } from "/src/api/addon.js";
import { addToCart } from "/src/api/cart.api.js";

const FALLBACK_IMAGE = "/src/assets/images/menu/kopi.png";

function getTemperatures(product) {
    if (!product) return [];
    if (product.isHotAvailable === true && product.isIcedAvailable === true) {
        return ["hot", "iced"];
    }
    if (product.isHotAvailable === true) {
        return ["hot"];
    }
    if (product.isIcedAvailable === true) {
        return ["iced"];
    }
    if (Array.isArray(product.temperature)) {
        return product.temperature.filter(Boolean);
    }
    return [];
}

export default function Customization({
    product: productProp,
    onClose,
    onAddToOrder,
}) {
    const location = useLocation();
    const navigate = useNavigate();
    const product = productProp || location.state?.product;
    const [addOns, setAddOns] = useState([]);
    const [selectedTemperature, setSelectedTemperature] = useState(null);
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [temperatureError, setTemperatureError] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        let cancelled = false;
        getAddOns()
            .then((list) => {
                if (!cancelled) setAddOns(list);
            })
            .catch((error) => {
                console.error("Failed to load add-ons:", error);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const temperatures = getTemperatures(product);
        if (temperatures.length === 1) {
            setSelectedTemperature(temperatures[0]);
            setTemperatureError(false);
        } else {
            setSelectedTemperature(null);
        }
    }, [product]);

    const handleBack = () => {
        if (onClose) {
            onClose();
            return;
        }
        navigate(-1);
    };

    if (!product) {
        return (
            <div className="customization-page">
                <BackButton onClick={handleBack} />
                <p className="customization-not-found">
                    Product not found.
                </p>
            </div>
        );
    }

    const temperatures = getTemperatures(product);
    const hasTemperature = temperatures.length > 0;
    const requiresTemperature =
        temperatures.includes("hot") &&
        temperatures.includes("iced");
    const hasAddOns = addOns.length > 0 && hasTemperature;

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
            const addOn = addOns.find(
                (item) => item.id === addOnId
            );
            return total + Number(addOn?.price || 0);
        },
        0
    );

    const totalPrice =
        (Number(product.price) + addOnsTotal) * quantity;

    const handleAddToOrder = async () => {
        if (requiresTemperature && !selectedTemperature) {
            setTemperatureError(true);
            return;
        }

        if (onAddToOrder) {
            const selectedAddOnDetails = addOns.filter((addOn) =>
                selectedAddOns.includes(addOn.id)
            );

            onAddToOrder({
                id: `cart-item-${Date.now()}`,
                product: {
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.image || product.image_url,
                },
                temperature: selectedTemperature,
                addOns: selectedAddOnDetails,
                quantity,
                total: totalPrice,
            });
            return;
        }

        setSubmitError("");
        setSubmitting(true);

        try {
            await addToCart({
                productId: product.id,
                quantity,
                addonIds: selectedAddOns,
                temperature: selectedTemperature,
            });
            navigate("/");
        } catch (error) {
            setSubmitError(error.message || "Failed to add to order.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="customization-page">
            <div className="customization-image">
                <img
                    src={
                        product.image ||
                        product.image_url ||
                        FALLBACK_IMAGE
                    }
                    alt={product.name}
                    onError={(event) => {
                        event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                />
                <BackButton onClick={handleBack} />
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
                            {temperatures.includes("hot") && (
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
                            {temperatures.includes("iced") && (
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
                            {addOns.map((addOn) => {
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
                                            +₱{Number(addOn.price).toFixed(2)}
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
                {submitError && (
                    <p
                        className="customization-submit-error"
                        role="alert"
                    >
                        {submitError}
                    </p>
                )}
                <button
                    type="button"
                    className="customization-order-button"
                    onClick={handleAddToOrder}
                    disabled={submitting}
                >
                    <span>
                        {submitting ? "Adding..." : "Add to Order"}
                    </span>
                    <span>
                        ₱{totalPrice.toFixed(2)}
                    </span>
                </button>
            </div>
        </div>
    );
}