import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SearchBar from "/src/components/blocks/search-bar/search-bar";
import CategoryTabs from "/src/components/blocks/product-tabs/product-tabs";
import ProductCard from "/src/components/cards/product-card/product-card.jsx";
import { getMenuProducts } from "/src/api/product.js";
import "./menu-section.css";

const CATEGORIES = [
    { name: "All", value: "All" },
    { name: "Coffee", value: "coffee" },
    { name: "Non-Coffee", value: "non_coffee" },
    { name: "Pastry", value: "pastry" },
    { name: "Pasta", value: "pasta" },
];

export default function MenuSection({ onLoginRequired }) {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        let cancelled = false;

        getMenuProducts()
            .then((list) => {
                if (!cancelled) setProducts(list);
            })
            .catch((error) => {
                if (!cancelled) {
                    setLoadError(
                        error.message || "Failed to load menu."
                    );
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchesSearch = (product.name ?? "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const handleAddToOrder = (product) => {
        if (onLoginRequired) {
            onLoginRequired(product);
            return;
        }

        navigate("/customization", {
            state: {
                product,
            },
        });
    };

    return (
        <section id="menu-section" className="menu-section">
            <div className="menu-header">
                <SearchBar
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                    placeholder="Search menu..."
                    className="menu-search"
                />
            </div>

            <CategoryTabs
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onSelect={(category) =>
                    setSelectedCategory(
                        typeof category === "object"
                            ? category.value
                            : category
                    )
                }
                className="menu-categories"
            />

            <div className="product-grid">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        name={product.name}
                        description={product.description}
                        price={product.price}
                        image={product.image_url}
                        temperature={product.temperature}
                        isNew={product.isNew}
                        onAddToOrder={() =>
                            handleAddToOrder(product)
                        }
                    />
                ))}
            </div>

            {loading && (
                <p className="no-products">
                    Loading menu...
                </p>
            )}

            {!loading && loadError && (
                <p className="no-products" role="alert">
                    {loadError}
                </p>
            )}

            {!loading &&
                !loadError &&
                filteredProducts.length === 0 && (
                    <p className="no-products">
                        No products found.
                    </p>
                )}
        </section>
    );
}