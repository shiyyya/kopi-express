import './payment-confirmation.css';
import { useLocation, useNavigate } from "react-router";
import CheckIcon from '/src/assets/icons/check-circle.svg?react';
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
        branchName,
        referenceNumber,
        amountPaid,
        receiptEmail,
        deliveryAddress,
        isPickup = false,
        paymentNote = 'Pay cash upon delivery',
        confirmationSentTo,
    } = location.state || {};

    const isCash = method === 'cash';

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
                {branchName && (
                    <p className="confirmedSubtext">
                        Branch: <strong>{branchName}</strong>
                    </p>
                )}
                {!isCash && receiptEmail && (
                    <p className="confirmedSubtext">
                        A receipt was sent to {receiptEmail}
                    </p>
                )}
                {isCash ? (
                    <div className="confirmedInfoCard">
                        <div className="confirmedInfoRow confirmedInfoRowHeading">
                            <PinIcon className="confirmedInfoIcon" />
                            <span className="confirmedInfoLabel">
                                {isPickup ? 'Pick up at' : 'Delivering to'}
                            </span>
                        </div>
                        <p className="confirmedInfoAddress">{deliveryAddress}</p>
                        <hr className="confirmedInfoDivider" />
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
                {isCash && confirmationSentTo && (
                    <p className="confirmationSentText">
                        Confirmation sent to {confirmationSentTo}
                    </p>
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