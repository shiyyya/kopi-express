import { useState } from "react";
import "./saved-addresses.css";
import Input from "/src/components/elements/input/input.jsx";

export default function SavedAddresses({ addresses, onAdd, onRemove }) {
    const [newAddress, setNewAddress] = useState("");
    const [showNewAddress, setShowNewAddress] = useState(addresses.length === 0);

    const handleAdd = () => {
        const value = newAddress.trim();
        if (!value) return;
        onAdd(value);
        setNewAddress("");
        setShowNewAddress(false);
    };

    const handleCancel = () => {
        setNewAddress("");
        setShowNewAddress(false);
    };

    return (
        <div className="settingsCard">
            <h3 className="cardTitle">Saved Addresses</h3>

            {addresses.map((address, index) => (
                <div className="addressRow" key={address + index}>
                    <span className="addressText">{address}</span>
                    <button
                        type="button"
                        className="removeAddressBtn"
                        onClick={() => onRemove(index)}
                        aria-label={`Remove ${address}`}
                    >
                        ×
                    </button>
                </div>
            ))}

            {showNewAddress ? (
                <>
                    <Input
                        name="newAddress"
                        className="fieldInput addressInput"
                        placeholder="Add new delivery address..."
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleAdd();
                        }}
                    />

                    <div className="addressActions">
                        <button
                            type="button"
                            className="addAddressBtn"
                            onClick={handleAdd}
                        >
                            + Add Address
                        </button>

                        {addresses.length > 0 && (
                            <button
                                type="button"
                                className="cancelAddressBtn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <button
                    type="button"
                    className="addAddressBtn"
                    onClick={() => setShowNewAddress(true)}
                >
                    + Add Address
                </button>
            )}
        </div>
    );
}