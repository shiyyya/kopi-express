import { useState } from "react";
import "./delivery-address.css";
import Input from "/src/components/elements/input/input.jsx";
import CheckIcon from "/src/assets/icons/check.svg?react";
import LocationIcon from "/src/assets/icons/location.svg?react";

export default function DeliveryAddress({
    addresses = [],
    selectedAddress = "",
    onSelect,
    onAdd,
    onDelete,
    variant = "default",
}) {
    const [newAddress, setNewAddress] = useState("");
    const [showNewAddress, setShowNewAddress] = useState(addresses.length === 0);
    const isSettings = variant === "settings";

    const handleAdd = () => {
        const value = newAddress.trim();
        if (!value) return;
        onAdd?.(value);
        setNewAddress("");
        setShowNewAddress(false);
    };

    const handleCancel = () => {
        setNewAddress("");
        setShowNewAddress(false);
    };

    const handleDelete = (index) => {
        onDelete?.(index);
    };

    return (
        <div className={`DeliveryAddress ${isSettings ? "DeliveryAddressSettings" : ""}`}>
            <div className="DeliveryAddressHeader">
                {!isSettings && <LocationIcon className="DeliveryAddressIcon" />}
                <h3>{isSettings ? "Saved Addresses" : "Delivery Address"}</h3>
            </div>

            {addresses.length > 0 && (
                <div className="DeliveryAddressList">
                    {addresses.map((address, index) => {
                        const isSelected = selectedAddress === address;

                        if (isSettings) {
                            return (
                                <div
                                    className="DeliveryAddressSettingsRow"
                                    key={address + index}
                                >
                                    <span className="DeliveryAddressSettingsText">
                                        {address}
                                    </span>
                                    <button
                                        type="button"
                                        className="DeliveryAddressDelete"
                                        onClick={() => handleDelete(index)}
                                        aria-label={`Remove ${address}`}
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        }

                        return (
                            <button
                                type="button"
                                className={`DeliveryAddressOption ${isSelected ? "selected" : ""}`}
                                key={address + index}
                                onClick={() => onSelect?.(address)}
                            >
                                <span className="DeliveryAddressText">{address}</span>
                                <span
                                    className={
                                        isSelected
                                            ? "DeliveryAddressCheck"
                                            : "DeliveryAddressRadio"
                                    }
                                >
                                    {isSelected && <CheckIcon />}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {showNewAddress ? (
                <div className="NewDeliveryAddress">
                    <Input
                        type="text"
                        name="newDeliveryAddress"
                        className="DeliveryAddressInput"
                        placeholder="Add new delivery address..."
                        value={newAddress}
                        onChange={(event) => setNewAddress(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") handleAdd();
                        }}
                    />
                    <div className="NewAddressActions">
                        <button
                            type="button"
                            className="AddAddressButton"
                            onClick={handleAdd}
                        >
                            + Add Address
                        </button>
                        {addresses.length > 0 && (
                            <button
                                type="button"
                                className="CancelAddressButton"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    className="AddAddressButton"
                    onClick={() => setShowNewAddress(true)}
                >
                    + Add Address
                </button>
            )}
        </div>
    );
}