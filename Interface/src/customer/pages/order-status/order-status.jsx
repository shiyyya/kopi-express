import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./order-status.css";
import Header from "/src/components/blocks/header-wback/header-wback.jsx";
import CheckIcon from "/src/assets/icons/check.svg?react";
import OrderedItem from "/src/assets/images/cafe.png";
import Address from "/src/assets/icons/location.svg?react";
import { apiFetch, API_ORIGIN } from "/src/api/client.js";

const statuses = ["Order Received", "Preparing", "Done Preparing", "Completed"];
const statusMap = {
    pending: "Order Received",
    queued: "Order Received",
    preparing: "Preparing",
    ready: "Done Preparing",
    completed: "Completed"
};
const statusMessages = {
    "Order Received": "We got your order!",
    Preparing: "Our team is brewing and cooking.",
    "Done Preparing": "Your order is ready for pickup/delivery!",
    Completed: "Enjoy your order!"
};

function formatAmount(value) {
    const number = Number(value) || 0;
    return `₱${number.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function getStatusIndex(status) {
    const index = statuses.indexOf(statusMap[status] || status);
    return index === -1 ? 0 : index;
}

function getImageUrl(image) {
    if (!image) return OrderedItem;
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    return `${API_ORIGIN}${image.startsWith("/") ? "" : "/"}${image}`;
}

function formatOrderDate(date) {
    if (!date) return "";
    return new Date(date).toLocaleString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}

function isActiveOrder(order) {
    return !["completed", "declined", "cancelled"].includes(order.status);
}

export default function OrderStatus() {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedOrderId = location.state?.orderId;
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchOrders = async () => {
            try {
                const response = await apiFetch("/orders/customer");
                const fetchedOrders = response.data?.orders || [];
                if (cancelled) return;

                setOrders(fetchedOrders.filter(isActiveOrder));

                if (!selectedOrderId) {
                    setOrder(null);
                    setError("");
                    setLoading(false);
                    return;
                }

                const detailResponse = await apiFetch(
                    `/orders/customer/${selectedOrderId}`
                );
                const selectedOrder = detailResponse.data?.order;

                if (cancelled) return;

                if (!selectedOrder) {
                    setOrder(null);
                    setError("Order not found.");
                } else {
                    setOrder(selectedOrder);
                    setError("");
                }

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch order status:", error);
                if (!cancelled) {
                    setError(error.message || "Failed to load order status.");
                    setLoading(false);
                }
            }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 3000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [selectedOrderId]);

    if (loading) {
        return (
            <div className="order-status-page">
                <Header title="Order Status" />
                <div className="order-status-content">
                    <div className="order-info-card">
                        <p>Loading order status...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-status-page">
                <Header title="Order Status" />
                <div className="order-status-content">
                    <div className="order-info-card">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedOrderId) {
        return (
            <div className="order-status-page">
                <Header title="Order Status" />
                <div className="order-status-content">
                    {orders.length ? (
                        orders.map((activeOrder) => {
                            const currentStatus =
                                statusMap[activeOrder.status] || activeOrder.status;
                            const isPickup =
                                activeOrder.fulfillmentType === "self_pick_up";

                            return (
                                <button
                                    type="button"
                                    className="order-info-card"
                                    key={activeOrder.id}
                                    onClick={() =>
                                        navigate("/order-status", {
                                            state: { orderId: activeOrder.id }
                                        })
                                    }
                                >
                                    <div className="order-info-details">
                                        <h2 className="order-number">
                                            {activeOrder.id || "Pending"}
                                        </h2>
                                        <div className="status-badge">
                                            <span className="order-status">
                                                {currentStatus}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="order-date">
                                        {formatOrderDate(activeOrder.createdAt)}
                                    </p>
                                    <div className="order-card-summary">
                                        <span>
                                            {isPickup ? "Pickup" : "Delivery"}
                                        </span>
                                        <span>{formatAmount(activeOrder.total)}</span>
                                    </div>
                                </button>
                            );
                        })
                    ) : (
                        <div className="order-info-card">
                            <p>No active orders.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (!order) return null;

    const isPickup = order.fulfillmentType === "self_pick_up";
    const isCancelled = ["declined", "cancelled"].includes(order.status);
    const currentStatus = statusMap[order.status] || order.status;
    const currentStatusIndex = getStatusIndex(order.status);
    const items = order.items || [];
    const total = Number(order.total || 0);

    return (
        <div className="order-status-page">
            <Header title="Order Status" />
            <div className="order-status-content">
                <div className="order-info-card">
                    <div className="order-info-details">
                        <h2 className="order-number">{order.id || "Pending"}</h2>
                        <div className="status-badge">
                            <span className="order-status">
                                {isCancelled ? order.status : currentStatus}
                            </span>
                        </div>
                    </div>
                    <p className="order-date">{formatOrderDate(order.createdAt)}</p>
                </div>

                <div className="order-progress-card">
                    <h2 className="progress-title">
                        {isCancelled ? "Order Status" : "Order Progress"}
                    </h2>
                    <div className="progress-list">
                        {isCancelled ? (
                            <div className="progress-item completed">
                                <div className="progress-icon-wrap">
                                    <span className="progress-check current">
                                        <CheckIcon />
                                    </span>
                                </div>
                                <div className="progress-details">
                                    <h2 className="progress-status">
                                        {order.status === "declined"
                                            ? "Order Declined"
                                            : "Order Cancelled"}
                                    </h2>
                                    <p className="progress-message">
                                        {order.status === "declined"
                                            ? "Your order was declined."
                                            : "Your order was cancelled."}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            statuses.map((status, index) => {
                                const isCompleted = index <= currentStatusIndex;
                                const isCurrent = index === currentStatusIndex;
                                const hasLine = index < currentStatusIndex;

                                return (
                                    <div
                                        className={`progress-item ${isCompleted ? "completed" : ""} ${hasLine ? "has-line" : ""}`}
                                        key={status}
                                    >
                                        <div className="progress-icon-wrap">
                                            {isCompleted ? (
                                                <span
                                                    className={`progress-check ${isCurrent ? "current" : ""}`}
                                                >
                                                    <CheckIcon />
                                                </span>
                                            ) : (
                                                <span className="progress-circle" />
                                            )}
                                        </div>
                                        <div className="progress-details">
                                            <h2 className="progress-status">{status}</h2>
                                            <p className="progress-message">
                                                {statusMessages[status]}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="items-ordered-card">
                    <h2 className="ordered-title">Items Ordered</h2>
                    {items.map((item, index) => {
                        const addOnsTotal = (item.addons || []).reduce(
                            (sum, addOn) => sum + Number(addOn.unitPrice || 0),
                            0
                        );
                        const itemTotal =
                            (Number(item.unitPrice || 0) + addOnsTotal) *
                            Number(item.quantity || 1);

                        return (
                            <div
                                className="ordered-item"
                                key={item.id || index}
                            >
                                <img
                                    className="ordered-image"
                                    src={getImageUrl(item.image)}
                                    alt={item.name}
                                />
                                <div className="ordered-details">
                                    <h3 className="ordered-name">{item.name}</h3>
                                    <p className="quantity-temp">
                                        × {item.quantity || 1}
                                        {item.temperature &&
                                            ` · ${item.temperature}`}
                                    </p>
                                </div>
                                <div className="ordered-price">
                                    <span>{formatAmount(itemTotal)}</span>
                                </div>
                            </div>
                        );
                    })}
                    <div className="total-section">
                        <span className="total-font">Total</span>
                        <span className="total-price">{formatAmount(total)}</span>
                    </div>
                </div>

                <div className="delivery-address-card">
                    <div className="delivery-address-header">
                        <Address className="address-icon" />
                        <p className="address-title">
                            {isPickup ? "Pickup Store" : "Delivery Address"}
                        </p>
                    </div>
                    {isPickup ? (
                        <>
                            <p className="address-location">
                                {order.store?.name || "Kopi-Express"}
                            </p>
                            <p className="address-location">
                                {order.store?.address || ""}
                            </p>
                        </>
                    ) : (
                        <p className="address-location">
                            {order.address || "Address pending"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}