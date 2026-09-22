import "./orders-queue-details.css";
import DefaultAvatar from "/src/assets/icons/avatar.svg?react";
import HotIcon from "/src/assets/icons/hot.svg?react";
import IcedIcon from "/src/assets/icons/iced.svg?react";

const STATUS_LABELS = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_ACTIONS = {
  pending: {
    label: "Start Preparation",
    getHandler: (props) => props.onStartPreparation,
    className: "queueDetailsStartButton",
  },
  preparing: {
    label: "Mark as Ready",
    getHandler: (props) => props.onMarkReady,
    className: "queueDetailsReadyButton",
  },
  ready: {
    label: "Done",
    getHandler: (props) => props.onComplete,
    className: "queueDetailsDoneButton",
  },
};

function peso(amount) {
  return `₱${Number(amount ?? 0).toFixed(2)}`;
}

function OrdersQueueDetailsPanel({
  order,
  onCancel,
  onStartPreparation,
  onMarkReady,
  onComplete,
  isProcessing = false,
}) {
  if (!order) return null;

  const normalizedStatus = String(order.status ?? "").toLowerCase();
  const statusLabel = STATUS_LABELS[normalizedStatus] ?? order.status;
  const action = STATUS_ACTIONS[normalizedStatus];
  const showActions =
    action ||
    normalizedStatus === "pending" ||
    normalizedStatus === "preparing" ||
    normalizedStatus === "ready";

  const notesEntries = order.items
    .map((item) => {
      const isDrink = item.category === "drink";
      const text = isDrink
        ? item.addOns?.length
          ? item.addOns.map((a) => a.name).join(", ")
          : null
        : item.notes || null;
      return text ? { id: item.id, name: item.name, isDrink, text } : null;
    })
    .filter(Boolean);

  return (
    <aside className="orderPanel">
      <div className="orderTop">
        <div className="orderCustomer">
          <div className="orderAvatar" aria-hidden="true">
            <DefaultAvatar className="orderAvatarIcon" aria-hidden="true" />
          </div>
          <div>
            <p className="orderName">{order.customer}</p>
            <p className="orderType">
              {order.type === "delivery" ? "Delivery" : "Pick-Up"}
              {order.orderNumber ? ` #${order.orderNumber}` : ""}
            </p>
          </div>
        </div>
        <span className={`cleanStatus clean${normalizedStatus}`}>
          <span className="orderDot" />
          {statusLabel}
        </span>
      </div>

      <div className="orderDivider" />

      <div className="orderScrollArea">
        {order.type === "delivery" && order.address ? (
          <>
            <div className="orderSection">
              <p className="orderLabel">Delivery address</p>
              <p className="orderValue">{order.address}</p>
            </div>
            <div className="orderDivider" />
          </>
        ) : (
          (order.storeBranch || order.storeAddress) && (
            <>
              <div className="orderSection">
                <p className="orderLabel">Pickup information</p>
                {order.storeBranch && <p className="orderValue">{order.storeBranch}</p>}
                {order.storeAddress && <p className="orderSub">{order.storeAddress}</p>}
              </div>
              <div className="orderDivider" />
            </>
          )
        )}

        {order.paymentMethod && (
          <>
            <div className="orderSection">
              <p className="orderLabel">Payment method</p>
              <p className="orderValue">{order.paymentMethod}</p>
              <p className="orderSub">{order.paymentSub}</p>
              {order.paymentMethod === "GCash QR" && order.referenceNumber && (
                <p className="orderSub">Ref No: {order.referenceNumber}</p>
              )}
            </div>
            <div className="orderDivider" />
          </>
        )}

        <div className="orderSection">
          <p className="orderLabel">Order summary</p>
          {order.items.map((item) => {
            const isDrink = item.category === "drink";
            return (
              <div className="orderItem" key={item.id}>
                <div className="orderItemMain">
                  <span className="orderItemNameRow">
                    {isDrink && (
                      item.temperature === "hot" ? (
                        <HotIcon className="orderItemTempIcon orderItemTempHot" aria-label="Hot" />
                      ) : (
                        <IcedIcon className="orderItemTempIcon orderItemTempCold" aria-label="Cold" />
                      )
                    )}
                    <span>{item.name}{item.quantity ? ` x${item.quantity}` : ""}</span>
                  </span>
                  <span className="orderItemPrice">{peso(item.price * (item.quantity ?? 1))}</span>
                </div>
              </div>
            );
          })}

          {notesEntries.length > 0 && (
            <div className="orderNotesList">
              {notesEntries.map((entry) => (
                <p className="orderItemSubline" key={entry.id}>
                  {entry.name} — {entry.isDrink ? "Add-ons" : "Note"}: {entry.text}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="orderDivider" />

        <div className="orderTotals">
          {order.subtotal != null && (
            <div className="orderRow">
              <span>Subtotal</span>
              <span>{peso(order.subtotal)}</span>
            </div>
          )}
          {order.deliveryFee != null && (
            <div className="orderRow">
              <span>Delivery fee</span>
              <span>{peso(order.deliveryFee)}</span>
            </div>
          )}
          <div className="orderRow orderRowTotal">
            <span>Total</span>
            <span>{peso(order.total)}</span>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="orderActions">
          <button
            className="orderDeclineBtn"
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel Order
          </button>
          {action && (
            <button
              className={action.className}
              type="button"
              onClick={action.getHandler({ onStartPreparation, onMarkReady, onComplete })}
              disabled={isProcessing}
            >
              {action.label}
            </button>
          )}
        </div>
      )}
    </aside>
  );
}

export default OrdersQueueDetailsPanel;