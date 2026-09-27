import './payment-confirmation.css';
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import CheckIcon from '/src/assets/icons/check-circle.svg?react';
import ClockIcon from '/src/assets/icons/time.svg?react';
import PinIcon from '/src/assets/icons/location.svg?react';
import CashIcon from '/src/assets/icons/time.svg?react';

function formatAmount(value) {
    const number = Number(value) || 0;
    return `₱${number.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PaymentConfirmed() {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        method,
        orderId,
        order,
        referenceNumber,
        amountPaid,
        receiptEmail,
        deliveryAddress,
        paymentNote = 'Pay cash upon delivery',
        confirmationSentTo,
        etaText = 'Ready in approximately 20-35 minutes',
    } = location.state || {};
    const isCash = method === 'cash';

    useEffect(() => {
        localStorage.removeItem("cartItems");
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const updatedOrder = {
            ...order,
            orderId,
            status: "Preparing",
            paymentStatus: isCash ? "Pending" : "Paid",
            referenceNumber: referenceNumber || null,
        };
        const updatedOrders = [
            ...savedOrders.filter((savedOrder) => savedOrder.orderId !== orderId),
            updatedOrder,
        ];
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
    }, []);

    return (
        <div className="paymentConfirmedPage">
            <div className="confirmedContainer">
                <div className="confirmedIconWrap">
                    <CheckIcon className="confirmedIcon" />
                </div>
                <h2 className="confirmedTitle">
                    {isCash ? 'Order Placed!' : 'Payment Confirmed!'}
                </h2>
                <p className="confirmedSubtext">
                    Order <strong>{orderId || 'Pending'}</strong>{' '}
                    {isCash ? 'has been sent to our team.' : 'is being prepared.'}
                </p>
                {!isCash && receiptEmail && (
                    <p className="confirmedSubtext">
                        A receipt was sent to {receiptEmail}
                    </p>
                )}
                {isCash ? (
                    <div className="confirmedInfoCard">
                        <div className="confirmedInfoRow confirmedInfoRowHeading">
                            <PinIcon className="confirmedInfoIcon" />
                            <span className="confirmedInfoLabel">Delivering to</span>
                        </div>
                        <p className="confirmedInfoAddress">{deliveryAddress}</p>
                        <hr className="confirmedInfoDivider" />
                        <div className="confirmedInfoRow">
                            <ClockIcon className="confirmedInfoIcon" />
                            <span>{etaText}</span>
                        </div>
                        <div className="confirmedInfoRow">
                            <CashIcon className="confirmedInfoIcon" />
                            <span>{paymentNote}</span>
                        </div>
                    </div>
                ) : (
                    <div className="receiptCard">
                        <p className="receiptLabel">Order ID</p>
                        <p className="receiptValue">{orderId || 'Pending'}</p>
                        {referenceNumber && (
                            <>
                                <p className="receiptLabel receiptLabelSpaced">Reference no.</p>
                                <p className="receiptValue">{referenceNumber}</p>
                            </>
                        )}
                        <p className="receiptLabel receiptLabelSpaced">Amount paid</p>
                        <p className="receiptAmount">{formatAmount(amountPaid)}</p>
                    </div>
                )}
                {isCash ? (
                    confirmationSentTo && (
                        <p className="confirmationSentText">
                            Confirmation sent to {confirmationSentTo}
                        </p>
                    )
                ) : (
                    <div className="etaBadge">
                        <ClockIcon className="etaIcon" />
                        <span>{etaText}</span>
                    </div>
                )}
                <button
                    type="button"
                    className="backToMenuBtn"
                    onClick={() => navigate("/")}
                >
                    Back to Menu
                </button>
            </div>
        </div>
    );
}