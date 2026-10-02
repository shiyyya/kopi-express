import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./qr-payment.css";
import Header from "/src/components/blocks/header-wback/header-wback.jsx";
import Input from "/src/components/elements/input/input.jsx";
import Button from "/src/components/elements/button/button.jsx";
import qrImage from "/src/assets/images/qr.png";
import { createOrder } from "/src/api/orders.api.js";

function formatAmount(value) {
    const number = Number(value) || 0;
    return `₱${number.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const REFERENCE_LENGTH = 13;

export default function QrPayment() {
    const navigate = useNavigate();
    const location = useLocation();
    const amount = location.state?.amount;
    const orderPayload = location.state?.orderPayload;
    const store = location.state?.store;
    const isPickup = location.state?.isPickup;
    const [referenceNumber, setReferenceNumber] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const canConfirm = referenceNumber.length === REFERENCE_LENGTH;
    const branchName = store?.name || "Kopi-Express";

    const handleReferenceChange = (e) => {
        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, REFERENCE_LENGTH);
        setReferenceNumber(digitsOnly);
    };

    const handleConfirm = async () => {
        if (!canConfirm || submitting) return;
        if (!orderPayload) {
            setError("Order details are missing. Please go back and try again.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            const result = await createOrder({
                ...orderPayload,
                paymentReference: referenceNumber,
            });
            navigate("/payment-confirmed", {
                replace: true,
                state: {
                    method: "qr",
                    orderId: result.orderId,
                    orderNo: result.orderNo, // CHANGED
                    branchName: result.branchName,
                    referenceNumber,
                    amountPaid: amount,
                    deliveryAddress: result.address,
                    isPickup,
                },
            });
        } catch (err) {
            setError(err.message || "Failed to place order. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <div className="qrPaymentPage">
            <Header title="GCash Payment" />
            <div className="qrPaymentContainer">
                <div className="qrCard">
                    <div className="qrCardHeader">
                        <p className="qrCardHeaderLabel">{branchName}</p>
                        <p className="qrCardHeaderOrder">Awaiting payment</p>
                    </div>
                    <div className="qrCardBody">
                        <p className="qrInstruction">
                            Scan the QR code using your GCash app to pay
                        </p>
                        <div className="qrImageWrap">
                            <img
                                className="qrImage"
                                src={qrImage}
                                alt="GCash QR payment code"
                            />
                        </div>
                        <p className="amountLabel">Amount to pay</p>
                        <p className="amountValue">{formatAmount(amount)}</p>
                        <div className="payToRow">
                            <p className="payToLabel">Pay to · Kopi Express Pandi</p>
                            <p className="payToNumber">09171234567</p>
                        </div>
                        <hr className="divider" />
                        <label className="refLabel" htmlFor="qrReference">
                            Enter GCash Reference Number
                        </label>
                        <Input
                            id="qrReference"
                            name="qrReference"
                            type="text"
                            inputMode="numeric"
                            maxLength={REFERENCE_LENGTH}
                            value={referenceNumber}
                            onChange={handleReferenceChange}
                            placeholder="e.g. 1234567890123"
                            className="refInput"
                        />
                        <Button
                            className="confirmButton"
                            disabled={!canConfirm || submitting}
                            onClick={handleConfirm}
                        >
                            {submitting ? "Placing order..." : "Confirm Payment"}
                        </Button>
                        {error && (
                            <p role="alert" style={{ color: "#b3261e" }}>
                                {error}
                            </p>
                        )}
                        <p className="refHint">
                            Find your reference number in your GCash transaction history.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}