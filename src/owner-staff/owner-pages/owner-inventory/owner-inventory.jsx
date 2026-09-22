import { useState } from "react";
import "./owner-inventory.css";
import Arrow from "../../../assets/icons/arrow-down.svg?react";
import LargeHeader from "/src/components/largeheader-wback/largeheader-wback.jsx";
import Item_Inventory from "/src/components/blocks/items-inventory/items.jsx";
import inventoryData from "/src/data/inventory.js";
const OWNER_TABS = [
    { label: "Menu", path: "/owner/menu" },
    { label: "Sales Report", path: "/owner/sales-report" },
    { label: "Inventory", path: "/owner/inventory" },
];
function OwnerInventory() {
    const [inventory, setInventory] = useState(inventoryData);
    const [search, setSearch] = useState("");
    const [showBranch, setShowBranch] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [branch, setBranch] = useState("all");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("none");
    const [adjustments, setAdjustments] = useState({});
    const [newItem, setNewItem] = useState({
        name: "",
        quantity: "",
        unit: "",
        purchaseDate: "",
        expirationDate: "",
        branches: [],
    });
    const filteredInventory = inventory
        .filter((item) => {
            const matchesSearch = item.name
                .toLowerCase()
                .includes(search.toLowerCase());
            const matchesBranch =
                branch === "all" || item.branches?.includes(branch);
            if (filter === "low") {
                return (
                    matchesSearch &&
                    matchesBranch &&
                    Number(item.quantity) < 10
                );
            }
            if (filter === "high") {
                return (
                    matchesSearch &&
                    matchesBranch &&
                    Number(item.quantity) >= 10
                );
            }
            return matchesSearch && matchesBranch;
        })
        .sort((a, b) => {
            if (sort === "name") {
                return a.name.localeCompare(b.name);
            }
            if (sort === "quantity") {
                return Number(b.quantity) - Number(a.quantity);
            }
            if (sort === "unit") {
                const unitCompare = a.unit.localeCompare(b.unit);
                if (unitCompare !== 0) {
                    return unitCompare;
                }
                return Number(a.quantity) - Number(b.quantity);
            }
            if (sort === "expiration") {
                return new Date(a.expirationDate) - new Date(b.expirationDate);
            }
            return 0;
        });
    const handleBranchChange = (selectedBranch) => {
        setBranch(selectedBranch);
        setShowBranch(false);
    };
    const handleAdjustmentChange = (id, value) => {
        setAdjustments((current) => ({
            ...current,
            [id]: value,
        }));
    };
    const handleIncrease = (id) => {
        const adjustment = Number(adjustments[id]) || 0;
        if (adjustment <= 0) return;
        setInventory((current) =>
            current.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity: Number(item.quantity) + adjustment,
                    }
                    : item
            )
        );
        setAdjustments((current) => ({
            ...current,
            [id]: "",
        }));
    };
    const handleDecrease = (id) => {
        const adjustment = Number(adjustments[id]) || 0;
        if (adjustment <= 0) return;
        setInventory((current) =>
            current.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity: Math.max(
                            0,
                            Number(item.quantity) - adjustment
                        ),
                    }
                    : item
            )
        );
        setAdjustments((current) => ({
            ...current,
            [id]: "",
        }));
    };
    const handleNewItemChange = (field, value) => {
        setNewItem((current) => ({
            ...current,
            [field]: value,
        }));
    };
    const handleAddItem = () => {
        if (!newItem.name.trim() || !newItem.quantity || !newItem.unit.trim()) {
            return;
        }
        setInventory((current) => [
            ...current,
            {
                id: Date.now(),
                name: newItem.name.trim(),
                quantity: Number(newItem.quantity),
                unit: newItem.unit.trim(),
                purchaseDate: newItem.purchaseDate,
                expirationDate: newItem.expirationDate,
                branches: newItem.branches,
            },
        ]);
        setNewItem({
            name: "",
            quantity: "",
            unit: "",
            purchaseDate: "",
            expirationDate: "",
            branches: [],
        });
        setShowAddModal(false);
    };
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
                                Branch
                                <span><Arrow /></span>
                            </button>
                            {showBranch && (
                                <div className="InventoryDropdown">
                                    <button
                                        onClick={() =>
                                            handleBranchChange("all")
                                        }
                                    >
                                        All Branches
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleBranchChange("Poblacion")
                                        }
                                    >
                                        Poblacion
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleBranchChange("Bunsuran II")
                                        }
                                    >
                                        Bunsuran II
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleBranchChange("Cacarong Bata")
                                        }
                                    >
                                        Cacarong Bata
                                    </button>
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
                                Filter
                                <span><Arrow /></span>
                            </button>
                            {showFilter && (
                                <div className="InventoryDropdown">
                                    <button
                                        onClick={() => {
                                            setFilter("all");
                                            setShowFilter(false);
                                        }}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter("low");
                                            setShowFilter(false);
                                        }}
                                    >
                                        Low Stock
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFilter("high");
                                            setShowFilter(false);
                                        }}
                                    >
                                        High Stock
                                    </button>
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
                                Sort
                                <span><Arrow /></span>
                            </button>
                            {showSort && (
                                <div className="InventoryDropdown">
                                    <button
                                        onClick={() => {
                                            setSort("none");
                                            setShowSort(false);
                                        }}
                                    >
                                        Default
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSort("name");
                                            setShowSort(false);
                                        }}
                                    >
                                        Name
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSort("quantity");
                                            setShowSort(false);
                                        }}
                                    >
                                        Quantity
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSort("unit");
                                            setShowSort(false);
                                        }}
                                    >
                                        Unit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSort("expiration");
                                            setShowSort(false);
                                        }}
                                    >
                                        Expiration Date
                                    </button>
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
                        <span>Name</span>
                        <span>Quantity</span>
                        <span>Unit</span>
                        <span>Expiration Date</span>
                        <span>Adjust Stock</span>
                    </div>
                    <div className="InventoryItems">
                        {filteredInventory.map((item) => (
                            <Item_Inventory
                                key={item.id}
                                item={item}
                                adjustment={adjustments[item.id] || ""}
                                onAdjustmentChange={(value) =>
                                    handleAdjustmentChange(item.id, value)
                                }
                                onIncrease={() =>
                                    handleIncrease(item.id)
                                }
                                onDecrease={() =>
                                    handleDecrease(item.id)
                                }
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
                            <input
                                type="text"
                                value={newItem.name}
                                onChange={(e) =>
                                    handleNewItemChange(
                                        "name",
                                        e.target.value
                                    )
                                }
                            />
                        </label>
                        <label>
                            Quantity
                            <input
                                type="number"
                                min="0"
                                value={newItem.quantity}
                                onChange={(e) =>
                                    handleNewItemChange(
                                        "quantity",
                                        e.target.value
                                    )
                                }
                            />
                        </label>
                        <label>
                            Unit
                            <input
                                type="text"
                                placeholder="e.g. kg, pcs, L"
                                value={newItem.unit}
                                onChange={(e) =>
                                    handleNewItemChange(
                                        "unit",
                                        e.target.value
                                    )
                                }
                            />
                        </label>
                        <label>
                            Purchase Date
                            <input
                                type="date"
                                value={newItem.purchaseDate}
                                onChange={(e) =>
                                    handleNewItemChange(
                                        "purchaseDate",
                                        e.target.value
                                    )
                                }
                            />
                        </label>
                        <label>
                            Expiration Date
                            <input
                                type="date"
                                value={newItem.expirationDate}
                                onChange={(e) =>
                                    handleNewItemChange(
                                        "expirationDate",
                                        e.target.value
                                    )
                                }
                            />
                        </label>
                        <div className="InventoryModalActions">
                            <button
                                className="InventoryModalCancel"
                                onClick={() => setShowAddModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="InventoryModalConfirm"
                                onClick={handleAddItem}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default OwnerInventory;