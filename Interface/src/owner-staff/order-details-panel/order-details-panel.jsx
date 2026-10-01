import "./order-details-panel.css";

import DefaultAvatar from "/src/assets/icons/avatar.svg?react";
import HotIcon from "/src/assets/icons/hot.svg?react";
import IcedIcon from "/src/assets/icons/iced.svg?react";

function peso(amount) {
  return `₱${Number(amount ?? 0).toFixed(2)}`;
}

function OrderDetailsPanel({ order, onAccept, onDecline, isProcessing = false }) {
  if (!order) return null;

  const normalizedStatus = String(order.status ?? "").toLowerCase();
  const normalizedType = String(order.type ?? "").toLowerCase();

  const statusLabel =
    normalizedStatus === "accepted"
      ? "Accepted"
      : normalizedStatus === "declined"
        ? "Declined"
        : "Pending";

  const notesEntries = order.items
    .map((item) => {
      const category = item.category ?? item.productCategory;
      const isDrink = category === "drink";
      const addOns = item.addOns ?? item.addons ?? [];
      const text = isDrink
        ? addOns.length
          ? addOns.map((a) => a.name).join(", ")
          : null
        : item.notes || null;
      return text ? { id: item.id, name: item.name, isDrink, text } : null;
    })
    .filter(Boolean);

  return (
    <aside className="orderPanel" data-status={normalizedStatus}>
      <div className="orderBody">
        <div className="orderTop">
          <div className="orderCustomer">
            <div className="orderAvatar" aria-hidden="true">
              <DefaultAvatar className="orderAvatarIcon" aria-hidden="true" />
            </div>
            <div>
              <p className="orderName">{order.customer}</p>
              <p className="orderType">
                {normalizedType === "delivery" ? "Delivery" : "Pick-Up"}
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
          {normalizedType === "delivery" && order.address ? (
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
                {order.paymentSub && <p className="orderSub">{order.paymentSub}</p>}
                {order.referenceNumber && (
                  <p className="orderSub">Ref No: {order.referenceNumber}</p>
                )}
              </div>
              <div className="orderDivider" />
            </>
          )}
          <div className="orderSection">
            <p className="orderLabel">Order summary</p>
            {order.items.map((item) => {
              const category = item.category ?? item.productCategory;
              const temperature = item.temperature ?? item.productTemp;
              const isDrink = category === "drink";
              const price = item.price ?? item.unitPrice;

              return (
                <div className="orderItem" key={item.id}>
                  <div className="orderItemMain">
                    <span className="orderItemNameRow">
                      {isDrink &&
                        (temperature === "hot" ? (
                          <HotIcon className="orderItemTempIcon orderItemTempHot" aria-label="Hot" />
                        ) : (
                          <IcedIcon className="orderItemTempIcon orderItemTempCold" aria-label="Cold" />
                        ))}
                      <span>
                        {item.name}
                        {item.quantity ? ` x${item.quantity}` : ""}
                      </span>
                    </span>
                    <span className="orderItemPrice">
                      {peso(price * (item.quantity ?? 1))}
                    </span>
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
            {order.notes && (
              <div className="orderNotesList">
                <p className="orderItemSubline">Order note: {order.notes}</p>
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
      </div>
      {normalizedStatus === "pending" && (
        <div className="orderActions">
          <button
            className="orderDeclineBtn"
            type="button"
            onClick={onDecline}
            disabled={isProcessing}
          >
            Decline
          </button>
          <button
            className="orderAcceptBtn"
            type="button"
            onClick={onAccept}
            disabled={isProcessing}
          >
            Accept
          </button>
        </div>
      )}
    </aside>
  );
}

export default OrderDetailsPanel;