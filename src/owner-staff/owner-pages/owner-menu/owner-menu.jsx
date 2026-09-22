import { useState } from "react";
import SearchBar from "/src/components/blocks/search-bar/search-bar";
import CategoryTabs from "/src/components/blocks/product-tabs/product-tabs";
import ProductCard from "/src/components/cards/product-card/product-card.jsx";
import ProductDetailsCard from "/src/components/cards/product-details/product-details.jsx";
import AddonRow from "/src/components/cards/addon-details/addon-row.jsx";
import AddOnCard from "/src/components/cards/add-on-card/add-on-card.jsx";
import NewAddonRow from "/src/components/cards/new-addon-row/new-addon-row.jsx";
import NewMenuCard from "/src/components/cards/new-menu-card/new-menu-card.jsx";
import NewMenuForm from "/src/components/blocks/new-menu-form/new-menu-form.jsx";
import NewAddonForm from "/src/components/blocks/new-addon-form/new-addon-form.jsx";
import LargeHeader from "/src/components/largeheader-wback/largeheader-wback.jsx";
import products from "/src/data/products";
import categories from "/src/data/categories";
import addons from "/src/data/addons";
import "./owner-menu.css";
const OWNER_TABS = [
    { label: "Menu", path: "/owner/menu" },
    { label: "Sales Report", path: "/owner/sales-report" },
    { label: "Inventory", path: "/owner/inventory" },
];
export default function OwnerMenu() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [menuType, setMenuType] = useState("Products");
    const [menuItems, setMenuItems] = useState(products);
    const [addonItems, setAddonItems] = useState(addons);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedAddon, setSelectedAddon] = useState(null);
    const [showNewMenu, setShowNewMenu] = useState(false);
    const [showNewAddon, setShowNewAddon] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingAddon, setEditingAddon] = useState(null);
    const filteredProducts = menuItems
        .filter((product) => {
            let matchesCategory = true;
            if (selectedCategory === "Best Seller") {
                matchesCategory = product.badge === "popular";
            } else if (selectedCategory !== "All") {
                matchesCategory = product.category === selectedCategory;
            }
            const matchesSearch = product.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            if (a.badge === "soldOut" && b.badge !== "soldOut") return 1;
            if (b.badge === "soldOut" && a.badge !== "soldOut") return -1;
            return 0;
        });
    const filteredAddons = addonItems.filter((addon) =>
        addon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleMenuTypeChange = (type) => {
        setMenuType(type);
        setSearchTerm("");
        setSelectedProduct(null);
        setSelectedAddon(null);
        setShowNewMenu(false);
        setShowNewAddon(false);
        setEditingProduct(null);
        setEditingAddon(null);
    };
    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setSelectedAddon(null);
        setEditingProduct(null);
        setEditingAddon(null);
        setShowNewMenu(false);
        setShowNewAddon(false);
    };
    const handleNewMenu = () => {
        setSelectedProduct(null);
        setSelectedAddon(null);
        setEditingProduct(null);
        setEditingAddon(null);
        setShowNewMenu(true);
        setShowNewAddon(false);
    };
    const handleCancelNewMenu = () => {
        setShowNewMenu(false);
        setEditingProduct(null);
    };
    const handleSaveNewMenu = (newProduct) => {
        setMenuItems((current) => [...current, newProduct]);
        setShowNewMenu(false);
        setSelectedProduct(newProduct);
    };
    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setSelectedProduct(null);
        setShowNewMenu(true);
        setShowNewAddon(false);
    };
    const handleSaveEditProduct = (updatedProduct) => {
        setMenuItems((current) =>
            current.map((item) =>
                item.id === updatedProduct.id ? updatedProduct : item
            )
        );
        setSelectedProduct(updatedProduct);
        setEditingProduct(null);
        setShowNewMenu(false);
    };
    const handleDeleteProduct = (product) => {
        setMenuItems((current) =>
            current.filter((item) => item.id !== product.id)
        );
        setSelectedProduct(null);
        setEditingProduct(null);
    };
    const handleAddonSelect = (addon) => {
        setSelectedAddon(addon);
        setSelectedProduct(null);
        setEditingAddon(null);
        setShowNewAddon(false);
        setShowNewMenu(false);
    };
    const handleNewAddon = () => {
        setSelectedAddon(null);
        setSelectedProduct(null);
        setEditingAddon(null);
        setShowNewAddon(true);
        setShowNewMenu(false);
    };
    const handleCancelNewAddon = () => {
        setShowNewAddon(false);
        setEditingAddon(null);
        setSelectedAddon(null);
    };
    const handleSaveNewAddon = (newAddon) => {
        setAddonItems((current) => [...current, newAddon]);
        setShowNewAddon(false);
        setEditingAddon(null);
        setSelectedAddon(newAddon);
    };
    const handleEditAddon = (addon) => {
        setEditingAddon(addon);
        setSelectedAddon(null);
        setShowNewAddon(true);
        setShowNewMenu(false);
    };
    const handleSaveEditAddon = (updatedAddon) => {
        setAddonItems((current) =>
            current.map((item) =>
                item.id === updatedAddon.id ? updatedAddon : item
            )
        );
        setShowNewAddon(false);
        setEditingAddon(null);
        setSelectedAddon(updatedAddon);
    };
    const handleDeleteAddon = (addon) => {
        setAddonItems((current) =>
            current.filter((item) => item.id !== addon.id)
        );
        setSelectedAddon(null);
        setEditingAddon(null);
        setShowNewAddon(false);
    };
    return (
        <div className="OwnerMenuPage">
            <LargeHeader
                title="Kopi Express / Owner"
                tabs={OWNER_TABS}
            />
            <div className="OwnerMenu">
                <div className="owner-menu-card">
                    <section className="menu-section">
                        <div className="menu-header">
                            <SearchBar
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                placeholder={
                                    menuType === "Products"
                                        ? "Search menu..."
                                        : "Search add-ons..."
                                }
                                className="menu-search"
                            />
                        </div>
                        {menuType === "Products" && (
                            <div className="menu-navigation">
                                <CategoryTabs
                                    categories={categories}
                                    selectedCategory={selectedCategory}
                                    onSelect={setSelectedCategory}
                                    className="menu-categories"
                                />
                                <div className="menu-type-toggle">
                                    <button
                                        type="button"
                                        className={
                                            menuType === "Products" ? "active" : ""
                                        }
                                        onClick={() =>
                                            handleMenuTypeChange("Products")
                                        }
                                    >
                                        Products
                                    </button>
                                    <button
                                        type="button"
                                        className={
                                            menuType === "Add-ons" ? "active" : ""
                                        }
                                        onClick={() =>
                                            handleMenuTypeChange("Add-ons")
                                        }
                                    >
                                        Add-ons
                                    </button>
                                </div>
                            </div>
                        )}
                        {menuType === "Products" ? (
                            <>
                                <div className="product-grid">
                                    <NewMenuCard onClick={handleNewMenu} />
                                    {filteredProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            name={product.name}
                                            description={product.description}
                                            price={product.price}
                                            image={product.image}
                                            badge={product.badge}
                                            temperature={product.temperature}
                                            onClick={() =>
                                                handleProductSelect(product)
                                            }
                                        />
                                    ))}
                                </div>
                                {filteredProducts.length === 0 && (
                                    <p className="no-products">
                                        No products found.
                                    </p>
                                )}
                            </>
                        ) : (
                            <div className="addon-section">
                                <div className="addon-header">
                                    <div>
                                        <h3>Add-ons</h3>
                                        <p>
                                            Manage add-ons available for drinks.
                                        </p>
                                    </div>
                                    <div className="menu-type-toggle">
                                        <button
                                            type="button"
                                            className={
                                                menuType === "Products"
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                handleMenuTypeChange("Products")
                                            }
                                        >
                                            Products
                                        </button>
                                        <button
                                            type="button"
                                            className={
                                                menuType === "Add-ons"
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                handleMenuTypeChange("Add-ons")
                                            }
                                        >
                                            Add-ons
                                        </button>
                                    </div>
                                </div>
                                <div className="addon-list">
                                    <NewAddonRow onClick={handleNewAddon} />
                                    {filteredAddons.map((addon) => (
                                        <AddonRow
                                            key={addon.id}
                                            addon={addon}
                                            onClick={handleAddonSelect}
                                        />
                                    ))}
                                </div>
                                {filteredAddons.length === 0 && (
                                    <p className="no-addons">
                                        No add-ons found.
                                    </p>
                                )}
                            </div>
                        )}
                    </section>
                </div>
                <div className="Owner_Menu_Cards">
                    {menuType === "Products" ? (
                        showNewMenu ? (
                            <NewMenuForm
                                product={editingProduct}
                                onCancel={handleCancelNewMenu}
                                onSave={
                                    editingProduct
                                        ? handleSaveEditProduct
                                        : handleSaveNewMenu
                                }
                            />
                        ) : selectedProduct ? (
                            <ProductDetailsCard
                                product={selectedProduct}
                                onClose={() =>
                                    setSelectedProduct(null)
                                }
                                onEdit={handleEditProduct}
                                onDelete={handleDeleteProduct}
                            />
                        ) : (
                            <div className="OwnerMenuEmptyCard">
                                <div className="OwnerMenuEmptyIcon">+</div>
                                <h2>Product Details</h2>
                                <p>
                                    Select a product to view its details or
                                    create a new menu item.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleNewMenu}
                                >
                                    New Menu Item
                                </button>
                            </div>
                        )
                    ) : showNewAddon ? (
                        <NewAddonForm
                            addon={editingAddon}
                            onCancel={handleCancelNewAddon}
                            onSave={
                                editingAddon
                                    ? handleSaveEditAddon
                                    : handleSaveNewAddon
                            }
                        />
                    ) : selectedAddon ? (
                        <AddOnCard
                            addOn={selectedAddon}
                            onEdit={handleEditAddon}
                            onDelete={handleDeleteAddon}
                        />
                    ) : (
                        <div className="OwnerMenuEmptyCard">
                            <div className="OwnerMenuEmptyIcon">+</div>
                            <h2>Add-on Details</h2>
                            <p>
                                Select an add-on to view its details or create
                                a new add-on.
                            </p>
                            <button
                                type="button"
                                onClick={handleNewAddon}
                            >
                                New Add-on
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}