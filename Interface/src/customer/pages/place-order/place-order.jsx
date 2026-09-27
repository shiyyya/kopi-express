import "./place-order.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Header from "/src/components/blocks/header-wback/header-wback.jsx";
import Button from "/src/components/elements/button/button.jsx";
import DeliveryAddress from "/src/components/blocks/delivery-address/delivery-address.jsx";
import OrderSummary from "/src/components/blocks/order-summary/order-summary.jsx";
import ContactIcon from "/src/assets/icons/contact.svg?react";
import CheckIcon from "/src/assets/icons/check.svg?react";
import CashIcon from "/src/assets/icons/cash.svg?react";
import QrIcon from "/src/assets/icons/qr.svg?react";

function PlaceOrder() {
    const navigate = useNavigate();
    const location = useLocation();
    const orderItems = location.state?.items || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const [savedAddresses, setSavedAddresses] = useState(currentUser?.addresses || []);
    const [address, setAddress] = useState(
        location.state?.address ||
        currentUser?.addresses?.[0] ||
        ""
    );
    const [paymentMethod, setPaymentMethod] = useState(
        location.state?.paymentMethod || ""
    );
    const orderType = location.state?.orderType || "Pickup";
    const store = location.state?.store || null;
    const phone = currentUser?.phone || location.state?.phone || "";
    const deliveryFee = orderType === "Delivery"
        ? Number(location.state?.deliveryFee || 0)
        : 0;
    const handleAddressSelect = (selectedAddress) => {
        setAddress(selectedAddress);
    };
    const handleAddNewAddress = (newAddress) => {
        const value = newAddress.trim();
        if (!value) return;
        setAddress(value);
        setSavedAddresses((previousAddresses) => {
            if (previousAddresses.includes(value)) {
                return previousAddresses;
            }
            return [...previousAddresses, value];
        });
        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                addresses: [
                    ...(currentUser.addresses || []).filter(
                        (savedAddress) => savedAddress !== value
                    ),
                    value,
                ],
            };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        }
    };
    const handlePlaceOrder = () => {
        if (orderType === "Delivery" && !address.trim()) {
            return;
        }
        if (orderType === "Pickup" && !store) {
            return;
        }
        if (!paymentMethod) {
            return;
        }
        const subtotal = orderItems.reduce((total, item) => {
            const productPrice = Number(item.product?.price || 0);
            const addOnsTotal = (item.addOns || []).reduce(
                (addOnTotal, addOn) =>
                    addOnTotal + Number(addOn.price || 0),
                0
            );
            return total + (productPrice + addOnsTotal) * Number(item.quantity || 1);
        }, 0);
        const actualDeliveryFee = orderType === "Delivery"
            ? deliveryFee
            : 0;
        const total = subtotal + actualDeliveryFee;
        const order = {
            items: orderItems,
            orderType,
            address: orderType === "Delivery"
                ? address
                : store?.address || "",
            store: orderType === "Pickup"
                ? store
                : null,
            phone,
            paymentMethod,
            subtotal,
            deliveryFee: actualDeliveryFee,
            total,
            createdAt: new Date().toISOString(),
        };
        if (paymentMethod === "QR Payment") {
            navigate("/qr-payment", {
                state: {
                    orderId: "KE-1221",
                    amount: total,
                    order,
                },
            });
            return;
        }
        navigate("/payment-confirmed", {
            state: {
                method: "cash",
                orderId: "KE-1221",
                order,
                deliveryAddress: order.address,
                amountPaid: total,
            },
        });
    };
    return (
        <div className="PlaceOrderPage">
            <Header title="Place Order" />
            <main className="PlaceOrderContent">
                {orderType === "Delivery" ? (
                    <section className="DeliverySection">
                        <DeliveryAddress
                            addresses={savedAddresses}
                            selectedAddress={address}
                            onSelect={handleAddressSelect}
                            onAdd={handleAddNewAddress}
                        />
                        <div className="DeliveryDivider"></div>
                        <div className="PhoneInformation">
                            <ContactIcon />
                            <div>
                                <strong>
                                    {phone || "No phone number"}
                                </strong>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="PickupSection">
                        <div className="PickupStoreHeader">
                            <h3>Pickup Store</h3>
                        </div>
                        <div className="PickupStoreOption">
                            <div className="PickupStoreDetails">
                                <strong>
                                    {store?.name || "No store selected"}
                                </strong>
                                <span>
                                    {store?.address || "No store address available"}
                                </span>
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
                <section className="PaymentSection">
                    <h2>Payment Method</h2>
                    <Button
                        type="button"
                        className={
                            paymentMethod === "Cash on Delivery"
                                ? "PaymentOption selected"
                                : "PaymentOption"
                        }
                        onClick={() =>
                            setPaymentMethod("Cash on Delivery")
                        }
                    >
                        <span className="PaymentIcon">
                            <CashIcon />
                        </span>
                        <span className="PaymentDetails">
                            <strong>
                                Cash Payment
                            </strong>
                            <small>
                                Pay when you receive your order
                            </small>
                        </span>
                        <span
                            className={
                                paymentMethod === "Cash on Delivery"
                                    ? "PaymentCheck"
                                    : "PaymentRadio"
                            }
                        >
                            {paymentMethod === "Cash on Delivery" && <CheckIcon />}
                        </span>
                    </Button>
                    <Button
                        type="button"
                        className={
                            paymentMethod === "QR Payment"
                                ? "PaymentOption selected"
                                : "PaymentOption"
                        }
                        onClick={() => setPaymentMethod("QR Payment")}
                    >
                        <span className="PaymentIcon">
                            <QrIcon />
                        </span>
                        <span className="PaymentDetails">
                            <strong>Gcash Payment</strong>
                            <small>
                                Pay securely using GCash
                            </small>
                        </span>
                        <span
                            className={
                                paymentMethod === "QR Payment"
                                    ? "PaymentCheck"
                                    : "PaymentRadio"
                            }
                        >
                            {paymentMethod === "QR Payment" && <CheckIcon />}
                        </span>
                    </Button>
                </section>
                <section className="OrderInformation">
                    <p>
                        Order will be processed after confirmation.
                    </p>
                </section>
            </main>
            <div className="PlaceOrderFooter">
                <Button
                    type="button"
                    className="ConfirmOrderButton"
                    onClick={handlePlaceOrder}
                >
                    Place Order
                </Button>
            </div>
        </div>
    );
}

export default PlaceOrder;