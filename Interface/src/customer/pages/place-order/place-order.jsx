import "./place-order.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Header from "/src/components/blocks/header-wback/header-wback.jsx";
import Button from "/src/components/elements/button/button.jsx";
import OrderSummary from "/src/components/blocks/order-summary/order-summary.jsx";
import ContactIcon from "/src/assets/icons/contact.svg?react";
import CheckIcon from "/src/assets/icons/check.svg?react";
import CashIcon from "/src/assets/icons/cash.svg?react";
import QrIcon from "/src/assets/icons/qr.svg?react";
import { createOrder } from "/src/api/orders.api.js";

const DELIVERY_FEE = 50;

function PlaceOrder() {
    const navigate = useNavigate();
    const location = useLocation();
    const orderItems = location.state?.items || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

    const orderType = location.state?.orderType || "Pickup";
    const store = location.state?.store || null;
    const phone = currentUser?.phoneNumber || "";
    const deliveryFee = orderType === "Delivery" ? DELIVERY_FEE : 0;

    const [paymentMethod, setPaymentMethod] = useState(
        location.state?.paymentMethod || ""
    );
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handlePlaceOrder = async () => {
        if (submitting) return;

        const isDelivery = orderType === "Delivery";
        const isGcash = paymentMethod === "QR Payment";

        if (orderItems.length === 0) return setError("Your cart is empty.");
        if (!isDelivery && !store) return setError("Please select a pickup store.");
        if (!paymentMethod) return setError("Please select a payment method.");
        setError("");

        const subtotal = orderItems.reduce((total, item) => {
            const productPrice = Number(item.product?.price || 0);
            const addOnsTotal = (item.addOns || []).reduce(
                (sum, addOn) => sum + Number(addOn.price || 0),
                0
            );
            return total + (productPrice + addOnsTotal) * Number(item.quantity || 1);
        }, 0);
        const total = subtotal + deliveryFee;
        const trimmedNotes = notes.trim();

        const payload = {
            fulfillmentType: isDelivery ? "delivery" : "self_pick_up",
            paymentMethod: isGcash ? "gcash" : "cash",
            ...(!isDelivery && { storeBranchId: store.id }),
            ...(trimmedNotes && { notes: trimmedNotes }),
        };

        if (isGcash) {
            navigate("/qr-payment", {
                state: {
                    amount: total,
                    orderPayload: payload,
                    isPickup: !isDelivery,
                    store: isDelivery ? null : store,
                },
            });
            return;
        }

        try {
            setSubmitting(true);
            const result = await createOrder(payload);
            navigate("/payment-confirmed", {
                replace: true,
                state: {
                    method: "cash",
                    orderId: result.orderId,
                    branchName: result.branchName,
                    deliveryAddress: result.address,
                    isPickup: !isDelivery,
                    amountPaid: total,
                    paymentNote: isDelivery ? "Pay cash upon delivery" : "Pay cash upon pickup",
                },
            });
        } catch (err) {
            setError(err.message || "Failed to place order. Please try again.");
            setSubmitting(false);
        }
    };

    return (
        <div className="PlaceOrderPage">
            <Header title="Place Order" />
            <main className="PlaceOrderContent">
                {orderType === "Delivery" ? (
                    <section className="DeliverySection">
                        <div className="PhoneInformation">
                            <ContactIcon />
                            <div>
                                <strong>{phone || "No phone number"}</strong>
                            </div>
                        </div>
                        <div className="DeliveryDivider"></div>
                        <p className="DeliveryNote">
                            We'll deliver to your saved address from the nearest branch.
                        </p>
                    </section>
                ) : (
                    <section className="PickupSection">
                        <div className="PickupStoreHeader">
                            <h3>Pickup Store</h3>
                        </div>
                        <div className="PickupStoreOption">
                            <div className="PickupStoreDetails">
                                <strong>{store?.name || "No store selected"}</strong>
                                <span>{store?.address || "No store address available"}</span>
                            </div>
                            <span className="PickupStoreCheck">
                                <CheckIcon />
                            </span>
                        </div>
                    </section>
                )}
                <OrderSummary
                    items={orderItems}
                    deliveryFee={deliveryFee}
                    orderType={orderType}
                />
                <section className="NotesSection">
                    <textarea
                        className="NotesInput"
                        name="notes"
                        placeholder="Add a note for your order (optional)"
                        maxLength={255}
                        rows={2}
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                    />
                    <small className="NotesCount">{notes.length}/255</small>
                </section>
                <section className="PaymentSection">
                    <h2>Payment Method</h2>
                    <Button
                        type="button"
                        className={paymentMethod === "Cash on Delivery" ? "PaymentOption selected" : "PaymentOption"}
                        onClick={() => setPaymentMethod("Cash on Delivery")}
                    >
                        <span className="PaymentIcon"><CashIcon /></span>
                        <span className="PaymentDetails">
                            <strong>Cash Payment</strong>
                            <small>Pay when you receive your order</small>
                        </span>
                        <span className={paymentMethod === "Cash on Delivery" ? "PaymentCheck" : "PaymentRadio"}>
                            {paymentMethod === "Cash on Delivery" && <CheckIcon />}
                        </span>
                    </Button>
                    <Button
                        type="button"
                        className={paymentMethod === "QR Payment" ? "PaymentOption selected" : "PaymentOption"}
                        onClick={() => setPaymentMethod("QR Payment")}
                    >
                        <span className="PaymentIcon"><QrIcon /></span>
                        <span className="PaymentDetails">
                            <strong>Gcash Payment</strong>
                            <small>Pay securely using GCash</small>
                        </span>
                        <span className={paymentMethod === "QR Payment" ? "PaymentCheck" : "PaymentRadio"}>
                            {paymentMethod === "QR Payment" && <CheckIcon />}
                        </span>
                    </Button>
                </section>
                <section className="OrderInformation">
                    <p>Order will be processed after confirmation.</p>
                    {error && <p role="alert" className="OrderError">{error}</p>}
                </section>
            </main>
            <div className="PlaceOrderFooter">
                <Button
                    type="button"
                    className="ConfirmOrderButton"
                    disabled={submitting}
                    onClick={handlePlaceOrder}
                >
                    {submitting ? "Placing order..." : "Place Order"}
                </Button>
            </div>
        </div>
    );
}

export default PlaceOrder;