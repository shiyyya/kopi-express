import { useState } from "react";
import "./add-inventory-item.css";

function AddInventoryItem({ ingredients, branches = [], showBranch = false, onSubmit, onCancel }) {
    const [item, setItem] = useState({
        ingredientId: "",
        quantity: "",
        purchasedAt: "",
        expiresAt: "",
        branchId: "",
    });
    const handleChange = (field, value) => {
        setItem((current) => ({ ...current, [field]: value }));
    };
    const handleSubmit = () => {
        onSubmit(item);
    };
    return (
        <div className="InventoryModalOverlay">
            <div className="InventoryModal">
                <h2>Add Inventory Item</h2>
                <label>
                    Ingredient
                    <select value={item.ingredientId} onChange={(e) => handleChange("ingredientId", e.target.value)}>
                        <option value="">Select ingredient</option>
                        {ingredients.map((ingredient) => (
                            <option key={ingredient.id} value={ingredient.id}>
                                {ingredient.name} ({ingredient.unit})
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Quantity
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => handleChange("quantity", e.target.value)}
                    />
                </label>
                {showBranch && (
                    <label>
                        Store
                        <select value={item.branchId} onChange={(e) => handleChange("branchId", e.target.value)}>
                            <option value="">Select store</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </label>
                )}
                <label>
                    Purchase Date
                    <input
                        type="date"
                        value={item.purchasedAt}
                        onChange={(e) => handleChange("purchasedAt", e.target.value)}
                    />
                </label>
                <label>
                    Expiration Date
                    <input
                        type="date"
                        value={item.expiresAt}
                        onChange={(e) => handleChange("expiresAt", e.target.value)}
                    />
                </label>
                <div className="InventoryModalActions">
                    <button className="InventoryModalCancel" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="InventoryModalConfirm" onClick={handleSubmit}>
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddInventoryItem;