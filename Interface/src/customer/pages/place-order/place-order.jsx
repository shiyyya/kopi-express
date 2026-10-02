import "./place-order.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Header from "/src/components/blocks/header-wback/header-wback.jsx";
import Button from "/src/components/elements/button/button.jsx";
import DeliveryAddress from "/src/components/blocks/delivery-address/delivery-address.jsx";
import OrderSummary from "/src/components/blocks/order-summary/order-summary.jsx";
import ContactIcon from "/src/assets/icons/contact.svg?react";
import CheckIcon from "/src/assets/icons/check.svg?react";
import CashIcon from "/src/assets/icons/cash.svg?react";
import QrIcon from "/src/assets/icons/qr.svg?react";
import { createOrder } from "/src/api/orders.api.js";
import { getCurrentUser, addCustomerAddress } from "/src/api/user.js";

const DELIVERY_FEE = 50;

function PlaceOrder() {
    const navigate = useNavigate();
    const location = useLocation();
    const orderItems = location.state?.items || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const orderType = location.state?.orderType || "Pickup";
    const store = location.state?.store || null;
    const deliveryFee = orderType === "Delivery" ? DELIVERY_FEE : 0;
    const [phone, setPhone] = useState(currentUser?.phoneNumber || "");
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(location.state?.customerAddressId || null);
    const [newAddress, setNewAddress] = useState("");
    const [showNewAddress, setShowNewAddress] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(orderType === "Delivery");
    const [addingAddress, setAddingAddress] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(location.state?.paymentMethod || "");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (orderType !== "Delivery") return;
        let cancelled = false;
        getCurrentUser()
            .then((data) => {
                if (cancelled) return;
                const savedAddresses = data.addresses || [];
                setAddresses(savedAddresses);
                if (data.customer?.phoneNumber) setPhone(data.customer.phoneNumber);
                if (!selectedAddressId && savedAddresses.length > 0) setSelectedAddressId(savedAddresses[0].id);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message || "Failed to load your saved addresses.");
            })
            .finally(() => {
                if (!cancelled) setLoadingAddresses(false);
            });
        return () => {
            cancelled = true;
        };
    }, [orderType]);

    const handleAddAddress = async (value) => {
        const addressValue = value.trim();
        if (!addressValue) return;
        setError("");
        setAddingAddress(true);
        try {
            const data = await addCustomerAddress(addressValue);
            const addedAddress = data.address || data.customerAddress || data;
            if (addedAddress?.id) {
                setAddresses((current) => [...current, addedAddress]);
                setSelectedAddressId(addedAddress.id);
            } else {
                const refreshed = await getCurrentUser();
                const savedAddresses = refreshed.addresses || [];
                setAddresses(savedAddresses);
                const newest = savedAddresses[savedAddresses.length - 1];
                if (newest?.id) setSelectedAddressId(newest.id);
            }
            setNewAddress("");
            setShowNewAddress(false);
        } catch (err) {
            setError(err.message || "Failed to add the address.");
        } finally {
            setAddingAddress(false);
        }
    };

    const handleAddressSelect = (address) => {
        setSelectedAddressId(address.id);
    };

    const handlePlaceOrder = async () => {
        if (submitting) return;
        const isDelivery = orderType === "Delivery";
        const isGcash = paymentMethod === "QR Payment";
        if (orderItems.length === 0) return setError("Your cart is empty.");
        if (isDelivery && !selectedAddressId) return setError("Please select or add a delivery address.");
        if (!isDelivery && !store) return setError("Please select a pickup store.");
        if (!paymentMethod) return setError("Please select a payment method.");
        setError("");
        const subtotal = orderItems.reduce((total, item) => {
            const productPrice = Number(item.product?.price || 0);
            const addOnsTotal = (item.addOns || []).reduce((sum, addOn) => sum + Number(addOn.price || 0), 0);
            return total + (productPrice + addOnsTotal) * Number(item.quantity || 1);
        }, 0);
        const total = subtotal + deliveryFee;
        const trimmedNotes = notes.trim();
        const payload = {
            fulfillmentType: isDelivery ? "delivery" : "self_pick_up",
            paymentMethod: isGcash ? "gcash" : "cash",
            ...(isDelivery ? { customerAddressId: selectedAddressId } : { storeBranchId: store.id }),
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

    const selectedAddress = addresses.find((address) => address.id === selectedAddressId);

    return (
        <div className="PlaceOrderPage">
            <Header title="Place Order" />
            <main className="PlaceOrderContent">
                {orderType === "Delivery" ? (
                    <section className="DeliverySection">
                        {loadingAddresses ? (
                            <p className="DeliveryNote">Loading addresses...</p>
                        ) : (
                            <DeliveryAddress
                                addresses={addresses.map((address) => address.address)}
                                selectedAddress={selectedAddress?.address || ""}
                                onSelect={(address) => {
                                    const selected = addresses.find((item) => item.address === address);
                                    if (selected) handleAddressSelect(selected);
                                }}
                                onAdd={handleAddAddress}
                            />
                        )}
                        <div className="DeliveryDivider"></div>
                        <div className="PhoneInformation">
                            <ContactIcon />
                            <div>
                                <strong>{phone || "No phone number"}</strong>
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
                                <strong>{store?.name || "No store selected"}</strong>
                                <span>{store?.address || "No store address available"}</span>
                            </div>
                            <span className="PickupStoreCheck">
                                <CheckIcon />
                            </span>
                        </div>
                    </section>
                )}
                <OrderSummary items={orderItems} deliveryFee={deliveryFee} orderType={orderType} />
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