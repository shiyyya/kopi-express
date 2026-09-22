import { useState } from "react";
import inventory from "/src/data/inventory";
import ConfirmationCard from "../confirmation-card/confirmation-card.jsx";
import "./product-details.css";

export default function ProductDetailsCard({
    product,
    onClose,
    onEdit,
    onDelete,
}) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    if (!product) {
        return null;
    }
    const ingredients = product.ingredients || [];
    const getIngredientName = (ingredient) => {
        const inventoryItem = inventory.find(
            (item) => item.id === ingredient.inventoryId
        );
        return inventoryItem?.name || ingredient.inventoryId || "Unknown ingredient";
    };
    return (
        <>
            <div className="ProductDetailsCard">
                <div className="ProductDetailsCardHeader">
                    <div>
                        <h2>Product Details</h2>
                        <p>View and manage this menu item.</p>
                    </div>
                    <button
                        type="button"
                        className="ProductDetailsCardClose"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                <div className="ProductDetailsCardImage">
                    {product.image ? (
                        <img src={product.image} alt={product.name} />
                    ) : (
                        <span>No Image</span>
                    )}
                </div>
                <div className="ProductDetailsCardInfo">
                    <div>
                        <span className="ProductDetailsCardLabel">
                            Product Name
                        </span>
                        <h3>{product.name}</h3>
                    </div>
                    <div>
                        <span className="ProductDetailsCardLabel">
                            Description
                        </span>
                        <p>
                            {product.description || "No description provided."}
                        </p>
                    </div>
                    <div className="ProductDetailsCardRow">
                        <div>
                            <span className="ProductDetailsCardLabel">
                                Price
                            </span>
                            <strong>₱{product.price}</strong>
                        </div>
                        <div>
                            <span className="ProductDetailsCardLabel">
                                Category
                            </span>
                            <span>{product.category}</span>
                        </div>
                    </div>
                    <div>
                        <span className="ProductDetailsCardLabel">
                            Availability
                        </span>
                        <span
                            className={`ProductDetailsCardAvailability ${
                                product.available ? "available" : "sold-out"
                            }`}
                        >
                            {product.available ? "Available" : "Sold Out"}
                        </span>
                    </div>
                    {product.temperature?.length > 0 && (
                        <div>
                            <span className="ProductDetailsCardLabel">
                                Temperature
                            </span>
                            <span className="ProductDetailsCardTemperature">
                                {product.temperature
                                    .map(
                                        (item) =>
                                            item.charAt(0).toUpperCase() +
                                            item.slice(1)
                                    )
                                    .join(" / ")}
                            </span>
                        </div>
                    )}
                    {ingredients.length > 0 && (
                        <div>
                            <span className="ProductDetailsCardLabel">
                                Ingredients
                            </span>
                            <div className="ProductDetailsCardIngredients">
                                {ingredients.map((ingredient, index) => (
                                    <div
                                        className="ProductDetailsCardIngredient"
                                        key={
                                            ingredient.inventoryId ||
                                            `${ingredient.unit}-${index}`
                                        }
                                    >
                                        <span>
                                            {getIngredientName(ingredient)}
                                        </span>
                                        <strong>
                                            {ingredient.quantity} {ingredient.unit}
                                        </strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="ProductDetailsCardActions">
                    <button
                        type="button"
                        className="ProductDetailsCardEdit"
                        onClick={() => onEdit?.(product)}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        className="ProductDetailsCardDelete"
                        onClick={() => setShowDeleteConfirmation(true)}
                    >
                        Delete
                    </button>
                </div>
            </div>
            {showDeleteConfirmation && (
                <ConfirmationCard
                    title="Delete Product?"
                    message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    onCancel={() => setShowDeleteConfirmation(false)}
                    onConfirm={() => {
                        setShowDeleteConfirmation(false);
                        onDelete?.(product);
                    }}
                />
            )}
        </>
    );
}