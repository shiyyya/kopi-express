import { useEffect, useState } from "react";
import "./order-status.css";
import Header from "/src/components/blocks/header-wback/header-wback.jsx";
import CheckIcon from "/src/assets/icons/check.svg?react";
import OrderedItem from "/src/assets/images/cafe.png";
import Address from "/src/assets/icons/location.svg?react";
import Time from "/src/assets/icons/time.svg?react";

const deliveryStatuses = [
    "Order Received",
    "Preparing",
    "Done Preparing",
    "Completed",
];

const pickupStatuses = [
    "Order Received",
    "Preparing",
    "Done Preparing",
    "Completed",
];

const statusMessages = {
    "Order Received": "We got your order!",
    "Preparing": "Our team is brewing and cooking.",
    "Done Preparing": "Your order is ready for pickup/delivery!",
    "Delivered": "Enjoy your order!",
};

function formatAmount(value) {
    const number = Number(value) || 0;
    return `₱${number.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function getStatusIndex(status, statuses) {
    const index = statuses.indexOf(status);
    return index === -1 ? 0 : index;
}

export default function OrderStatus() {
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        setOrder(savedOrders[savedOrders.length - 1] || null);
    }, []);

    if (!order) {
        return (
            <div className="order-status-page">
                <Header title="Order Status" />
                <div className="order-status-content">
                    <div className="order-info-card">
                        <p>No active order found.</p>
                    </div>
                </div>
            </div>
        );
    }

    const isPickup = order.orderType === "Pickup";
    const statuses = isPickup ? pickupStatuses : deliveryStatuses;
    const currentStatusIndex = getStatusIndex(order.status, statuses);
    const items = order.items || [];
    const total = Number(order.total || 0);
    const orderDate = order.createdAt
        ? new Date(order.createdAt).toLocaleString("en-PH", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        })
        : "";

    return (
        <div className="order-status-page">
            <Header title="Order Status" />
            <div className="order-status-content">
                <div className="order-info-card">
                    <div className="order-info-details">
                        <h2 className="order-number">
                            {order.orderId || "Pending"}
                        </h2>
                        <div className="status-badge">
                            <span className="order-status">
                                {order.status}
                            </span>
                        </div>
                    </div>
                    <p className="order-date">{orderDate}</p>
                </div>

                <div className="order-progress-card">
                    <h2 className="progress-title">Order Progress</h2>
                    <div className="progress-list">
                        {statuses.map((status, index) => {
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
                                            <span className={`progress-check ${isCurrent ? "current" : ""}`}>
                                                <CheckIcon />
                                            </span>
                                        ) : (
                                            <span className="progress-circle"></span>
                                        )}
                                    </div>

                                    <div className="progress-details">
                                        <h2 className="progress-status">
                                            {status}
                                        </h2>
                                        <p className="progress-message">
                                            {statusMessages[status]}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="items-ordered-card">
                    <h2 className="ordered-title">Items Ordered</h2>
                    {items.map((item, index) => {
                        const product = item.product;
                        if (!product) return null;

                        const addOnsTotal = (item.addOns || []).reduce(
                            (sum, addOn) => sum + Number(addOn.price || 0),
                            0
                        );

                        const itemTotal =
                            (Number(product.price || 0) + addOnsTotal) *
                            Number(item.quantity || 1);

                        return (
                            <div className="ordered-item" key={item.id || index}>
                                <img
                                    className="ordered-image"
                                    src={product.image || OrderedItem}
                                    alt={product.name}
                                />
                                <div className="ordered-details">
                                    <h3 className="ordered-name">
                                        {product.name}
                                    </h3>
                                    <p className="quantity-temp">
                                        × {item.quantity || 1}
                                        {item.temperature && ` · ${item.temperature}`}
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
                        <span className="total-price">
                            {formatAmount(total)}
                        </span>
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

                    <div className="address-time-row">
                        <Time className="time-icon" />
                        <p className="arrival-time">
                            {isPickup
                                ? "Ready when your order is completed"
                                : order.status === "Out for Delivery"
                                    ? "Your order is on the way"
                                    : "Estimated: 20–35 minutes"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}