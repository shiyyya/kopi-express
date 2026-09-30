import { useEffect, useState } from "react";
import { getIngredients } from "../../../api/inventory.api";
import { getAddOnIngredients } from "../../../api/addon";
import "./new-addon-form.css";

export default function AddonForm({ addon, onCancel, onSave }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [ingredientError, setIngredientError] = useState("");
    const isEdit = Boolean(addon);

    useEffect(() => {
        getIngredients()
            .then(({ data }) => setAvailableIngredients(data.inventory || []))
            .catch(() => setAvailableIngredients([]));
    }, []);

    useEffect(() => {
        if (!addon) {
            setName("");
            setPrice("");
            setIngredients([]);
            setIngredientError("");
            return;
        }

        setName(addon.name || "");
        setPrice(addon.price ?? "");
        setIngredientError("");

        getAddOnIngredients(addon.id)
            .then(({ data }) =>
                setIngredients(
                    (data.addonIngredients || []).map((ingredient) => ({
                        ingredientId: ingredient.ingredientId,
                        quantity: ingredient.quantityRequired,
                        unit:
                            availableIngredients.find(
                                (item) => item.id === ingredient.ingredientId
                            )?.unit || "pcs",
                    }))
                )
            )
            .catch(() => setIngredients([]));
    }, [addon, availableIngredients]);

    const handleAddIngredient = () => {
        setIngredientError("");
        setIngredients((current) => [
            ...current,
            {
                ingredientId: "",
                quantity: "",
                unit: "pcs",
            },
        ]);
    };

    const handleIngredientChange = (index, field, value) => {
        setIngredientError("");
        setIngredients((current) =>
            current.map((ingredient, ingredientIndex) => {
                if (ingredientIndex !== index) return ingredient;

                if (field === "ingredientId") {
                    const selected = availableIngredients.find(
                        (item) => item.id === value
                    );
                    return {
                        ...ingredient,
                        ingredientId: value,
                        unit: selected?.unit || "pcs",
                    };
                }

                return { ...ingredient, [field]: value };
            })
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
                ingredient.ingredientId &&
                ingredient.quantity !== "" &&
                Number(ingredient.quantity) > 0
        );

        if (validIngredients.length === 0) {
            setIngredientError(
                "Please add at least one ingredient with a valid quantity before saving."
            );
            return;
        }

        setIngredientError("");

        const addonData = {
            ...(addon || {
                id: `addon-${Date.now()}`,
                available: true,
            }),
            name: name.trim(),
            price: Number(price),
            ingredients: validIngredients.map((ingredient) => ({
                id: ingredient.ingredientId,
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
                    {ingredientError && (
                        <div className="AddonIngredientError">
                            {ingredientError}
                        </div>
                    )}
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
                                            Ingredient
                                        </label>
                                        <select
                                            id={`addon-ingredient-name-${index}`}
                                            value={ingredient.ingredientId || ""}
                                            onChange={(event) =>
                                                handleIngredientChange(
                                                    index,
                                                    "ingredientId",
                                                    event.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select ingredient
                                            </option>
                                            {availableIngredients.map(
                                                (availableIngredient) => (
                                                    <option
                                                        key={
                                                            availableIngredient.id
                                                        }
                                                        value={
                                                            availableIngredient.id
                                                        }
                                                    >
                                                        {availableIngredient.name}
                                                    </option>
                                                )
                                            )}
                                        </select>
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
                                            <option value="pcs">pcs</option>
                                            <option value="g">g</option>
                                            <option value="ml">ml</option>
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