import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import "./order-history.css";

import Header from "/src/components/blocks/header-wback/header-wback.jsx";
import ArrowNext from "/src/assets/icons/arrow-next.svg?react";

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

function OrderHistory() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrders([...savedOrders].reverse());
    }, []);

    const handleOrderClick = (order) => {
        navigate("/order-history/details", {
            state: { order }
        });
    };

    return (
        <div className="order-history-page">
            <Header title="Order History" />
            <div className="order-history-content">
                {orders.length === 0 ? (
                    <div className="order-history-empty">
                        <p>No previous orders found.</p>
                    </div>
                ) : (
                    <div className="order-history-list">
                        {orders.map((order, index) => {
                            const itemCount = (order.items || []).reduce(
                                (total, item) => total + Number(item.quantity || 1),
                                0
                            );
                            const isPickup = order.orderType === "Pickup";
                            const historyStatus = isPickup ? "PICKED UP" : "DELIVERED";

                            return (
                                <button
                                    type="button"
                                    className="order-history-card"
                                    key={order.orderId || index}
                                    onClick={() => handleOrderClick(order)}
                                >
                                    <div className="history-card-top">
                                        <h2 className="history-order-id">
                                            {order.orderId || "Pending"}
                                        </h2>
                                        <span className="history-status">
                                            {historyStatus}
                                        </span>
                                    </div>

                                    <p className="history-date">
                                        {formatDate(order.createdAt)}
                                    </p>

                                    <p className="history-summary">
                                        {itemCount} {itemCount === 1 ? "Item" : "Items"} ·{" "}
                                        {order.orderType || "Pickup"} ·{" "}
                                        {getPaymentMethod(order.paymentMethod)}
                                    </p>

                                    <div className="history-divider"></div>

                                    <div className="history-total">
                                        <span className="history-total-label">
                                            Total
                                        </span>
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