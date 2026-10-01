import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./home.css";
import HomeHeader from "/src/components/layout/home-header/home-header.jsx";
import Sidebar from "/src/components/blocks/sidebar/sidebar.jsx";
import FeaturedCarousel from "/src/components/blocks/featured-carousel/featured-carousel.jsx";
import OrderType from "/src/components/blocks/order-type/order-type.jsx";
import MenuSection from "/src/components/blocks/menu-section/menu-section.jsx";
import DeliveryEligibility from "/src/components/cards/delivery-eligibility/delivery-eligibility.jsx";
import LoginCard from "/src/components/cards/login/login.jsx";
import SignUpCard from "/src/components/cards/signup/signup.jsx";
import Cart from "/src/components/cards/cart/cart.jsx";
import Footer from "/src/components/blocks/footer/footer.jsx";
import StoreSelection from "/src/components/cards/store-selection/store-selection.jsx";
import { getMenuProducts } from "/src/api/product.js";
import { getCart, removeCartItem } from "/src/api/cart.api.js";
import { isTokenExpired, getRole, homeForRole } from "/src/components/ProtectedRoute.jsx";

function hasCustomerSession() {
    const token = localStorage.getItem("token");
    return !!token && !isTokenExpired(token) && getRole(token) === "customer";
}

export default function Home() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [orderType, setOrderType] = useState(
        () => sessionStorage.getItem("orderType") || "delivery"
    );
    const [selectedStore, setSelectedStore] = useState(() => {
        try {
            return JSON.parse(sessionStorage.getItem("selectedStore") || "null");
        } catch {
            return null;
        }
    });

    const [storeSelectionOpen, setStoreSelectionOpen] = useState(false);
    const [deliveryEligibilityOpen, setDeliveryEligibilityOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [signUpOpen, setSignUpOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);

    const [currentUser, setCurrentUser] = useState(() => {
        if (!hasCustomerSession()) return null;
        const savedUser = localStorage.getItem("currentUser");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [pendingProduct, setPendingProduct] = useState(null);

    useEffect(() => {
        sessionStorage.setItem("orderType", orderType);
    }, [orderType]);

    useEffect(() => {
        if (selectedStore) {
            sessionStorage.setItem("selectedStore", JSON.stringify(selectedStore));
        } else {
            sessionStorage.removeItem("selectedStore");
        }
    }, [selectedStore]);

    const loadCart = useCallback(async () => {
        if (!hasCustomerSession()) {
            setCartItems([]);
            return;
        }

        try {
            setCartItems(await getCart());
        } catch (error) {
            console.error("Failed to load cart:", error);
        }
    }, []);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    useEffect(() => {
        getMenuProducts()
            .then(setFeaturedProducts)
            .catch((error) => {
                console.error("Failed to load products:", error);
            });
    }, []);

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    useEffect(() => {
        if (window.location.hash === "#menu") {
            setTimeout(() => {
                document.getElementById("menu")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 0);
        }
    }, []);

    useEffect(() => {
        const handlePageShow = (event) => {
            if (event.persisted) {
                const savedUser = localStorage.getItem("currentUser");
                setCurrentUser(
                    hasCustomerSession() && savedUser ? JSON.parse(savedUser) : null
                );
                loadCart();
            }
        };
        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, [loadCart]);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key !== null && e.key !== "token" && e.key !== "currentUser") return;

            const token = localStorage.getItem("token");

            if (!token || isTokenExpired(token)) {
                setCurrentUser(null); 
                setCartItems([]);
                return;
            }

            const role = getRole(token);
            if (role && role !== "customer") {
                navigate(homeForRole(role), { replace: true });
                return;
            }

            const savedUser = localStorage.getItem("currentUser");
            setCurrentUser(savedUser ? JSON.parse(savedUser) : null);
            loadCart();
        };

        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [navigate, loadCart]);

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const handleFeaturedOrder = (product) => {
        if (!currentUser) {
            setPendingProduct(product);
            setLoginOpen(true);
            return;
        }
        navigate("/customization", {
            state: {
                product,
            },
        });
    };

    const handleLogin = () => {
        setSidebarOpen(false);
        setLoginOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        sessionStorage.removeItem("orderType");
        sessionStorage.removeItem("selectedStore");
        setOrderType("delivery");
        setSelectedStore(null);
        setCurrentUser(null);
        setCartItems([]);
        setSidebarOpen(false);
    };

    const goToCart = () => {
        setCartOpen(true);
    };

    const goToProfile = () => {
        console.log("Go to profile");
    };

    const handleOrderType = (type) => {
        setOrderType(type);
        if (type === "delivery") {
            setSelectedStore(null);
            setStoreSelectionOpen(false);
        } else if (type === "pickup") {
            setStoreSelectionOpen(true);
        }
        console.log("Order type:", type);
    };

    const handleStoreSelect = (store) => {
        setSelectedStore(store);
        setStoreSelectionOpen(false);
    };

    const handleRemoveFromCart = async (itemId) => {
        try {
            await removeCartItem(itemId);
            setCartItems((currentItems) =>
                currentItems.filter((item) => item.id !== itemId)
            );
        } catch (error) {
            console.error("Failed to remove cart item:", error);
        }
    };

    return (
        <div className="homePage">
            <HomeHeader
                currentUser={currentUser}
                onLogin={handleLogin}
                onCartClick={goToCart}
                onProfileClick={goToProfile}
                onMenuClick={() => setSidebarOpen(true)}
                cartCount={cartCount}
            />
            <FeaturedCarousel
                products={featuredProducts}
                onOrderNow={handleFeaturedOrder}
            />
            <OrderType
                selectedType={orderType}
                onSelect={handleOrderType}
                onCheckDelivery={() => setDeliveryEligibilityOpen(true)}
            />
            {selectedStore && orderType === "pickup" && (
                <div className="SelectedStore">
                    <span>Pickup Store</span>
                    <strong>{selectedStore.name}</strong>
                    <small>{selectedStore.address}</small>
                </div>
            )}
            <div id="menu">
                <MenuSection
                    onLoginRequired={handleFeaturedOrder}
                />
            </div>
            <Sidebar
                isOpen={sidebarOpen}
                user={currentUser}
                onClose={() => setSidebarOpen(false)}
                onLogout={handleLogout}
                onLogin={handleLogin}
            />
            {storeSelectionOpen && (
                <div
                    className="store-selection-overlay"
                    onClick={() => setStoreSelectionOpen(false)}
                >
                    <div
                        className="store-selection-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <StoreSelection
                            selectedStore={selectedStore}
                            onSelect={handleStoreSelect}
                        />
                    </div>
                </div>
            )}
            {deliveryEligibilityOpen && (
                <div
                    className="delivery-eligibility-overlay"
                    onClick={() => setDeliveryEligibilityOpen(false)}
                >
                    <div
                        className="delivery-eligibility-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <DeliveryEligibility />
                    </div>
                </div>
            )}
            {loginOpen && (
                <LoginCard
                    onClose={() => setLoginOpen(false)}
                    onSignUp={() => {
                        setLoginOpen(false);
                        setSignUpOpen(true);
                    }}
                    onLoginSuccess={(user) => {
                        setCurrentUser(user.data.account);
                        loadCart();
                    }}
                />
            )}
            {signUpOpen && (
                <SignUpCard
                    onClose={() => setSignUpOpen(false)}
                    onLogin={() => {
                        setSignUpOpen(false);
                        setLoginOpen(true);
                    }}
                    onSignUpSuccess={(user) => {
                        setCurrentUser(user.data.customer);
                        loadCart();
                    }}
                />
            )}
            {cartOpen && (
                <Cart
                    cartItems={cartItems}
                    onClose={() => setCartOpen(false)}
                    onRemove={handleRemoveFromCart}
                    onPlaceOrder={() => {
                        if (orderType === "pickup" && !selectedStore) {
                            setStoreSelectionOpen(true);
                            setCartOpen(false);
                            return;
                        }
                        navigate("/place-order", {
                            state: {
                                items: cartItems,
                                orderType: orderType === "delivery" ? "Delivery" : "Pickup",
                                store: selectedStore,
                            },
                        });
                        setCartOpen(false);
                    }}
                />
            )}
            <Footer />
        </div>
    );
}