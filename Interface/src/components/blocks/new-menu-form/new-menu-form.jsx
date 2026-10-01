import { useEffect, useState } from "react";
import { getIngredients } from "../../../api/inventory.api";
import { getProductIngredients } from "../../../api/product";
import "./new-menu-form.css";

const categories = ["Coffee","Non-Coffee","Pastries","Pasta"];

function NewMenuForm({ product,onCancel,onSave }) {
    const [name,setName] = useState("");
    const [description,setDescription] = useState("");
    const [price,setPrice] = useState("");
    const [category,setCategory] = useState("");
    const [image,setImage] = useState(null);
    const [imagePreview,setImagePreview] = useState(null);
    const [temperature,setTemperature] = useState([]);
    const [ingredients,setIngredients] = useState([]);
    const [availableIngredients,setAvailableIngredients] = useState([]);
    const [ingredientError,setIngredientError] = useState("");
    const isEdit = Boolean(product);
    const isDrink = category === "Coffee" || category === "Non-Coffee";

    useEffect(() => {
        getIngredients()
            .then(({ data }) => setAvailableIngredients(data.inventory || []))
            .catch(() => setAvailableIngredients([]));
    },[]);

    useEffect(() => {
        if (!product) {
            setName("");
            setDescription("");
            setPrice("");
            setCategory("");
            setImage(null);
            setImagePreview(null);
            setTemperature([]);
            setIngredients([]);
            setIngredientError("");
            return;
        }
        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(product.price ?? "");
        setCategory(
            product.category === "coffee" ? "Coffee" :
            product.category === "non_coffee" ? "Non-Coffee" :
            product.category === "pastry" ? "Pastries" :
            product.category === "pasta" ? "Pasta" :
            product.category || ""
        );
        setImage(product.image || null);
        setImagePreview(product.image || null);
        setTemperature(product.temperature || []);
        setIngredientError("");
        getProductIngredients(product.id)
            .then(({ data }) => setIngredients(
                (data.productIngredients || []).map((ingredient) => ({
                    ingredientId:ingredient.ingredientId,
                    quantity:ingredient.quantityRequired,
                    unit:availableIngredients.find((item) => item.id === ingredient.ingredientId)?.unit || "pcs"
                }))
            ))
            .catch(() => setIngredients([]));
    },[product]);

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCategory(value);
        if (value !== "Coffee" && value !== "Non-Coffee") setTemperature([]);
    };

    const handleTemperature = (value) => {
        setTemperature((current) =>
            current.includes(value) ? current.filter((item) => item !== value) : [...current,value]
        );
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleAddIngredient = () => {
        setIngredientError("");
        setIngredients((current) => [...current,{ ingredientId:"",quantity:"",unit:"pcs" }]);
    };

    const handleIngredientChange = (index,field,value) => {
        setIngredientError("");
        setIngredients((current) =>
            current.map((ingredient,ingredientIndex) => {
                if (ingredientIndex !== index) return ingredient;
                if (field === "ingredientId") {
                    const selected = availableIngredients.find((item) => item.id === value);
                    return {...ingredient,ingredientId:value,unit:selected?.unit || "pcs"};
                }
                return {...ingredient,[field]:value};
            })
        );
    };

    const handleRemoveIngredient = (index) => {
        setIngredients((current) => current.filter((_,ingredientIndex) => ingredientIndex !== index));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!name.trim() || !price || !category) return;
        const validIngredients = ingredients.filter(
            (ingredient) => ingredient.ingredientId && ingredient.quantity !== "" && Number(ingredient.quantity) > 0
        );
        if (validIngredients.length === 0) {
            setIngredientError("Please add at least one ingredient with a valid quantity before saving.");
            return;
        }
        setIngredientError("");
        const productData = {
            ...(product || { id:`product-${Date.now()}`,badge:null,available:true }),
            name:name.trim(),
            category,
            price:Number(price),
            description:description.trim(),
            image,
            temperature:isDrink ? temperature : [],
            ingredients:validIngredients.map((ingredient) => ({
                id:ingredient.ingredientId,
                quantity:Number(ingredient.quantity),
                unit:ingredient.unit
            }))
        };
        onSave?.(productData);
    };

    return (
        <form className="NewMenuForm" onSubmit={handleSubmit}>
            <div className="NewMenuFormHeader">
                <div>
                    <h2>{isEdit ? "Edit Menu" : "New Menu"}</h2>
                    <p>{isEdit ? "Update this menu item." : "Create a new menu item."}</p>
                </div>
                <button type="button" className="NewMenuFormClose" onClick={onCancel} aria-label="Close">×</button>
            </div>
            <div className="NewMenuFormContent">
                <div className="NewMenuField">
                    <label>Product Image</label>
                    <label className="NewMenuImageUpload" htmlFor="menu-image">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Product preview" />
                        ) : (
                            <>
                                <strong>+ Upload Image</strong>
                                <span>Choose a product image</span>
                            </>
                        )}
                    </label>
                    <input id="menu-image" type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className="NewMenuField">
                    <label htmlFor="menu-name">Product Name</label>
                    <input id="menu-name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter product name" />
                </div>
                <div className="NewMenuField">
                    <label htmlFor="menu-description">Description</label>
                    <textarea id="menu-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Enter product description" />
                </div>
                <div className="NewMenuFormRow">
                    <div className="NewMenuField">
                        <label htmlFor="menu-price">Price</label>
                        <div className="NewMenuPriceInput">
                            <span>₱</span>
                            <input id="menu-price" type="number" min="0" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0.00" />
                        </div>
                    </div>
                    <div className="NewMenuField">
                        <label htmlFor="menu-category">Category</label>
                        <select id="menu-category" value={category} onChange={handleCategoryChange}>
                            <option value="">Select category</option>
                            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                    </div>
                </div>
                {isDrink && (
                    <div className="NewMenuField">
                        <label>Temperature</label>
                        <div className="NewMenuTemperature">
                            <button type="button" className={temperature.includes("hot") ? "selected" : ""} onClick={() => handleTemperature("hot")}>Hot</button>
                            <button type="button" className={temperature.includes("iced") ? "selected" : ""} onClick={() => handleTemperature("iced")}>Iced</button>
                        </div>
                    </div>
                )}
                <div className="NewMenuIngredients">
                    <div className="NewMenuIngredientsHeader">
                        <div>
                            <label>Ingredients</label>
                            <span>Add the ingredients and amount needed for each of this product.</span>
                        </div>
                        <button type="button" className="NewMenuAddIngredientButton" onClick={handleAddIngredient}>+ Add Ingredient</button>
                    </div>
                    {ingredientError && <div className="NewMenuIngredientError">{ingredientError}</div>}
                    {ingredients.length === 0 ? (
                        <div className="NewMenuIngredientsEmpty"><span>No ingredients added yet.</span></div>
                    ) : (
                        <div className="NewMenuIngredientList">
                            {ingredients.map((ingredient,index) => (
                                <div className="NewMenuIngredient" key={index}>
                                    <div className="NewMenuIngredientName">
                                        <label htmlFor={`ingredient-name-${index}`}>Ingredient</label>
                                        <select id={`ingredient-name-${index}`} value={ingredient.ingredientId || ""} onChange={(event) => handleIngredientChange(index,"ingredientId",event.target.value)}>
                                            <option value="">Select ingredient</option>
                                            {availableIngredients.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="NewMenuIngredientQuantity">
                                        <label htmlFor={`ingredient-quantity-${index}`}>Quantity</label>
                                        <input id={`ingredient-quantity-${index}`} type="number" min="0" step="0.01" value={ingredient.quantity} onChange={(event) => handleIngredientChange(index,"quantity",event.target.value)} placeholder="0" />
                                    </div>
                                    <div className="NewMenuIngredientUnit">
                                        <label htmlFor={`ingredient-unit-${index}`}>Unit</label>
                                        <select id={`ingredient-unit-${index}`} value={ingredient.unit} disabled>
                                            <option value={ingredient.unit}>{ingredient.unit}</option>
                                        </select>
                                    </div>
                                    <button type="button" className="NewMenuRemoveIngredient" onClick={() => handleRemoveIngredient(index)} aria-label="Remove ingredient">×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="NewMenuFormActions">
                <button type="button" className="NewMenuCancelButton" onClick={onCancel}>Cancel</button>
                <button type="submit" className="NewMenuSaveButton">{isEdit ? "Save Changes" : "Save Menu"}</button>
            </div>
        </form>
    );
}

export default NewMenuForm;