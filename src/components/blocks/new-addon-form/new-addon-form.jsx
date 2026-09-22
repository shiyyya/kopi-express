import { useEffect, useState } from "react";
import "./new-addon-form.css";

const units = ["pcs","g","ml"];

export default function AddonForm({ addon, onCancel, onSave }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const isEdit = Boolean(addon);

    useEffect(() => {
        if (!addon) {
            setName("");
            setPrice("");
            setIngredients([]);
            return;
        }
        setName(addon.name || "");
        setPrice(addon.price ?? "");
        setIngredients(addon.ingredients || []);
    }, [addon]);

    const handleAddIngredient = () => {
        setIngredients((current) => [
            ...current,
            {
                inventoryId: "",
                quantity: "",
                unit: "pcs",
            },
        ]);
    };

    const handleIngredientChange = (index, field, value) => {
        setIngredients((current) =>
            current.map((ingredient, ingredientIndex) =>
                ingredientIndex === index
                    ? { ...ingredient, [field]: value }
                    : ingredient
            )
        );
    };

    const handleRemoveIngredient = (index) => {
        setIngredients((current) =>
            current.filter((_, ingredientIndex) => ingredientIndex !== index)
        );
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!name.trim() || !price) {
            return;
        }

        const validIngredients = ingredients.filter(
            (ingredient) =>
                ingredient.inventoryId &&
                ingredient.quantity !== "" &&
                Number(ingredient.quantity) > 0 &&
                ingredient.unit
        );

        const addonData = {
            ...(addon || {
                id: `addon-${Date.now()}`,
                available: true,
            }),
            name: name.trim(),
            price: Number(price),
            ingredients: validIngredients.map((ingredient) => ({
                inventoryId: ingredient.inventoryId,
                quantity: Number(ingredient.quantity),
                unit: ingredient.unit,
            })),
        };

        onSave?.(addonData);
    };

    return (
        <form className="AddonForm" onSubmit={handleSubmit}>
            <div className="AddonFormHeader">
                <div>
                    <h2>{isEdit ? "Edit Add-on" : "New Add-on"}</h2>
                    <p>
                        {isEdit
                            ? "Update this add-on."
                            : "Create a new add-on for drinks."}
                    </p>
                </div>
                <button
                    type="button"
                    className="AddonFormClose"
                    onClick={onCancel}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
            <div className="AddonFormContent">
                <div className="AddonField">
                    <label htmlFor="addon-name">Add-on Name</label>
                    <input
                        id="addon-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter add-on name"
                    />
                </div>
                <div className="AddonField">
                    <label htmlFor="addon-price">Price</label>
                    <div className="AddonPriceInput">
                        <span>₱</span>
                        <input
                            id="addon-price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={price}
                            onChange={(event) =>
                                setPrice(event.target.value)
                            }
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <div className="AddonIngredients">
                    <div className="AddonIngredientsHeader">
                        <div>
                            <label>Ingredients</label>
                            <span>
                                Add the ingredients and amount needed for this add-on.
                            </span>
                        </div>
                        <button
                            type="button"
                            className="AddonAddIngredientButton"
                            onClick={handleAddIngredient}
                        >
                            + Add Ingredient
                        </button>
                    </div>
                    {ingredients.length === 0 ? (
                        <div className="AddonIngredientsEmpty">
                            <span>No ingredients added yet.</span>
                        </div>
                    ) : (
                        <div className="AddonIngredientList">
                            {ingredients.map((ingredient, index) => (
                                <div
                                    className="AddonIngredient"
                                    key={index}
                                >
                                    <div className="AddonIngredientName">
                                        <label
                                            htmlFor={`addon-ingredient-name-${index}`}
                                        >
                                            Inventory ID
                                        </label>
                                        <input
                                            id={`addon-ingredient-name-${index}`}
                                            type="text"
                                            value={
                                                ingredient.inventoryId || ""
                                            }
                                            onChange={(event) =>
                                                handleIngredientChange(
                                                    index,
                                                    "inventoryId",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="e.g. inventory-001"
                                        />
                                    </div>
                                    <div className="AddonIngredientQuantity">
                                        <label
                                            htmlFor={`addon-ingredient-quantity-${index}`}
                                        >
                                            Quantity
                                        </label>
                                        <input
                                            id={`addon-ingredient-quantity-${index}`}
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={ingredient.quantity}
                                            onChange={(event) =>
                                                handleIngredientChange(
                                                    index,
                                                    "quantity",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="AddonIngredientUnit">
                                        <label
                                            htmlFor={`addon-ingredient-unit-${index}`}
                                        >
                                            Unit
                                        </label>
                                        <select
                                            id={`addon-ingredient-unit-${index}`}
                                            value={ingredient.unit}
                                            onChange={(event) =>
                                                handleIngredientChange(
                                                    index,
                                                    "unit",
                                                    event.target.value
                                                )
                                            }
                                        >
                                            {units.map((unit) => (
                                                <option
                                                    key={unit}
                                                    value={unit}
                                                >
                                                    {unit}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        className="AddonRemoveIngredient"
                                        onClick={() =>
                                            handleRemoveIngredient(index)
                                        }
                                        aria-label="Remove ingredient"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="AddonFormActions">
                <button
                    type="button"
                    className="AddonCancelButton"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="AddonSaveButton"
                >
                    {isEdit ? "Save Changes" : "Save Add-on"}
                </button>
            </div>
        </form>
    );
}