import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchOnlineOrderRequests,
} from "/src/owner-staff/api/mock-orders.js";

const OrdersContext = createContext(null);

export function OrdersProvider({ children }) {

  const [onlineRequests, setOnlineRequests] = useState([]);

  const [queueOrders, setQueueOrders] = useState([]);

  useEffect(() => {
    fetchOnlineOrderRequests().then(setOnlineRequests);
  }, []);

  const acceptOnlineOrder = (id) => {
    const order = onlineRequests.find((o) => o.id === id);
    if (!order) return;
    setQueueOrders((q) => [...q, { ...order, source: "online", status: "pending" }]);
    setOnlineRequests((prev) => prev.filter((o) => o.id !== id));
  };

  const declineOnlineOrder = (id) => {
    setOnlineRequests((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "declined" } : o))
    );
  };

  const updateQueueStatus = (id, status) => {
    setQueueOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const cancelQueueOrder = (id) => updateQueueStatus(id, "cancelled");

  const value = {
    onlineRequests,
    queueOrders,
    acceptOnlineOrder,
    declineOnlineOrder,
    updateQueueStatus,
    cancelQueueOrder,
  };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error("useOrders must be used inside an <OrdersProvider>");
  }
  return ctx;
}
