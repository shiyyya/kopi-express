import Button from "/src/components/elements/button/button";

import Delivery from "/src/assets/icons/delivery.svg?react";

import Pickup from "/src/assets/icons/pickup.svg?react";

import AddressChecker from "/src/assets/icons/address-check.svg?react";

import "./order-type.css";

function OrderType({ selectedType, onSelect, onCheckDelivery }) {

    return (

        <section className="order-type">

            <div className="order-type-options">

                <Button
                    className={`order-type-option ${
                        selectedType === "delivery" ? "selected" : ""
                    }`}
                    onClick={() => onSelect("delivery")}
                >

                    <Delivery className="order-type-icon" />

                    <span className="order-type-name">
                        Delivery
                    </span>

                </Button>

                <Button
                    className={`order-type-option ${
                        selectedType === "pickup" ? "selected" : ""
                    }`}
                    onClick={() => onSelect("pickup")}
                >

                    <Pickup className="order-type-icon" />

                    <span className="order-type-name">
                        Self Pickup
                    </span>

                </Button>

            </div>

            <button
                type="button"
                className="order-type-check"
                onClick={onCheckDelivery}
            >
                <AddressChecker className="order-type-check-icon" />

                <span>
                    Check if we deliver to your area
                </span>
            </button>

        </section>
    );
}

export default OrderType;