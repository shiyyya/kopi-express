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
import SalesReport from "./owner-staff/pages/sales-report.jsx";

import { OrdersProvider } from "./owner-staff/orders-context/orders-context.jsx";

import OwnerSalesReport from "./owner-staff/owner-pages/owner-sales-report/owner-sales-report.jsx";
import OwnerInventory from "./owner-staff/owner-pages/owner-inventory/owner-inventory.jsx";
import OwnerMenu from "./owner-staff/owner-pages/owner-menu/owner-menu.jsx";

import StaffOwnerLogin from "./owner-staff/staff-owner-login/staff-owner-login.jsx";
import OrderHistoryDetails from "./customer/pages/order-history-details/order-history-details.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <OrdersProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}>
                        {/* PUBLIC ROUTES */}
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                        <Route path="portal" element={<StaffOwnerLogin />} />

                        {/* CUSTOMER PROTECTED ROUTES */}
                        <Route path="store-locator" element={<StoreLocator />} />
                        <Route path="order-status" element={<ProtectedRoute><OrderStatus /></ProtectedRoute>} />
                        <Route path="order-history" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                        <Route path="order-history/details" element={<ProtectedRoute><OrderHistoryDetails /></ProtectedRoute>} />
                        <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                        <Route path="place-order" element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
                        <Route path="delivery-eligibility" element={<ProtectedRoute><DeliveryEligibility /></ProtectedRoute>} />
                        <Route path="qr-payment" element={<ProtectedRoute><QRPayment /></ProtectedRoute>} />
                        <Route path="payment-confirmed" element={<ProtectedRoute><PaymentConfirmed /></ProtectedRoute>} />
                        <Route path="customization" element={<ProtectedRoute><Customization /></ProtectedRoute>} />

                        {/* OWNER / STAFF PROTECTED ROUTES */}
                        <Route path="inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                        <Route path="online-orders" element={<ProtectedRoute><OnlineOrders /></ProtectedRoute>} />
                        <Route path="orders-queue" element={<ProtectedRoute><OrdersQueue /></ProtectedRoute>} />
                        <Route path="sales-report" element={<ProtectedRoute><SalesReport /></ProtectedRoute>} />

                        {/* OWNER PROTECTED ROUTES */}
                        <Route path="owner/menu" element={<ProtectedRoute><OwnerMenu /></ProtectedRoute>} />
                        <Route path="owner/sales-report" element={<ProtectedRoute><OwnerSalesReport /></ProtectedRoute>} />
                        <Route path="owner/inventory" element={<ProtectedRoute><OwnerInventory /></ProtectedRoute>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </OrdersProvider>
    </StrictMode>
);