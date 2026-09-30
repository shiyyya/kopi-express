function Item_Inventory({
    item,
    adjustment,
    onAdjustmentChange,
    onIncrease,
    onDecrease
}) {
    const formatDate = (date) => {
        if (!date) return "";
        const value = new Date(date);
        if (Number.isNaN(value.getTime())) return "";
        return value.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
        });
    };

    return (
        <div className="ItemInventory">
            <span>{formatDate(item.purchasedAt || item.purchaseDate)}</span>
            <span>{formatDate(item.expiresAt)}</span>
            <span>{item.name}</span>
            <div className="InventoryQuantity">
                <span className="NormalQuantity">
                    {item.quantity}
                </span>
            </div>
            <span>{item.unit}</span>
            <div className="AdjustQuantity">
                <input
                    className="QuantityInput"
                    type="number"
                    min="0"
                    value={adjustment}
                    placeholder="0"
                    onChange={(e) =>
                        onAdjustmentChange(e.target.value)
                    }
                />
                <button
                    type="button"
                    className="QuantityButton AddButton"
                    onClick={onIncrease}
                >
                    ADD
                </button>
                <button
                    type="button"
                    className="QuantityButton RemoveButton"
                    onClick={onDecrease}
                >
                    REMOVE
                </button>
            </div>
        </div>
    );
}

export default Item_Inventory;