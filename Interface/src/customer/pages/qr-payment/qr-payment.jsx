import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./qr-payment.css";
import Header from "/src/components/blocks/header-wback/header-wback.jsx";
import Input from "/src/components/elements/input/input.jsx";
import Button from "/src/components/elements/button/button.jsx";
import qrImage from "/src/assets/images/qr.png";

function formatAmount(value) {
    const number = Number(value) || 0;
    return `₱${number.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const REFERENCE_LENGTH = 13;

export default function QrPayment() {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;
    const amount = location.state?.amount;
    const order = location.state?.order;
    const [referenceNumber, setReferenceNumber] = useState("");
    const canConfirm = referenceNumber.length === REFERENCE_LENGTH;
    const branchName = order?.store?.name || order?.storeName || "Kopi-Express";
    const handleReferenceChange = (e) => {
        const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, REFERENCE_LENGTH);
        setReferenceNumber(digitsOnly);
    };
    const handleConfirm = () => {
        if (!canConfirm) return;
        navigate("/payment-confirmed", {
            state: {
                method: "qr",
                orderId,
                order,
                referenceNumber,
                amountPaid: amount,
                deliveryAddress: order?.address || "",
            },
        });
    };
    return (
        <div className="qrPaymentPage">
            <Header title="GCash Payment" />
            <div className="qrPaymentContainer">
                <div className="qrCard">
                    <div className="qrCardHeader">
                        <p className="qrCardHeaderLabel">{branchName}</p>
                        <p className="qrCardHeaderOrder">
                            {orderId || "Order ID pending"}
                        </p>
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
                            disabled={!canConfirm}
                            onClick={handleConfirm}
                        >
                            Confirm Payment
                        </Button>
                        <p className="refHint">
                            Find your reference number in your GCash transaction history.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}