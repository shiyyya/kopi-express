import "./order-summary.css";
import OrderItem from "/src/components/blocks/order-item/order-item.jsx";

function OrderSummary({ items = [], deliveryFee = 0, orderType = "Pickup" }) {
    const subtotal = items.reduce((total, item) => {
        const productPrice = Number(item.product?.price || 0);
        const addOnsTotal = (item.addOns || []).reduce(
            (addOnTotal, addOn) => addOnTotal + Number(addOn.price || 0),
            0
        );
        return total + (productPrice + addOnsTotal) * Number(item.quantity || 1);
    }, 0);
    const actualDeliveryFee = orderType === "Delivery" ? Number(deliveryFee || 0) : 0;
    const total = subtotal + actualDeliveryFee;
    return (
        <section className="OrderSummary">
            <h2>Order Summary</h2>
            {items.length === 0 ? (
                <div className="EmptyOrder">
                    <p>No items in your order.</p>
                </div>
            ) : (
                <>
                    <div className="OrderItems">
                        {items.map((item) => (
                            <OrderItem
                                key={item.id}
                                item={item}
                                showRemove={false}
                            />
                        ))}
                    </div>
                    <div className="SummaryDivider"></div>
                    <div className="PriceRow">
                        <span>Subtotal</span>
                        <strong>₱{subtotal.toFixed(2)}</strong>
                    </div>
                    {orderType === "Delivery" && (
                        <div className="PriceRow">
                            <span>Delivery fee</span>
                            <strong>₱{actualDeliveryFee.toFixed(2)}</strong>
                        </div>
                    )}
                    <div className="TotalRow">
                        <span>Total</span>
                        <strong>₱{total.toFixed(2)}</strong>
                    </div>
                </>
            )}
        </section>
    );
}

export default OrderSummary;