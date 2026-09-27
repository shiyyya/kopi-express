import { useState } from "react";

import Badge from "/src/components/elements/badge/badge";

import ArrowNext from "/src/assets/icons/arrow-next.svg?react";

import ArrowBack from "/src/assets/icons/arrow-back.svg?react";

import "./featured-carousel.css";

function FeaturedCarousel({ products = [], onOrderNow }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    if (!products.length) {
        return null;
    }

    const product = products[currentSlide];

    const nextSlide = () => {
        setCurrentSlide((current) =>
            current === products.length - 1 ? current : current + 1
        );
    };

    const previousSlide = () => {
        setCurrentSlide((current) =>
            current === 0 ? current : current - 1
        );
    };

    const handleOrderNow = () => {
        // Let Home decide if the user needs to log in first.
        onOrderNow?.(product);
    };

    return (
        <section className="featured-carousel">
            <img
                className="featured-carousel-image"
                src={product.image}
                alt={product.name}
            />

            <div className="featured-carousel-overlay"></div>

            <div className="featured-carousel-indicators">
                {products.map((item, index) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`featured-carousel-indicator ${
                            index === currentSlide ? "active" : ""
                        }`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {currentSlide > 0 && (
                <button
                    type="button"
                    className="featured-carousel-arrow featured-carousel-prev"
                    onClick={previousSlide}
                    aria-label="Previous slide"
                >
                    <ArrowBack />
                </button>
            )}

            {currentSlide < products.length - 1 && (
                <button
                    type="button"
                    className="featured-carousel-arrow featured-carousel-next"
                    onClick={nextSlide}
                    aria-label="Next slide"
                >
                    <ArrowNext />
                </button>
            )}

            <div className="featured-carousel-content">
                {product.badge && product.badge !== "soldOut" && (
                    <Badge
                        type={product.badge}
                        className="featured-carousel-badge"
                    />
                )}

                <h2 className="featured-carousel-product-name">
                    {product.name}
                </h2>

                <p className="featured-carousel-product-price">
                    ₱{Number(product.price).toFixed(2)}
                </p>

                {product.temperature?.length > 0 && (
                    <div className="temperature-badges">
                        {product.temperature.includes("hot") && (
                            <Badge type="hot" />
                        )}

                        {product.temperature.includes("iced") && (
                            <Badge type="iced" />
                        )}
                    </div>
                )}

                <button
                    type="button"
                    className="add-to-order-button"
                    onClick={handleOrderNow}
                >
                    Order Now
                </button>
            </div>
        </section>
    );
}

export default FeaturedCarousel;