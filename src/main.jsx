import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Home from "./customer/pages/home/home.jsx";
import StoreLocator from "./customer/pages/store-locator/store-locator.jsx";
import OrderStatus from "./customer/pages/order-status/order-status.jsx";
import OrderHistory from "./customer/pages/order-history/order-history.jsx";
import Settings from "./customer/pages/settings/settings.jsx";
import PlaceOrder from "./customer/pages/place-order/place-order.jsx";
import DeliveryEligibility from "./components/cards/delivery-eligibility/delivery-eligibility.jsx";
import Login from "./components/cards/login/login.jsx";
import Signup from "./components/cards/signup/signup.jsx";
import QRPayment from "./customer/pages/qr-payment/qr-payment.jsx";
import PaymentConfirmed from "./customer/pages/payment-confirmation/payment-confirmation.jsx";
import Customization from "./customer/pages/customization/customization.jsx";
import Inventory from "./owner-staff/pages/inventory/inventory.jsx";
import OnlineOrders from "./owner-staff/pages/online-orders/online-orders.jsx";
import OrdersQueue from "./owner-staff/pages/orders-queue/orders-queue.jsx";
import { OrdersProvider } from "./owner-staff/orders-context/orders-context.jsx";
import SalesReport from "./owner-staff/owner-pages/owner-sales-report/owner-sales-report.jsx";
import OwnerInventory from "./owner-staff/owner-pages/owner-inventory/owner-inventory.jsx";
import OwnerMenu from "./owner-staff/owner-pages/owner-menu/owner-menu.jsx";
import OrderHistoryDetails from "/src/customer/pages/order-history-details/order-history-details.jsx";
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <OrdersProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route index element={<Home />} />
                        <Route path="store-locator" element={<StoreLocator />} />
                        <Route path="order-status" element={<OrderStatus />} />
                        <Route path="order-history" element={<OrderHistory />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="place-order" element={<PlaceOrder />} />
                        <Route path="delivery-eligibility" element={<DeliveryEligibility />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                        <Route path="qr-payment" element={<QRPayment />} />
                        <Route path="payment-confirmed" element={<PaymentConfirmed />} />
                        <Route path="customization" element={<Customization />} />
                        <Route path="inventory" element={<Inventory />} />
                        <Route path="online-orders" element={<OnlineOrders />} />
                        <Route path="owner/menu" element={<OwnerMenu />} />
                        <Route path="orders-queue" element={<OrdersQueue />} />
                        <Route path="owner/sales-report" element={<SalesReport />} />
                        <Route path="owner/inventory" element={<OwnerInventory />} />
                        <Route path="order-history/details" element={<OrderHistoryDetails />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </OrdersProvider>
    </StrictMode>
);