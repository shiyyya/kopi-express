import React from "react";
import "./orders-queue.css";
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

const FULFILLMENT_LABELS = {
  pickup: "Pick-Up",
  delivery: "Delivery",
};

const STATUS_ACTIONS = {
  pending: {
    label: "Start Preparation",
    getHandler: (props) => props.onStartPreparation,
    className: "ordersQueueStartButton",
  },
  preparing: {
    label: "Mark as Ready",
    getHandler: (props) => props.onMarkReady,
    className: "ordersQueueReadyButton",
  },
  ready: {
    label: "Done",
    getHandler: (props) => props.onComplete,
    className: "ordersQueueDoneButton",
  },
};

function formatCurrency(amount, currencySymbol) {
  return `${currencySymbol}${amount.toFixed(2)}`;
}

function OrdersQueue(props) {
  const {
    customerName = "",
    orderNumber,
    fulfillmentType,
    fulfillmentLabel,
    AvatarIcon = DefaultAvatar,
    status,
    statusLabel,
    items = [],
    total,
    currencySymbol = "₱",
    onCancel,
    onSelect,
    selected = false,
    isProcessing = false,
  } = props;

  const normalizedStatus = String(status ?? "").toLowerCase();
  const normalizedFulfillment = String(fulfillmentType ?? "").toLowerCase();

  const computedTotal =
    total ?? items.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
  const resolvedStatusLabel = statusLabel ?? STATUS_LABELS[normalizedStatus] ?? status;
  const resolvedFulfillmentLabel =
    fulfillmentLabel ?? FULFILLMENT_LABELS[normalizedFulfillment] ?? fulfillmentType;
  const action = STATUS_ACTIONS[normalizedStatus];

  return (
    <div
      className={`ordersQueueCard${selected ? " ordersQueueCardSelected" : ""}`}
      data-status={normalizedStatus}
      onClick={onSelect}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="ordersQueueBody">
        <div className="ordersQueueHeader">
          <div className="ordersQueueAvatar">
            <AvatarIcon className="ordersQueueAvatarIcon" aria-hidden="true" />
          </div>
          <div className="ordersQueueCustomer">
            <p className="ordersQueueName">{customerName}</p>
            <p className="ordersQueueMeta">
              <span className="ordersQueueType" data-fulfillment={normalizedFulfillment}>
                {resolvedFulfillmentLabel}
              </span>
              {orderNumber ? (
                <span className="ordersQueueNumber">#{orderNumber}</span>
              ) : null}
            </p>
          </div>
          <div className="ordersQueueStatus" data-status={normalizedStatus}>
            <span className="ordersQueueStatusDot" />
            <span className="ordersQueueStatusLabel">{resolvedStatusLabel}</span>
          </div>
        </div>

        <div className="ordersQueueDivider" />

        <div className="ordersQueueItems">
          {items.length === 0 ? (
            <p className="ordersQueueEmpty">No items yet</p>
          ) : (
            items.map((item) => {
              const isDrink = item.category === "drink";
              return (
                <div className="ordersQueueItem" key={item.id}>
                  <div className="ordersQueueItemMain">
                    <span className="ordersQueueItemName">
                      {isDrink && (
                        item.temperature === "hot" ? (
                          <HotIcon className="orderItemTempIcon orderItemTempHot" aria-label="Hot" />
                        ) : (
                          <IcedIcon className="orderItemTempIcon orderItemTempCold" aria-label="Cold" />
                        )
                      )}
                      {item.name}
                    </span>
                    <span className="ordersQueueItemPrice">
                      {formatCurrency(item.price * (item.quantity ?? 1), currencySymbol)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="ordersQueueDivider" />

        <div className="ordersQueueTotalRow">
          <span className="ordersQueueTotalLabel">Total</span>
          <span className="ordersQueueTotalValue">
            {formatCurrency(computedTotal, currencySymbol)}
          </span>
        </div>
      </div>

      {action ? (
        <div className="ordersQueueActions">
          <button
            className="ordersQueueCancelButton"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.();
            }}
            disabled={isProcessing}
          >
            Cancel Order
          </button>
          <button
            className={action.className}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              action.getHandler(props)?.();
            }}
            disabled={isProcessing}
          >
            {action.label}
          </button>
        </div>
      ) : null}
    </div>
  );
}
export default OrdersQueue;