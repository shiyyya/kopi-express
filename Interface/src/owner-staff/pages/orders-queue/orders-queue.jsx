import { useState } from 'react';
import './orders-queue.css';
import Header from '/src/components/largeheader-wback/largeheader-wback.jsx';
import OrdersQueueCard from '/src/owner-staff/orders-queue-card/orders-queue-card.jsx';
import OrdersQueueDetailsPanel from '/src/owner-staff/orders-queue-details/orders-queue-details.jsx';
import { useOrders } from '/src/owner-staff/orders-context/orders-context.jsx';

function OrdersQueuePage() {
  const { queueOrders, updateQueueStatus, cancelQueueOrder } = useOrders();
  const [selectedId, setSelectedId] = useState(null);

  const selectedOrder = queueOrders.find((o) => o.id === selectedId) ?? null;

  return (
    <div className="ordersQueuePage">
      <Header />

      <div className="queueBody">
        {queueOrders.length === 0 ? (
          <p className="queueEmptyState">No orders in queue.</p>
        ) : (
          <div className="queueGrid">
            {queueOrders.map((order) => (
              <OrdersQueueCard
                key={order.id}
                orderNumber={order.orderNumber}
                customerName={order.customer}
                fulfillmentType={order.type}
                status={order.status}
                items={order.items}
                total={order.total}
                selected={selectedOrder?.id === order.id}
                onSelect={() => setSelectedId(order.id)}
                onCancel={() => cancelQueueOrder(order.id)}
                onStartPreparation={() => updateQueueStatus(order.id, 'preparing')}
                onMarkReady={() => updateQueueStatus(order.id, 'ready')}
                onComplete={() => updateQueueStatus(order.id, 'delivered')}
              />
            ))}
          </div>
        )}

        <OrdersQueueDetailsPanel
          order={selectedOrder}
          onCancel={() => selectedOrder && cancelQueueOrder(selectedOrder.id)}
          onStartPreparation={() => selectedOrder && updateQueueStatus(selectedOrder.id, 'preparing')}
          onMarkReady={() => selectedOrder && updateQueueStatus(selectedOrder.id, 'ready')}
          onComplete={() => selectedOrder && updateQueueStatus(selectedOrder.id, 'delivered')}
        />
      </div>
    </div>
  );
}

export default OrdersQueuePage;
