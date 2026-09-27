function Item_Inventory({
    item,
    adjustment,
    onAdjustmentChange,
    onIncrease,
    onDecrease
}) {
    return (
        <div className="ItemInventory">
            <span>{item.purchaseDate}</span>

            <span>{item.name}</span>

            <div className="InventoryQuantity">
                <span className="NormalQuantity">
                    {item.quantity}
                </span>
            </div>

            <span>{item.unit}</span>

            <span>{item.expirationDate}</span>

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