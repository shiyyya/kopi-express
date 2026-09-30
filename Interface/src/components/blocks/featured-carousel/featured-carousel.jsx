import { useState } from "react";

import Badge from "/src/components/elements/badge/badge";

import ArrowNext from "/src/assets/icons/arrow-next.svg?react";
import ArrowBack from "/src/assets/icons/arrow-back.svg?react";

import "./featured-carousel.css";

const BANNER_SLIDE = {
    id: "hero-banner",
    isBanner: true,
    image: "/src/assets/images/kopi.png",
};

function FeaturedCarousel({ products = [], onOrderNow }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [BANNER_SLIDE, ...products];
    const slide = slides[currentSlide];

    const nextSlide = () => {
        setCurrentSlide((current) =>
            current === slides.length - 1 ? current : current + 1
        );
    };

    const previousSlide = () => {
        setCurrentSlide((current) =>
            current === 0 ? current : current - 1
        );
    };

    const handleOrderNow = () => {
        if (slide.isBanner) {
            document.getElementById("menu")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });

            return;
        }

        onOrderNow?.(slide);
    };

    return (
        <section
            className={`featured-carousel ${slide.isBanner ? "banner" : ""}`}
        >
            <img
                className={`featured-carousel-image ${
                    slide.isBanner ? "banner" : ""
                }`}
                src={slide.image ?? slide.image_url}
                alt={slide.isBanner ? "Kopi Express" : slide.name}
            />

            <div
                className={`featured-carousel-overlay ${
                    slide.isBanner ? "banner" : ""
                }`}
            ></div>

            <div className="featured-carousel-indicators">
                {slides.map((item, index) => (
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

            {currentSlide < slides.length - 1 && (
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
                {!slide.isBanner && (
                    <>
                        {slide.badge && slide.badge !== "soldOut" && (
                            <Badge
                                type={slide.badge}
                                className="featured-carousel-badge"
                            />
                        )}

                        <h2 className="featured-carousel-product-name">
                            {slide.name}
                        </h2>

                        <p className="featured-carousel-product-price">
                            ₱{Number(slide.price).toFixed(2)}
                        </p>

                        {slide.temperature?.length > 0 && (
                            <div className="temperature-badges">
                                {slide.temperature.includes("hot") && (
                                    <Badge type="hot" />
                                )}

                                {slide.temperature.includes("iced") && (
                                    <Badge type="iced" />
                                )}
                            </div>
                        )}
                    </>
                )}

                <button
                    type="button"
                    className="add-to-order-button"
                    onClick={handleOrderNow}
                >
                    {slide.isBanner ? "View Menu" : "Order Now"}
                </button>
            </div>
        </section>
    );
}

export default FeaturedCarousel;