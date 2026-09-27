import { useEffect, useState } from "react";
import "./new-menu-form.css";

const categories = ["Coffee","Non-Coffee","Pastries","Pasta"];
const units = ["pcs","g","ml"];

function NewMenuForm({ product, onCancel, onSave }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [temperature, setTemperature] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const isEdit = Boolean(product);
    const isDrink = category === "Coffee" || category === "Non-Coffee";

    useEffect(() => {
        if (!product) {
            setName("");
            setDescription("");
            setPrice("");
            setCategory("");
            setImage(null);
            setTemperature([]);
            setIngredients([]);
            return;
        }
        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(product.price ?? "");
        setCategory(product.category || "");
        setImage(product.image || null);
        setTemperature(product.temperature || []);
        setIngredients(product.ingredients || []);
    }, [product]);

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCategory(value);
        if (value !== "Coffee" && value !== "Non-Coffee") {
            setTemperature([]);
        }
    };

    const handleTemperature = (value) => {
        setTemperature((current) =>
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
        );
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setImage(file);
    };

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

        if (!name.trim() || !price || !category) {
            return;
        }

        const validIngredients = ingredients.filter(
            (ingredient) =>
                ingredient.inventoryId &&
                ingredient.quantity !== "" &&
                Number(ingredient.quantity) > 0 &&
                ingredient.unit
        );

        const productData = {
            ...(product || {
                id: `product-${Date.now()}`,
                badge: null,
                available: true,
            }),
            name: name.trim(),
            category,
            price: Number(price),
            description: description.trim(),
            image,
            temperature: isDrink ? temperature : [],
            ingredients: validIngredients.map((ingredient) => ({
                inventoryId: ingredient.inventoryId,
                quantity: Number(ingredient.quantity),
                unit: ingredient.unit,
            })),
        };

        onSave?.(productData);
    };

    return (
        <form className="NewMenuForm" onSubmit={handleSubmit}>
            <div className="NewMenuFormHeader">
                <div>
                    <h2>{isEdit ? "Edit Menu" : "New Menu"}</h2>
                    <p>
                        {isEdit
                            ? "Update this menu item."
                            : "Create a new menu item."}
                    </p>
                </div>
                <button
                    type="button"
                    className="NewMenuFormClose"
                    onClick={onCancel}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
            <div className="NewMenuFormContent">
                <div className="NewMenuField">
                    <label>Product Image</label>
                    <label
                        className="NewMenuImageUpload"
                        htmlFor="menu-image"
                    >
                        {image ? (
                            <span>
                                {typeof image === "string"
                                    ? image.split("/").pop()
                                    : image.name}
                            </span>
                        ) : (
                            <>
                                <strong>+ Upload Image</strong>
                                <span>Choose a product image</span>
                            </>
                        )}
                    </label>
                    <input
                        id="menu-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="NewMenuField">
                    <label htmlFor="menu-name">Product Name</label>
                    <input
                        id="menu-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter product name"
                    />
                </div>
                <div className="NewMenuField">
                    <label htmlFor="menu-description">Description</label>
                    <textarea
                        id="menu-description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Enter product description"
                    />
                </div>
                <div className="NewMenuFormRow">
                    <div className="NewMenuField">
                        <label htmlFor="menu-price">Price</label>
                        <div className="NewMenuPriceInput">
                            <span>₱</span>
                            <input
                                id="menu-price"
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
                    <div className="NewMenuField">
                        <label htmlFor="menu-category">Category</label>
                        <select
                            id="menu-category"
                            value={category}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Select category</option>
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {isDrink && (
                    <div className="NewMenuField">
                        <label>Temperature</label>
                        <div className="NewMenuTemperature">
                            <button
                                type="button"
                                className={
                                    temperature.includes("hot")
                                        ? "selected"
                                        : ""
                                }
                                onClick={() => handleTemperature("hot")}
                            >
                                Hot
                            </button>
                            <button
                                type="button"
                                className={
                                    temperature.includes("iced")
                                        ? "selected"
                                        : ""
                                }
                                onClick={() => handleTemperature("iced")}
                            >
                                Iced
                            </button>
                        </div>
                    </div>
                )}
                <div className="NewMenuIngredients">
                    <div className="NewMenuIngredientsHeader">
                        <div>
                            <label>Ingredients</label>
                            <span>
                                Add the ingredients and amount needed for each of this product.
                            </span>
                        </div>
                        <button
                            type="button"
                            className="NewMenuAddIngredientButton"
                            onClick={handleAddIngredient}
                        >
                            + Add Ingredient
                        </button>
                    </div>
                    {ingredients.length === 0 ? (
                        <div className="NewMenuIngredientsEmpty">
                            <span>No ingredients added yet.</span>
                        </div>
                    ) : (
                        <div className="NewMenuIngredientList">
                            {ingredients.map((ingredient, index) => (
                                <div
                                    className="NewMenuIngredient"
                                    key={index}
                                >
                                    <div className="NewMenuIngredientName">
                                        <label
                                            htmlFor={`ingredient-name-${index}`}
                                        >
                                            Inventory ID
                                        </label>
                                        <input
                                            id={`ingredient-name-${index}`}
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
                                    <div className="NewMenuIngredientQuantity">
                                        <label
                                            htmlFor={`ingredient-quantity-${index}`}
                                        >
                                            Quantity
                                        </label>
                                        <input
                                            id={`ingredient-quantity-${index}`}
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
                                    <div className="NewMenuIngredientUnit">
                                        <label
                                            htmlFor={`ingredient-unit-${index}`}
                                        >
                                            Unit
                                        </label>
                                        <select
                                            id={`ingredient-unit-${index}`}
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
                                        className="NewMenuRemoveIngredient"
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
            <div className="NewMenuFormActions">
                <button
                    type="button"
                    className="NewMenuCancelButton"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="NewMenuSaveButton"
                >
                    {isEdit ? "Save Changes" : "Save Menu"}
                 </button>
            </div>
        </form>
    );
}

export default NewMenuForm;