import { useLocation, useNavigate } from "react-router";
import "./order-history-details.css";
import Header from "/src/components/blocks/header-wback/header-wback.jsx";
import Badge from "/src/components/elements/badge/badge.jsx";

function formatDate(value) {
    if (!value) return "";
    return new Date(value).toLocaleString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}

function formatAmount(value) {
    const number = Number(value) || 0;
    return `₱${number.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function getPaymentMethod(method) {
    if (method === "QR Payment") return "GCash";
    if (method === "Cash on Delivery") return "Cash";
    return method || "Cash";
}

function getItemName(item) {
    return item.product?.name || item.name || "Product";
}

function getItemPrice(item) {
    return Number(item.product?.price ?? item.price ?? 0);
}

function getAddOnsTotal(item) {
    return (item.addOns || []).reduce(
        (total, addOn) => total + Number(addOn.price || 0),
        0
    );
}

function OrderHistoryDetails() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const order = state?.order;

    if (!order) {
        return (
            <div className="order-history-details-page">
                <Header title="Order Details" />
                <main className="order-history-details-content">
                    <div className="order-details-empty">
                        <p>Order details are unavailable.</p>
                        <button
                            type="button"
                            className="back-to-history-btn"
                            onClick={() =>
                                navigate("/order-history", { replace: true })
                            }
                        >
                            Back to Order History
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const isPickup = order.orderType === "Pickup";
    const items = order.items || [];

    const subtotal =
        Number(order.subtotal) ||
        items.reduce((total, item) => {
            const productPrice = getItemPrice(item);
            const addOnsTotal = getAddOnsTotal(item);
            const quantity = Number(item.quantity) || 1;

            return total + (productPrice + addOnsTotal) * quantity;
        }, 0);

    const deliveryFee = isPickup
        ? 0
        : Number(order.deliveryFee) || 0;

    const total =
        Number(order.total) || subtotal + deliveryFee;

    return (
        <div className="order-history-details-page">
            <Header title="Order Details" />

            <main className="order-history-details-content">
                <section className="receipt">
                    <div className="receipt-header">
                        <h1>Kopi Express</h1>
                        <p>Order Receipt</p>
                    </div>

                    <div className="receipt-divider"></div>

                    <div className="receipt-order-info">
                        <div>
                            <span>Order Number</span>
                            <strong>{order.orderId || "Pending"}</strong>
                        </div>
                        <div>
                            <span>Date</span>
                            <strong>{formatDate(order.createdAt)}</strong>
                        </div>
                        <div>
                            <span>Status</span>
                            <strong className="receipt-status">
                                {isPickup ? "PICKED UP" : "DELIVERED"}
                            </strong>
                        </div>
                    </div>

                    <div className="receipt-divider"></div>

                    <section className="receipt-section">
                        <h2>Ordered Items</h2>

                        <div className="receipt-items">
                            {items.map((item, index) => {
                                const productPrice = getItemPrice(item);
                                const addOnsTotal = getAddOnsTotal(item);
                                const quantity = Number(item.quantity) || 1;
                                const itemTotal =
                                    (productPrice + addOnsTotal) * quantity;

                                return (
                                    <div
                                        className="receipt-item"
                                        key={`${getItemName(item)}-${index}`}
                                    >
                                        <div className="receipt-item-info">
                                            <div className="receipt-item-top">
                                                <span className="receipt-item-name">
                                                    {getItemName(item)}
                                                </span>
                                                <span className="receipt-item-total">
                                                    {formatAmount(itemTotal)}
                                                </span>
                                            </div>

                                            <div className="receipt-item-meta">
                                                <span>
                                                    {formatAmount(productPrice)} × {quantity}
                                                </span>
                                            </div>

                                            {(item.temperature ||
                                                item.addOns?.length > 0) && (
                                                <div className="receipt-customization">
                                                    {item.temperature && (
                                                        <Badge
                                                            type={item.temperature.toLowerCase()}
                                                            className="receipt-badge"
                                                        />
                                                    )}

                                                    {item.addOns?.map(
                                                        (addOn, addOnIndex) => (
                                                            <span
                                                                className="receipt-addon-badge"
                                                                key={
                                                                    addOn.id ||
                                                                    addOnIndex
                                                                }
                                                            >
                                                                {addOn.name}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <div className="receipt-divider"></div>

                    <section className="receipt-section">
                        <h2>
                            {isPickup
                                ? "Pickup Information"
                                : "Delivery Information"}
                        </h2>

                        <div className="receipt-info-row">
                            <span>Order Type</span>
                            <strong>{order.orderType || "Pickup"}</strong>
                        </div>

                        {isPickup ? (
                            <>
                                <div className="receipt-info-row">
                                    <span>Pickup Store</span>
                                    <strong>
                                        {order.store?.name ||
                                            order.storeName ||
                                            "Selected store"}
                                    </strong>
                                </div>

                                <div className="receipt-info-row">
                                    <span>Store Address</span>
                                    <strong>
                                        {order.store?.address ||
                                            order.address ||
                                            "No store address available"}
                                    </strong>
                                </div>
                            </>
                        ) : (
                            <div className="receipt-info-row">
                                <span>Delivery Address</span>
                                <strong>
                                    {order.address || "No address provided"}
                                </strong>
                            </div>
                        )}

                        {order.phone && (
                            <div className="receipt-info-row">
                                <span>Phone</span>
                                <strong>{order.phone}</strong>
                            </div>
                        )}

                        <div className="receipt-info-row">
                            <span>Payment Method</span>
                            <strong>
                                {getPaymentMethod(order.paymentMethod)}
                            </strong>
                        </div>
                    </section>

                    <div className="receipt-divider"></div>

                    <section className="receipt-section">
                        <h2>Summary</h2>

                        <div className="receipt-summary-row">
                            <span>Subtotal</span>
                            <span>{formatAmount(subtotal)}</span>
                        </div>

                        <div className="receipt-summary-row">
                            <span>Delivery Fee</span>
                            <span>{formatAmount(deliveryFee)}</span>
                        </div>

                        <div className="receipt-total-row">
                            <span>Total</span>
                            <strong>{formatAmount(total)}</strong>
                        </div>
                    </section>

                    <div className="receipt-divider"></div>

                    <div className="receipt-footer">
                        <p>Thank you for ordering!</p>
                        <span>Kopi Express</span>
                    </div>
                </section>

                <button
                    type="button"
                    className="back-to-history-btn"
                    onClick={() =>
                        navigate("/order-history", { replace: true })
                    }
                >
                    Back to Order History
                </button>
            </main>
        </div>
    );
}

export default OrderHistoryDetails;