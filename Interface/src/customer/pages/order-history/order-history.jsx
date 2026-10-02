import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./order-history.css";
import Header from "/src/components/blocks/header-wback/header-wback.jsx";
import ArrowNext from "/src/assets/icons/arrow-next.svg?react";
import { getCustomerOrders } from "/src/api/orders.api.js";

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

function getOrderType(order) {
    return order.orderType || (
        order.fulfillmentType === "self_pick_up" ? "Pickup" : "Delivery"
    );
}

function getHistoryStatus(order) {
    const isPickup = getOrderType(order) === "Pickup";
    if (order.status === "completed") return isPickup ? "PICKED UP" : "DELIVERED";
    if (order.status === "cancelled") return "CANCELLED";
    if (order.status === "declined") return "DECLINED";
    return String(order.status || "").replace(/_/g, " ").toUpperCase();
}

function OrderHistory() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        getCustomerOrders()
            .then((data) => {
                if (!cancelled) setOrders(data);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message || "Failed to load order history.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const handleOrderClick = (order) => {
        const orderId = order.orderId || order.id;
        if (!orderId) return;
        navigate(`/order-history/details/${orderId}`, {
            state: { order }
        });
    };

    return (
        <div className="order-history-page">
            <Header title="Order History" />
            <div className="order-history-content">
                {loading ? (
                    <div className="order-history-empty">
                        <p>Loading order history...</p>
                    </div>
                ) : error ? (
                    <div className="order-history-empty">
                        <p>{error}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="order-history-empty">
                        <p>No previous orders found.</p>
                    </div>
                ) : (
                    <div className="order-history-list">
                        {orders.map((order, index) => {
                            const items = order.items || order.OrderItems || [];
                            const itemCount = items.reduce(
                                (total, item) => total + Number(item.quantity || 1),
                                0
                            );
                            const orderType = getOrderType(order);
                            return (
                                <button
                                    type="button"
                                    className="order-history-card"
                                    key={order.orderId || order.id || index}
                                    onClick={() => handleOrderClick(order)}
                                >
                                    <div className="history-card-top">
                                        <h2 className="history-order-id">
                                            {order.orderId || order.id || "Pending"}
                                        </h2>
                                        <span className="history-status">
                                            {getHistoryStatus(order)}
                                        </span>
                                    </div>
                                    <p className="history-date">{formatDate(order.createdAt)}</p>
                                    <p className="history-summary">
                                        {itemCount} {itemCount === 1 ? "Item" : "Items"} ·{" "}
                                        {orderType} ·{" "}
                                        {getPaymentMethod(order.paymentMethod)}
                                    </p>
                                    <div className="history-divider"></div>
                                    <div className="history-total">
                                        <span className="history-total-label">Total</span>
                                        <div className="history-total-right">
                                            <span className="history-total-price">
                                                {formatAmount(order.total)}
                                            </span>
                                            <ArrowNext className="history-arrow" />
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderHistory;