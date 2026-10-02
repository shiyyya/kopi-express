import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { apiFetch } from "/src/api/client.js";

const OrdersContext = createContext(null);

function getStoreBranchId() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    return currentUser?.storeBranchId || null;
}

function mapItems(items = []) {
    return items.map((item, index) => ({
        ...item,
        id: item.id ?? index,
        category: item.productCategory ?? item.category,
        temperature: item.productTemp ?? item.temperature,
        price: Number(item.unitPrice ?? item.price ?? 0),
        addOns: (item.addons ?? item.addOns ?? []).map((addOn) => ({
            ...addOn,
            price: Number(addOn.unitPrice ?? addOn.price ?? 0),
        })),
    }));
}

function mapOrder(order) {
    return {
        id: order.id,
        customer: order.customerName,
        orderNumber: order.id,
        type: order.fulfillmentType === "self_pick_up" ? "pickup" : "delivery",
        status: order.status,
        items: mapItems(order.items),
        total: Number(order.total || 0),
    };
}

function mapOrderDetails(order) {
    return {
        ...mapOrder(order),
        address: order.address,
        paymentMethod: order.paymentMethod,
        referenceNumber: order.paymentReference,
        notes: order.notes,
        subtotal: Number(order.subtotal || 0),
        deliveryFee: Number(order.deliveryFee || 0),
        items: mapItems(order.items),
    };
}

export function OrdersProvider({ children }) {
    const [onlineRequests, setOnlineRequests] = useState([]);
    const [queueOrders, setQueueOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = useCallback(async ({ silent = false } = {}) => {
        const storeBranchId = getStoreBranchId();

        if (!storeBranchId) {
            setOnlineRequests([]);
            setLoading(false);
            return;
        }

        try {
            if (!silent) setLoading(true);
            const response = await apiFetch(
                `/orders?storeBranchId=${encodeURIComponent(storeBranchId)}&orderView=pending`
            );
            const orders = response.data.orders || [];
            setOnlineRequests(orders.map(mapOrder));
        } catch (error) {
            console.error("Failed to fetch online orders:", error);
            if (!silent) setOnlineRequests([]);
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    const fetchQueueOrders = useCallback(async () => {
        const storeBranchId = getStoreBranchId();

        if (!storeBranchId) {
            setQueueOrders([]);
            return;
        }

        try {
            const response = await apiFetch(
                `/orders?storeBranchId=${encodeURIComponent(storeBranchId)}&orderView=in_queue`
            );
            const orders = response.data.orders || [];
            setQueueOrders(
                orders
                    .filter((order) => ["queued", "preparing", "ready"].includes(order.status))
                    .map(mapOrder)
            );
        } catch (error) {
            console.error("Failed to fetch queue orders:", error);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
        fetchQueueOrders();
    }, [fetchOrders, fetchQueueOrders]);

    const fetchOrderDetails = async (id) => {
        try {
            const response = await apiFetch(`/orders/${id}`);
            const order = mapOrderDetails(response.data.order);
            setSelectedOrder(order);
            return order;
        } catch (error) {
            console.error("Failed to fetch order details:", error);
            setSelectedOrder(null);
            return null;
        }
    };

    const acceptOnlineOrder = async (id) => {
        try {
            await apiFetch(`/orders/${id}/advance`, {
                method: "PATCH",
            });
            setSelectedOrder(null);
            await fetchOrders();
            await fetchQueueOrders();
        } catch (error) {
            console.error("Failed to accept order:", error);
        }
    };

    const declineOnlineOrder = async (id) => {
        try {
            await apiFetch(`/orders/${id}/decline-cancel`, {
                method: "PATCH",
            });
            setSelectedOrder(null);
            await fetchOrders();
        } catch (error) {
            console.error("Failed to decline order:", error);
        }
    };

    const updateQueueStatus = async (id, status) => {
        try {
            await apiFetch(`/orders/${id}/advance`, {
                method: "PATCH",
            });
            await fetchQueueOrders();
        } catch (error) {
            console.error(`Failed to update order to ${status}:`, error);
        }
    };

    const cancelQueueOrder = async (id) => {
        try {
            await apiFetch(`/orders/${id}/decline-cancel`, {
                method: "PATCH",
            });
            await fetchQueueOrders();
        } catch (error) {
            console.error("Failed to cancel queue order:", error);
        }
    };

    const value = {
        onlineRequests,
        queueOrders,
        selectedOrder,
        loading,
        acceptOnlineOrder,
        declineOnlineOrder,
        updateQueueStatus,
        cancelQueueOrder,
        fetchOrders,
        fetchQueueOrders,
        fetchOrderDetails,
    };

    return (
        <OrdersContext.Provider value={value}>
            {children}
        </OrdersContext.Provider>
    );
}

export function useOrders() {
    const ctx = useContext(OrdersContext);

    if (!ctx) {
        throw new Error("useOrders must be used inside an <OrdersProvider>");
    }

    return ctx;
}