import { useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router";

import "./order-history-details.css";

import Header from "/src/components/blocks/header-wback/header-wback.jsx";

import Badge from "/src/components/elements/badge/badge.jsx";

import { getCustomerOrder } from "/src/api/orders.api.js";

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
    if (method === "QR Payment" || method === "gcash") return "GCash";
    if (method === "Cash on Delivery" || method === "cash") return "Cash";
    return method || "Cash";
}

function getItemName(item) {
    return item.product?.name || item.Product?.name || item.name || "Product";
}

function getItemPrice(item) {
    return Number(item.unitPrice ?? item.product?.price ?? item.Product?.price ?? item.price ?? 0);
}

function getItemAddOns(item) {
    return item.addons || item.addOns || item.OrderItemAddOns || [];
}

function getAddOnsTotal(item) {
    return getItemAddOns(item).reduce(
        (total, addOn) => total + Number(addOn.unitPrice ?? addOn.price ?? 0),
        0
    );
}

function getHistoryStatus(status, isPickup) {
    if (status === "completed") return isPickup ? "PICKED UP" : "DELIVERED";
    if (status === "cancelled") return "CANCELLED";
    if (status === "declined") return "DECLINED";
    return String(status || "").replace(/_/g, " ").toUpperCase();
}

function OrderHistoryDetails() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [order, setOrder] = useState(state?.order || null);
    const [loading, setLoading] = useState(!state?.order);
    const [error, setError] = useState("");

    useEffect(() => {
        const id = orderId || state?.order?.orderId;
        if (!id) {
            setLoading(false);
            return;
        }
        let cancelled = false;
        getCustomerOrder(id)
            .then((data) => {
                if (!cancelled) setOrder(data);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message || "Failed to load order details.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [orderId, state?.order?.orderId]);

    if (loading) {
        return (
            <div className="order-history-details-page">
                <Header title="Order Details" />
                <main className="order-history-details-content">
                    <div className="order-details-empty">
                        <p>Loading order details...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-history-details-page">
                <Header title="Order Details" />
                <main className="order-history-details-content">
                    <div className="order-details-empty">
                        <p>{error || "Order details are unavailable."}</p>
                        <button
                            type="button"
                            className="back-to-history-btn"
                            onClick={() => navigate("/order-history", { replace: true })}
                        >
                            Back to Order History
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const isPickup = order.orderType === "Pickup" || order.fulfillmentType === "self_pick_up";
    const items = order.items || order.OrderItems || [];
    const subtotal = Number(order.subtotal) || items.reduce((total, item) => {
        const productPrice = getItemPrice(item);
        const addOnsTotal = getAddOnsTotal(item);
        const quantity = Number(item.quantity) || 1;
        return total + (productPrice + addOnsTotal) * quantity;
    }, 0);
    const deliveryFee = isPickup ? 0 : Number(order.deliveryFee) || 0;
    const total = Number(order.total) || subtotal + deliveryFee;
    const status = getHistoryStatus(order.status, isPickup);
    const orderType = order.orderType || (isPickup ? "Pickup" : "Delivery");

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
                            <strong>{order.orderNo ? `#${order.orderNo}` : "Pending"}</strong>
                        </div>
                        <div>
                            <span>Date</span>
                            <strong>{formatDate(order.createdAt)}</strong>
                        </div>
                        <div>
                            <span>Status</span>
                            <strong className="receipt-status">{status}</strong>
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
                                const itemTotal = (productPrice + addOnsTotal) * quantity;
                                const itemAddOns = getItemAddOns(item);

                                return (
                                    <div
                                        className="receipt-item"
                                        key={`${getItemName(item)}-${index}`}
                                    >
                                        <div className="receipt-item-info">
                                            <div className="receipt-item-top">
                                                <span className="receipt-item-name">{getItemName(item)}</span>
                                                <span className="receipt-item-total">{formatAmount(itemTotal)}</span>
                                            </div>

                                            <div className="receipt-item-meta">
                                                <span>{formatAmount(productPrice)} × {quantity}</span>
                                            </div>

                                            {(item.temperature || itemAddOns.length > 0) && (
                                                <div className="receipt-customization">
                                                    {item.temperature && (
                                                        <Badge
                                                            type={item.temperature.toLowerCase()}
                                                            className="receipt-badge"
                                                        />
                                                    )}

                                                    {itemAddOns.map((addOn, addOnIndex) => (
                                                        <span
                                                            className="receipt-addon-badge"
                                                            key={addOn.id || addOnIndex}
                                                        >
                                                            {addOn.name}
                                                        </span>
                                                    ))}
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
                        <h2>{isPickup ? "Pickup Information" : "Delivery Information"}</h2>

                        <div className="receipt-info-row">
                            <span>Order Type</span>
                            <strong>{orderType}</strong>
                        </div>

                        {isPickup ? (
                            <>
                                <div className="receipt-info-row">
                                    <span>Pickup Store</span>
                                    <strong>
                                        {order.store?.name || order.storeName || order.StoreBranch?.name || "Selected store"}
                                    </strong>
                                </div>

                                <div className="receipt-info-row">
                                    <span>Store Address</span>
                                    <strong>
                                        {order.store?.address || order.StoreBranch?.address || order.address || "No store address available"}
                                    </strong>
                                </div>
                            </>
                        ) : (
                            <div className="receipt-info-row">
                                <span>Delivery Address</span>
                                <strong>
                                    {order.address || order.deliveryAddress || order.CustomerAddress?.address || "No address provided"}
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
                            <strong>{getPaymentMethod(order.paymentMethod)}</strong>
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
                    onClick={() => navigate("/order-history", { replace: true })}
                >
                    Back to Order History
                </button>
            </main>
        </div>
    );
}

export default OrderHistoryDetails;