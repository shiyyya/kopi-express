import { useState } from 'react';
import './online-orders.css';
import Header from '/src/components/largeheader-wback/largeheader-wback.jsx';
import OrderRequestCard from '/src/owner-staff/online-orders-card/online-orders-card.jsx';
import OrderDetailsPanel from '/src/owner-staff/order-details-panel/order-details-panel.jsx';
import { useOrders } from '/src/owner-staff/orders-context/orders-context.jsx';

function OnlineOrders() {
  const { onlineRequests, acceptOnlineOrder, declineOnlineOrder } = useOrders();
  const [selectedId, setSelectedId] = useState(null);

  const selectedOrder = onlineRequests.find((o) => o.id === selectedId) ?? null;

  return (
    <div className="onlineOrders">
      <Header title="Kopi Express / Staff" />

      <div className="ordersBody">
        {onlineRequests.length === 0 ? (
          <p className="emptyState">No orders yet.</p>
        ) : (
          <div className="ordersGrid">
            {onlineRequests.map((order) => (
              <OrderRequestCard
                key={order.id}
                customerName={order.customer}
                fulfillmentType={order.type}
                status={order.status}
                items={order.items}
                total={order.total}
                selected={selectedOrder?.id === order.id}
                onSelect={() => setSelectedId(order.id)}
                onAccept={() => acceptOnlineOrder(order.id)}
                onDecline={() => declineOnlineOrder(order.id)}
              />
            ))}
          </div>
        )}

        <OrderDetailsPanel
          order={selectedOrder}
          onAccept={() => selectedOrder && acceptOnlineOrder(selectedOrder.id)}
          onDecline={() => selectedOrder && declineOnlineOrder(selectedOrder.id)}
        />
      </div>
    </div>
  );
}

export default OnlineOrders;
