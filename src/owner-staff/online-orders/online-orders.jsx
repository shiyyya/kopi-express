import React from "react";
import "./online-orders.css";
import DefaultAvatar from "/src/assets/icons/avatar.svg?react";
import HotIcon from "/src/assets/icons/hot.svg?react";
import IcedIcon from "/src/assets/icons/iced.svg?react";

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
};

const FULFILLMENT_LABELS = {
  pickup: "Pick-Up",
  delivery: "Delivery",
};

function formatCurrency(amount, currencySymbol) {
  return `${currencySymbol}${amount.toFixed(2)}`;
}

function OnlineOrders({
  customerName = "",
  fulfillmentType,
  fulfillmentLabel,
  AvatarIcon = DefaultAvatar,
  status,
  statusLabel,
  items = [],
  total,
  currencySymbol = "₱",
  onAccept,
  onDecline,
  onSelect,
  selected = false,
  isProcessing = false,
}) {
  const computedTotal =
    total ?? items.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
  const resolvedStatusLabel = statusLabel ?? STATUS_LABELS[status] ?? status;
  const resolvedFulfillmentLabel =
    fulfillmentLabel ?? FULFILLMENT_LABELS[fulfillmentType] ?? fulfillmentType;

  return (
    <div
      className={`onlineOrderCard${selected ? " onlineOrderCardSelected" : ""}`}
      onClick={onSelect}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="onlineOrderHeader">
        <div className="onlineOrderAvatar">
          <AvatarIcon className="onlineOrderAvatarIcon" aria-hidden="true" />
        </div>
        <div className="onlineOrderCustomer">
          <p className="onlineOrderName">{customerName}</p>
          <p className="onlineOrderType" data-fulfillment={fulfillmentType}>
            {resolvedFulfillmentLabel}
          </p>
        </div>
        <div className="onlineOrderStatus" data-status={status}>
          <span className="onlineOrderStatusDot" />
          <span className="onlineOrderStatusLabel">{resolvedStatusLabel}</span>
        </div>
      </div>

      <div className="onlineOrderDivider" />

      <div className="onlineOrderItems">
        {items.length === 0 ? (
          <p className="onlineOrderEmpty">No items yet</p>
        ) : (
          items.map((item) => {
            const isDrink = item.category === "drink";
            return (
              <div className="onlineOrderItem" key={item.id}>
                <div className="onlineOrderItemMain">
                  <span className="onlineOrderItemName">
                    {isDrink && (
                      item.temperature === "hot" ? (
                        <HotIcon className="orderItemTempIcon orderItemTempHot" aria-label="Hot" />
                      ) : (
                        <IcedIcon className="orderItemTempIcon orderItemTempCold" aria-label="Cold" />
                      )
                    )}
                    {item.name}
                  </span>
                  <span className="onlineOrderItemPrice">
                    {formatCurrency(item.price * (item.quantity ?? 1), currencySymbol)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="onlineOrderDivider" />

      <div className="onlineOrderTotalRow">
        <span className="onlineOrderTotalLabel">Total</span>
        <span className="onlineOrderTotalValue">
          {formatCurrency(computedTotal, currencySymbol)}
        </span>
      </div>

      {status === "pending" ? (
        <div className="onlineOrderActions">
          <button
            className="onlineOrderDeclineButton"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDecline?.();
            }}
            disabled={isProcessing}
          >
            Decline
          </button>
          <button
            className="onlineOrderAcceptButton"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAccept?.();
            }}
            disabled={isProcessing}
          >
            Accept
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default OnlineOrders;