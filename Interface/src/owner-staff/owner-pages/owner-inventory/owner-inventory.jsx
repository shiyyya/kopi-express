import { useEffect, useState } from "react";
import "./owner-inventory.css";
import Arrow from "/src/assets/icons/arrow-down.svg?react";
import LargeHeader from "/src/components/largeheader-wback/largeheader-wback.jsx";
import Item_Inventory from "/src/components/blocks/items-inventory/items.jsx";
import ConfirmationCard from "/src/components/cards/confirmation-card/confirmation-card.jsx";
import AddInventoryItem from "/src/components/cards/add-inventory-item/add-inventory-item";
import {
    getIngredients,
    createIngredient,
    updateIngredient,
    getBranchStocks,
    newStockToBranch,
    deleteStockFromBranch,
    deleteIngredient,
    incrementStock,
    decrementStock,
} from "/src/api/inventory.api.js";

const OWNER_TABS = [
    { label: "Menu", path: "/owner/menu" },
    { label: "Sales Report", path: "/owner/sales-report" },
    { label: "Inventory", path: "/owner/inventory" },
];

const BRANCHES = [
    { name: "Poblacion", id: "01M34B40SEJKXD58FB337RY1RD" },
    { name: "Bunsuran II", id: "01M34B3AZHBT272V4H49CWZZ4E" },
    { name: "Cacarong Bata", id: "01M34B2F2M5GH5EHJA2PARV0TK" },
];

const UNITS = ["g", "ml", "pcs"];

function OwnerInventory() {
    const [inventory, setInventory] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [search, setSearch] = useState("");
    const [showBranch, setShowBranch] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showIngredientModal, setShowIngredientModal] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [deletingIngredient, setDeletingIngredient] = useState(null);
    const [branch, setBranch] = useState("all");
    const [selectedBranchId, setSelectedBranchId] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("none");
    const [adjustments, setAdjustments] = useState({});
    const [newIngredient, setNewIngredient] = useState({
        name: "",
        unit: "",
    });

    useEffect(() => {
        const loadIngredients = async () => {
            try {
                const data = await getIngredients();
                setIngredients(data.data.inventory || []);
            } catch (error) {
                console.error("Failed to load ingredients:", error);
            }
        };
        loadIngredients();
    }, []);

    useEffect(() => {
        const loadInventory = async () => {
            try {
                if (branch === "all") {
                    const results = await Promise.all(BRANCHES.map((item) => getBranchStocks(item.id)));
                    const allInventory = results.flatMap((result) => result.data.inventory || []);
                    setInventory(allInventory);
                    return;
                }
                if (!selectedBranchId) {
                    setInventory([]);
                    return;
                }
                const data = await getBranchStocks(selectedBranchId);
                setInventory(data.data.inventory || []);
            } catch (error) {
                console.error("Failed to load inventory:", error);
                setInventory([]);
            }
        };
        loadInventory();
    }, [branch, selectedBranchId]);

    const getIngredient = (item) => {
        if (item.Ingredient) return item.Ingredient;
        if (item.ingredient) return item.ingredient;
        return ingredients.find((ingredient) => ingredient.id === (item.ingredient_id || item.ingredientId));
    };

    const getItemName = (item) => getIngredient(item)?.name || item.name || "Unknown";
    const getItemUnit = (item) => getIngredient(item)?.unit || item.unit || "";
    const getItemBranchId = (item) => item.store_branch_id || item.storeBranchId;

    const filteredInventory = inventory
        .filter((item) => {
            const name = getItemName(item);
            const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
            const itemBranchId = getItemBranchId(item);
            const matchesBranch = branch === "all" || itemBranchId === selectedBranchId;
            if (!matchesBranch) return false;
            if (filter === "low") return matchesSearch && Number(item.quantity) < 10;
            if (filter === "high") return matchesSearch && Number(item.quantity) >= 10;
            return matchesSearch;
        })
        .sort((a, b) => {
            if (sort === "name") return getItemName(a).localeCompare(getItemName(b));
            if (sort === "quantity") return Number(b.quantity) - Number(a.quantity);
            if (sort === "unit") {
                const unitCompare = getItemUnit(a).localeCompare(getItemUnit(b));
                return unitCompare !== 0 ? unitCompare : Number(a.quantity) - Number(b.quantity);
            }
            return 0;
        });

    const handleBranchChange = (selectedBranch) => {
        if (selectedBranch === "all") {
            setBranch("all");
            setSelectedBranchId("");
        } else {
            setBranch(selectedBranch.name);
            setSelectedBranchId(selectedBranch.id);
        }
        setShowBranch(false);
    };

    const handleAdjustmentChange = (id, value) => {
        setAdjustments((current) => ({ ...current, [id]: value }));
    };

    const handleIncrease = async (id) => {
        const adjustment = Number(adjustments[id]) || 0;
        if (adjustment <= 0) return;
        const item = inventory.find((inventoryItem) => inventoryItem.id === id);
        if (!item) return;
        try {
            await incrementStock(item.id, adjustment);
            setAdjustments((current) => ({ ...current, [id]: "" }));
            const data = await getBranchStocks(getItemBranchId(item));
            if (branch === "all") {
                const results = await Promise.all(BRANCHES.map((item) => getBranchStocks(item.id)));
                setInventory(results.flatMap((result) => result.data.inventory || []));
            } else {
                setInventory(data.data.inventory || []);
            }
        } catch (error) {
            alert(error.message || "Failed to add stock.");
        }
    };

    const handleDecrease = async (id) => {
        const adjustment = Number(adjustments[id]) || 0;
        if (adjustment <= 0) return;
        const item = inventory.find((inventoryItem) => inventoryItem.id === id);
        if (!item) return;
        if (adjustment > Number(item.quantity)) {
            alert("Cannot remove more stock than the current quantity.");
            return;
        }
        try {
            await decrementStock(item.id, adjustment);
            setAdjustments((current) => ({ ...current, [id]: "" }));
            const data = await getBranchStocks(getItemBranchId(item));
            if (branch === "all") {
                const results = await Promise.all(BRANCHES.map((item) => getBranchStocks(item.id)));
                setInventory(results.flatMap((result) => result.data.inventory || []));
            } else {
                setInventory(data.data.inventory || []);
            }
        } catch (error) {
            alert(error.message || "Failed to remove stock.");
        }
    };

    const handleNewIngredientChange = (field, value) => {
        setNewIngredient((current) => ({ ...current, [field]: value }));
    };

    const handleOpenCreateIngredient = () => {
        setEditingIngredient(null);
        setNewIngredient({ name: "", unit: "" });
        setShowIngredientModal(true);
    };

    const handleOpenEditIngredient = (ingredient) => {
        setEditingIngredient(ingredient);
        setNewIngredient({
            name: ingredient.name,
            unit: ingredient.unit,
        });
        setShowIngredientModal(true);
    };

    const handleCreateIngredient = async () => {
        if (!newIngredient.name.trim() || !newIngredient.unit) return;
        try {
            if (editingIngredient) {
                const data = await updateIngredient(editingIngredient.id, {
                    name: newIngredient.name.trim(),
                    unit: newIngredient.unit,
                });
                setIngredients((current) =>
                    current.map((item) =>
                        item.id === editingIngredient.id ? data.data.ingredient : item
                    )
                );
            } else {
                await createIngredient({
                    name: newIngredient.name.trim(),
                    unit: newIngredient.unit,
                });
                const ingredientsData = await getIngredients();
                setIngredients(ingredientsData.data.inventory || []);
            }
            setNewIngredient({ name: "", unit: "" });
            setEditingIngredient(null);
            setShowIngredientModal(false);
        } catch (error) {
            console.error("Failed to save ingredient:", error);
            alert(error.message || "Failed to save ingredient.");
        }
    };

    const handleDeleteIngredient = async () => {
        if (!deletingIngredient) return;
        try {
            await deleteIngredient(deletingIngredient.id);
            setIngredients((current) =>
                current.filter((item) => item.id !== deletingIngredient.id)
            );
            setDeletingIngredient(null);
        } catch (error) {
            console.error("Failed to delete ingredient:", error);
            alert(error.message || "Failed to delete ingredient.");
        }
    };

    const handleAddItem = async (newItem) => {
        if (!newItem.branchId) {
            alert("Please select a store.");
            return;
        }
        if (!newItem.ingredientId || !newItem.quantity || !newItem.purchasedAt || !newItem.expiresAt) {
            alert("Please complete all fields.");
            return;
        }
        if (new Date(newItem.expiresAt) <= new Date(newItem.purchasedAt)) {
            alert("Expiration date must be after purchase date.");
            return;
        }
        try {
            const branchData = await getBranchStocks(newItem.branchId);
            const branchInventory = branchData.data?.inventory || [];
            const existingBatch = branchInventory.find(
                (item) =>
                    (item.ingredientId || item.ingredient_id) === newItem.ingredientId &&
                    item.expiresAt &&
                    new Date(item.expiresAt).toISOString().slice(0, 10) === newItem.expiresAt
            );
            if (existingBatch) {
                const ingredient = ingredients.find((item) => item.id === newItem.ingredientId);
                alert(
                    `${ingredient?.name || "This ingredient"} with the same expiration date already exists in this inventory. Please use Adjust Stock instead.`
                );
                return;
            }
            await newStockToBranch(newItem.branchId, {
                ingredientId: newItem.ingredientId,
                quantity: Number(newItem.quantity),
                purchasedAt: newItem.purchasedAt,
                expiresAt: newItem.expiresAt,
            });
            if (branch === "all") {
                const results = await Promise.all(BRANCHES.map((item) => getBranchStocks(item.id)));
                setInventory(results.flatMap((result) => result.data.inventory || []));
            } else if (newItem.branchId === selectedBranchId) {
                setInventory(branchData.data.inventory || []);
            }
            setShowAddModal(false);
        } catch (error) {
            console.error("Failed to add inventory item:", error);
            alert(error.message || "Failed to add inventory item.");
        }
    };

    const branchLabel = branch === "all" ? "All Branches" : branch;
    const filterLabel = filter === "low" ? "Low Stock" : filter === "high" ? "High Stock" : "All";
    const sortLabel = sort === "name" ? "Name" : sort === "quantity" ? "Quantity" : sort === "unit" ? "Unit" : "Default";

    return (
        <div className="InventoryPage">
            <LargeHeader title="Kopi Express / Owner" tabs={OWNER_TABS} />
            <div className="Inventory">
                <div className="InventoryControls">
                    <div className="InventorySearch">
                        <span>⌕</span>
                        <input
                            id="inventory-search"
                            name="inventory-search"
                            type="text"
                            placeholder="Search inventory..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="InventoryActions">
                        <div className="InventoryAction">
                            <button
                                onClick={() => {
                                    setShowBranch((current) => !current);
                                    setShowFilter(false);
                                    setShowSort(false);
                                }}
                            >
                                {branchLabel} <span><Arrow /></span>
                            </button>
                            {showBranch && (
                                <div className="InventoryDropdown">
                                    <button onClick={() => handleBranchChange("all")}>All Branches</button>
                                    {BRANCHES.map((item) => (
                                        <button key={item.id} onClick={() => handleBranchChange(item)}>
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="InventoryAction">
                            <button
                                onClick={() => {
                                    setShowFilter((current) => !current);
                                    setShowBranch(false);
                                    setShowSort(false);
                                }}
                            >
                                Filter: {filterLabel} <span><Arrow /></span>
                            </button>
                            {showFilter && (
                                <div className="InventoryDropdown">
                                    <button onClick={() => { setFilter("all"); setShowFilter(false); }}>All</button>
                                    <button onClick={() => { setFilter("low"); setShowFilter(false); }}>Low Stock</button>
                                    <button onClick={() => { setFilter("high"); setShowFilter(false); }}>High Stock</button>
                                </div>
                            )}
                        </div>
                        <div className="InventoryAction">
                            <button
                                onClick={() => {
                                    setShowSort((current) => !current);
                                    setShowBranch(false);
                                    setShowFilter(false);
                                }}
                            >
                                Sort: {sortLabel} <span><Arrow /></span>
                            </button>
                            {showSort && (
                                <div className="InventoryDropdown">
                                    <button onClick={() => { setSort("none"); setShowSort(false); }}>Default</button>
                                    <button onClick={() => { setSort("name"); setShowSort(false); }}>Name</button>
                                    <button onClick={() => { setSort("quantity"); setShowSort(false); }}>Quantity</button>
                                    <button onClick={() => { setSort("unit"); setShowSort(false); }}>Unit</button>
                                </div>
                            )}
                        </div>
                        <button
                            className="InventoryAddButton"
                            onClick={() => setShowAddModal(true)}
                        >
                            + Add Item
                        </button>
                    </div>
                </div>
                <div className="InventoryTable">
                    <div className="InventoryHeader">
                        <span>Purchase Date</span>
                        <span>Expiration Date</span>
                        <span>Name</span>
                        <span>Quantity</span>
                        <span>Unit</span>
                        <span>Adjust Stock</span>
                    </div>
                    <div className="InventoryItems">
                        {filteredInventory.map((item) => (
                            <Item_Inventory
                                key={item.id}
                                item={{
                                    ...item,
                                    name: getItemName(item),
                                    unit: getItemUnit(item),
                                }}
                                adjustment={adjustments[item.id] || ""}
                                onAdjustmentChange={(value) => handleAdjustmentChange(item.id, value)}
                                onIncrease={() => handleIncrease(item.id)}
                                onDecrease={() => handleDecrease(item.id)}
                            />
                        ))}
                    </div>
                </div>
                <div className="InventoryIngredients">
                    <div className="InventoryIngredientsHeader">
                        <h2>Ingredients</h2>
                        <button onClick={handleOpenCreateIngredient}>+ Add Ingredient</button>
                    </div>
                    <div className="InventoryIngredientsTable">
                        <div className="InventoryIngredientsTableHeader">
                            <span>Name</span>
                            <span>Unit</span>
                            <span>Actions</span>
                        </div>
                        <div className="InventoryIngredientsList">
                            {ingredients.map((ingredient) => (
                                <div className="InventoryIngredientCard" key={ingredient.id}>
                                    <span>{ingredient.name}</span>
                                    <span>{ingredient.unit}</span>
                                    <div className="InventoryIngredientActions">
                                        <button onClick={() => handleOpenEditIngredient(ingredient)}>Edit</button>
                                        <button onClick={() => setDeletingIngredient(ingredient)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {showAddModal && (
                <AddInventoryItem
                    ingredients={ingredients}
                    branches={BRANCHES}
                    showBranch={true}
                    onSubmit={handleAddItem}
                    onCancel={() => setShowAddModal(false)}
                />
            )}
            {showIngredientModal && (
                <div className="InventoryModalOverlay">
                    <div className="InventoryModal">
                        <h2>{editingIngredient ? "Edit Ingredient" : "Create New Ingredient"}</h2>
                        <label>
                            Name
                            <input
                                type="text"
                                value={newIngredient.name}
                                onChange={(e) => handleNewIngredientChange("name", e.target.value)}
                                placeholder="Ingredient name"
                            />
                        </label>
                        <label>
                            Unit
                            <select
                                value={newIngredient.unit}
                                onChange={(e) => handleNewIngredientChange("unit", e.target.value)}
                            >
                                <option value="">Select unit</option>
                                {UNITS.map((unit) => (
                                    <option key={unit} value={unit}>
                                        {unit}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div className="InventoryModalActions">
                            <button
                                className="InventoryModalCancel"
                                onClick={() => {
                                    setShowIngredientModal(false);
                                    setEditingIngredient(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="InventoryModalConfirm"
                                onClick={handleCreateIngredient}
                            >
                                {editingIngredient ? "Save" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {deletingIngredient && (
                <ConfirmationCard
                    title="Delete Ingredient?"
                    message={`Are you sure you want to delete "${deletingIngredient.name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    onCancel={() => setDeletingIngredient(null)}
                    onConfirm={handleDeleteIngredient}
                />
            )}
        </div>
    );
}

export default OwnerInventory;