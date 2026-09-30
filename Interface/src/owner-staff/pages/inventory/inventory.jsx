import { useEffect, useState } from "react";
import "./inventory.css";
import Arrow from "../../../assets/icons/arrow-down.svg?react";
import LargeHeader from "../../../components/largeheader-wback/largeheader-wback";
import Item_Inventory from "../../../components/blocks/items-inventory/items";
import AddInventoryItem from "../../../components/cards/add-inventory-item/add-inventory-item";
import { getIngredients, getOwnBranchStocks, newOwnBranchStock, incrementStock, decrementStock } from "../../../api/inventory.api";

function Inventory() {
    const [inventory, setInventory] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("none");
    const [adjustments, setAdjustments] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadInventory = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getOwnBranchStocks();
            const stocks = response.data?.inventory || [];
            setInventory(stocks.filter((item) => Number(item.quantity) > 0).map((item) => ({
                id: item.id,
                ingredientId: item.ingredientId,
                name: item.Ingredient?.name || "",
                quantity: Number(item.quantity),
                unit: item.Ingredient?.unit || "",
                purchasedAt: item.purchasedAt,
                expiresAt: item.expiresAt
            })));
        } catch (error) {
            setError(error.message || "Failed to load inventory.");
        } finally {
            setLoading(false);
        }
    };
    const loadIngredients = async () => {
        try {
            const response = await getIngredients();
            setIngredients(response.data?.inventory || []);
        } catch (error) {
            setError(error.message || "Failed to load ingredients.");
        }
    };
    useEffect(() => {
        loadInventory();
        loadIngredients();
    }, []);
    const filteredInventory = inventory
        .filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            if (filter === "low") return matchesSearch && Number(item.quantity) < 10;
            if (filter === "high") return matchesSearch && Number(item.quantity) >= 10;
            return matchesSearch;
        })
        .sort((a, b) => {
            if (sort === "name") return a.name.localeCompare(b.name);
            if (sort === "quantity") return Number(b.quantity) - Number(a.quantity);
            if (sort === "unit") {
                const unitCompare = a.unit.localeCompare(b.unit);
                if (unitCompare !== 0) return unitCompare;
                return Number(a.quantity) - Number(b.quantity);
            }
            if (sort === "expiration") return new Date(a.expiresAt) - new Date(b.expiresAt);
            if (filter === "high" || filter === "low") return a.unit.localeCompare(b.unit);
            return 0;
        });
    const handleAdjustmentChange = (id, value) => {
        setAdjustments((current) => ({ ...current, [id]: value }));
    };
    const handleIncrease = async (id) => {
        const adjustment = Number(adjustments[id]) || 0;
        if (adjustment <= 0) return;
        const item = inventory.find((inventoryItem) => inventoryItem.id === id);
        if (!item) return;
        try {
            setError("");
            await incrementStock(item.id, adjustment);
            setAdjustments((current) => ({ ...current, [id]: "" }));
            await loadInventory();
        } catch (error) {
            setError(error.message || "Failed to add stock.");
        }
    };
    const handleDecrease = async (id) => {
        const adjustment = Number(adjustments[id]) || 0;
        if (adjustment <= 0) return;
        const item = inventory.find((inventoryItem) => inventoryItem.id === id);
        if (!item) return;
        if (adjustment > Number(item.quantity)) {
            setError("Cannot remove more stock than the current quantity.");
            return;
        }
        try {
            setError("");
            await decrementStock(item.id, adjustment);
            setAdjustments((current) => ({ ...current, [id]: "" }));
            await loadInventory();
        } catch (error) {
            setError(error.message || "Failed to remove stock.");
        }
    };
    const handleAddItem = async (newItem) => {
        if (!newItem.ingredientId || !newItem.quantity || !newItem.purchasedAt || !newItem.expiresAt) {
            setError("Please complete all fields.");
            return;
        }
        if (new Date(newItem.expiresAt) <= new Date(newItem.purchasedAt)) {
            setError("Expiration date must be after purchase date.");
            return;
        }
        try {
            setError("");
            const branchData = await getOwnBranchStocks();
            const branchInventory = branchData.data?.inventory || [];
            const existingBatch = branchInventory.find(
                (item) =>
                    (item.ingredientId || item.ingredient_id) === newItem.ingredientId &&
                    item.expiresAt &&
                    new Date(item.expiresAt).toISOString().slice(0, 10) === newItem.expiresAt
            );
            if (existingBatch) {
                const ingredient = ingredients.find((item) => item.id === newItem.ingredientId);
                setError(`${ingredient?.name || "This ingredient"} with the same expiration date already exists in this inventory. Please use Adjust Stock instead.`);
                return;
            }
            await newOwnBranchStock({
                ingredientId: newItem.ingredientId,
                quantity: Number(newItem.quantity),
                purchasedAt: newItem.purchasedAt,
                expiresAt: newItem.expiresAt
            });
            setShowAddModal(false);
            await loadInventory();
        } catch (error) {
            setError(error.message || "Failed to add inventory item.");
        }
    };
    return (
        <div className="InventoryPage">
            <LargeHeader title="Kopi Express/Staff" />
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
                            <button onClick={() => { setShowFilter((current) => !current); setShowSort(false); }}>
                                Filter
                                <span><Arrow /></span>
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
                            <button onClick={() => { setShowSort((current) => !current); setShowFilter(false); }}>
                                Sort
                                <span><Arrow /></span>
                            </button>
                            {showSort && (
                                <div className="InventoryDropdown">
                                    <button onClick={() => { setSort("none"); setShowSort(false); }}>Default</button>
                                    <button onClick={() => { setSort("name"); setShowSort(false); }}>Name</button>
                                    <button onClick={() => { setSort("quantity"); setShowSort(false); }}>Quantity</button>
                                    <button onClick={() => { setSort("unit"); setShowSort(false); }}>Unit</button>
                                    <button onClick={() => { setSort("expiration"); setShowSort(false); }}>Expiration Date</button>
                                </div>
                            )}
                        </div>
                        <button className="InventoryAddButton" onClick={() => setShowAddModal(true)}>
                            + Add Item
                        </button>
                    </div>
                </div>
                {error && <div className="InventoryError">{error}</div>}
                <div className="InventoryTable">
                    <div className="InventoryHeader">
                        <span>Purchase Date</span>
                        <span>Name</span>
                        <span>Quantity</span>
                        <span>Unit</span>
                        <span>Expiration Date</span>
                        <span>Adjust Stock</span>
                    </div>
                    <div className="InventoryItems">
                        {loading ? (
                            <div className="InventoryMessage">Loading inventory...</div>
                        ) : filteredInventory.length === 0 ? (
                            <div className="InventoryMessage">No inventory found.</div>
                        ) : (
                            filteredInventory.map((item) => (
                                <Item_Inventory
                                    key={item.id}
                                    item={item}
                                    adjustment={adjustments[item.id] || ""}
                                    onAdjustmentChange={(value) => handleAdjustmentChange(item.id, value)}
                                    onIncrease={() => handleIncrease(item.id)}
                                    onDecrease={() => handleDecrease(item.id)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
            {showAddModal && (
                <AddInventoryItem
                    ingredients={ingredients}
                    onSubmit={handleAddItem}
                    onCancel={() => setShowAddModal(false)}
                />
            )}
        </div>
    );
}
export default Inventory;