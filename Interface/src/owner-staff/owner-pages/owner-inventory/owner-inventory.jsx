import { useEffect, useState } from "react";
import "./owner-inventory.css";
import Arrow from "../../../assets/icons/arrow-down.svg?react";
import LargeHeader from "/src/components/largeheader-wback/largeheader-wback.jsx";
import Item_Inventory from "/src/components/blocks/items-inventory/items.jsx";
import {
    getInventory,
    newStockToBranch,
    incrementBranchStock,
    decrementBranchStock,
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

function OwnerInventory() {
    const [inventory, setInventory] = useState([]);
    const [search, setSearch] = useState("");
    const [showBranch, setShowBranch] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [branch, setBranch] = useState("all");
    const [selectedBranchId, setSelectedBranchId] = useState("");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("none");
    const [adjustments, setAdjustments] = useState({});
    const [newItem, setNewItem] = useState({
        name: "",
        quantity: "",
        unit: "",
        purchaseDate: "",
        branches: [],
    });

    useEffect(() => {
        const loadInventory = async () => {
            try {
                const data = await getInventory();
                setInventory(data.data.inventory);
            } catch (error) {
                console.error("Failed to load inventory:", error);
            }
        };
        loadInventory();
    }, []);

    const filteredInventory = inventory
        .filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            const itemBranchId = item.store_branch_id || item.storeBranchId;
            const matchesBranch = branch === "all" || itemBranchId === selectedBranchId;

            if (!matchesBranch) return false;
            if (filter === "low") return matchesSearch && Number(item.quantity) < 10;
            if (filter === "high") return matchesSearch && Number(item.quantity) >= 10;
            return matchesSearch;
        })
        .sort((a, b) => {
            if (sort === "name") return a.name.localeCompare(b.name);
            if (sort === "quantity") return Number(b.quantity) - Number(a.quantity);
            if (sort === "unit") {
                const unitCompare = a.unit.localeCompare(b.unit);
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

    const handleStoreChange = (e) => {
        const selectedBranch = BRANCHES.find((item) => item.id === e.target.value);
        setSelectedBranchId(selectedBranch?.id || "");
        setNewItem((current) => ({
            ...current,
            branches: selectedBranch ? [selectedBranch.name] : [],
        }));
    };

    const handleAdjustmentChange = (id, value) => {
        setAdjustments((current) => ({ ...current, [id]: value }));
    };

    const handleIncrease = async (id) => {
        const adjustment = Number(adjustments[id]) || 0;
        if (adjustment <= 0) return;

        const item = inventory.find((item) => item.id === id);
        if (!item) return;

        const itemBranchId = item.store_branch_id || item.storeBranchId;
        if (!itemBranchId) return;

        try {
            await incrementBranchStock(id, adjustment);

            setInventory((current) =>
                current.map((item) =>
                    item.id === id
                        ? { ...item, quantity: Number(item.quantity) + adjustment }
                        : item
                )
            );

            setAdjustments((current) => ({ ...current, [id]: "" }));
        } catch (error) {
            console.error("Failed to increase stock:", error);
            alert(error.message || "Failed to increase stock.");
        }
    };

    const handleDecrease = async (id) => {
        const adjustment = Number(adjustments[id]) || 0;
        if (adjustment <= 0) return;

        const item = inventory.find((item) => item.id === id);
        if (!item) return;

        const currentQuantity = Number(item.quantity);
        if (adjustment > currentQuantity) return;

        try {
            await decrementBranchStock(id, adjustment);

            setInventory((current) =>
                current.map((item) =>
                    item.id === id
                        ? { ...item, quantity: currentQuantity - adjustment }
                        : item
                )
            );

            setAdjustments((current) => ({ ...current, [id]: "" }));
        } catch (error) {
            console.error("Failed to decrease stock:", error);
            alert(error.message || "Failed to decrease stock.");
        }
    };

    const handleNewItemChange = (field, value) => {
        setNewItem((current) => ({ ...current, [field]: value }));
    };

    const handleAddItem = async () => {
        if (!selectedBranchId) return;
        if (!newItem.name.trim() || !newItem.quantity || !newItem.unit.trim()) return;

        try {
            await newStockToBranch(selectedBranchId, {
                name: newItem.name.trim(),
                quantity: Number(newItem.quantity),
                unit: newItem.unit.trim(),
            });

            const data = await getInventory();
            setInventory(data.data.inventory);

            setNewItem({
                name: "",
                quantity: "",
                unit: "",
                purchaseDate: "",
                branches: [],
            });
            setSelectedBranchId("");
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
                            <button onClick={() => {
                                setShowBranch((current) => !current);
                                setShowFilter(false);
                                setShowSort(false);
                            }}>
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
                            <button onClick={() => {
                                setShowFilter((current) => !current);
                                setShowBranch(false);
                                setShowSort(false);
                            }}>
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
                            <button onClick={() => {
                                setShowSort((current) => !current);
                                setShowBranch(false);
                                setShowFilter(false);
                            }}>
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
                        <button className="InventoryAddButton" onClick={() => setShowAddModal(true)}>
                            + Add Item
                        </button>
                    </div>
                </div>
                <div className="InventoryTable">
                    <div className="InventoryHeader">
                        <span>Purchase Date</span>
                        <span>Name</span>
                        <span>Quantity</span>
                        <span>Unit</span>
                        <span>Adjust Stock</span>
                    </div>
                    <div className="InventoryItems">
                        {filteredInventory.map((item) => (
                            <Item_Inventory
                                key={item.id}
                                item={item}
                                adjustment={adjustments[item.id] || ""}
                                onAdjustmentChange={(value) => handleAdjustmentChange(item.id, value)}
                                onIncrease={() => handleIncrease(item.id)}
                                onDecrease={() => handleDecrease(item.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {showAddModal && (
                <div className="InventoryModalOverlay">
                    <div className="InventoryModal">
                        <h2>Add Inventory Item</h2>
                        <label>
                            Name
                            <input type="text" value={newItem.name} onChange={(e) => handleNewItemChange("name", e.target.value)} />
                        </label>
                        <label>
                            Quantity
                            <input type="number" min="0" value={newItem.quantity} onChange={(e) => handleNewItemChange("quantity", e.target.value)} />
                        </label>
                        <label>
                            Unit
                            <select value={newItem.unit} onChange={(e) => handleNewItemChange("unit", e.target.value)}>
                                <option value="">Select unit</option>
                                <option value="ml">ml</option>
                                <option value="g">g</option>
                                <option value="pcs">pcs</option>
                            </select>
                        </label>
                        <label>
                            Store
                            <select value={selectedBranchId} onChange={handleStoreChange}>
                                <option value="">Select store</option>
                                {BRANCHES.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Purchase Date
                            <input type="date" value={newItem.purchaseDate} onChange={(e) => handleNewItemChange("purchaseDate", e.target.value)} />
                        </label>
                        <div className="InventoryModalActions">
                            <button className="InventoryModalCancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="InventoryModalConfirm" onClick={handleAddItem}>Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OwnerInventory;