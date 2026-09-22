import { useState } from "react";
import inventory from "/src/data/inventory";
import ConfirmationCard from "../confirmation-card/confirmation-card.jsx";
import "./add-on-card.css";
function AddOnCard({ addOn, onEdit, onDelete }) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    if (!addOn) {
        return null;
    }
    const ingredients = addOn.ingredients || [];
    const getIngredientName = (ingredient) => {
        const inventoryItem = inventory.find(
            (item) => item.id === ingredient.inventoryId
        );
        return inventoryItem?.name || ingredient.inventoryId || "Unknown ingredient";
    };
    return (
        <>
            <div className="AddOnCard">
                <div className="AddOnCardHeader">
                    <div>
                        <h2>Add-on Details</h2>
                        <p>View and manage this add-on.</p>
                    </div>
                </div>
                <div className="AddOnCardInfo">
                    <div>
                        <span className="AddOnCardLabel">Add-on Name</span>
                        <h3>{addOn.name}</h3>
                    </div>
                    <div>
                        <span className="AddOnCardLabel">Price</span>
                        <strong>₱{Number(addOn.price).toFixed(2)}</strong>
                    </div>
                    <div>
                        <span className="AddOnCardLabel">Availability</span>
                        <span
                            className={`AddOnCardAvailability ${
                                addOn.available ? "available" : "sold-out"
                            }`}
                        >
                            {addOn.available ? "Available" : "Sold Out"}
                        </span>
                    </div>
                    {ingredients.length > 0 && (
                        <div>
                            <span className="AddOnCardLabel">Ingredients</span>
                            <div className="AddOnCardIngredients">
                                {ingredients.map((ingredient, index) => (
                                    <div
                                        className="AddOnCardIngredient"
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
                <div className="AddOnCardActions">
                    <button
                        type="button"
                        className="AddOnCardEdit"
                        onClick={() => onEdit?.(addOn)}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        className="AddOnCardDelete"
                        onClick={() => setShowDeleteConfirmation(true)}
                    >
                        Delete
                    </button>
                </div>
            </div>
            {showDeleteConfirmation && (
                <ConfirmationCard
                    title="Delete Add-on?"
                    message={`Are you sure you want to delete "${addOn.name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    onCancel={() => setShowDeleteConfirmation(false)}
                    onConfirm={() => {
                        setShowDeleteConfirmation(false);
                        onDelete?.(addOn);
                    }}
                />
            )}
        </>
    );
}
export default AddOnCard;