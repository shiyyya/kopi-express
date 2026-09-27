import { useState } from "react";

import { useNavigate } from "react-router";

import SearchBar from "/src/components/blocks/search-bar/search-bar";

import CategoryTabs from "/src/components/blocks/product-tabs/product-tabs";

import ProductCard from "/src/components/cards/product-card/product-card.jsx";

import products from "/src/data/products";

import categories from "/src/data/categories";

import "./menu-section.css";

export default function MenuSection({ onLoginRequired }) {

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("All");

    //temp muna
    const productData = products;

    const filteredProducts = productData
        .filter((product) => {

            let matchesCategory = true;

            if (selectedCategory === "Best Seller") {

                //temp lng din muna
                matchesCategory = product.badge === "popular";

            } else if (selectedCategory !== "All") {

                matchesCategory =
                    product.category === selectedCategory;

            }

            const matchesSearch = product.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

            return matchesCategory && matchesSearch;

        })
        .sort((a, b) => {

            // temp
            if (a.badge === "soldOut" && b.badge !== "soldOut") {
                return 1;
            }

            if (b.badge === "soldOut" && a.badge !== "soldOut") {
                return -1;
            }

            return 0;

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
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={setSelectedCategory}
                className="menu-categories"
            />

            <div className="product-grid">

                {filteredProducts.map((product) => (

                    <ProductCard
                        key={product.id}
                        name={product.name}
                        description={product.description}
                        price={product.price}
                        image={product.image}
                        badge={product.badge}
                        temperature={product.temperature}
                        onAddToOrder={() =>
                            handleAddToOrder(product)
                        }
                    />

                ))}

            </div>

            {filteredProducts.length === 0 && (

                <p className="no-products">
                    No products found.
                </p>

            )}

        </section>
    );
}