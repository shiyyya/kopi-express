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
                        <Route path="store-locator" element={<StoreLocator />} />

                        {/* CUSTOMER ONLY */}
                        <Route path="order-status" element={<ProtectedRoute allowedRoles={["customer"]}><OrderStatus /></ProtectedRoute>} />
                        <Route path="order-history" element={<ProtectedRoute allowedRoles={["customer"]}><OrderHistory /></ProtectedRoute>} />
                        <Route path="order-history/details" element={<ProtectedRoute allowedRoles={["customer"]}><OrderHistoryDetails /></ProtectedRoute>} />
                        <Route path="settings" element={<ProtectedRoute allowedRoles={["customer"]}><Settings /></ProtectedRoute>} />
                        <Route path="place-order" element={<ProtectedRoute allowedRoles={["customer"]}><PlaceOrder /></ProtectedRoute>} />
                        <Route path="delivery-eligibility" element={<ProtectedRoute allowedRoles={["customer"]}><DeliveryEligibility /></ProtectedRoute>} />
                        <Route path="qr-payment" element={<ProtectedRoute allowedRoles={["customer"]}><QRPayment /></ProtectedRoute>} />
                        <Route path="payment-confirmed" element={<ProtectedRoute allowedRoles={["customer"]}><PaymentConfirmed /></ProtectedRoute>} />
                        <Route path="customization" element={<ProtectedRoute allowedRoles={["customer"]}><Customization /></ProtectedRoute>} />

                        {/* STAFF ONLY */}
                        <Route path="inventory" element={<ProtectedRoute allowedRoles={["staff"]}><Inventory /></ProtectedRoute>} />
                        <Route path="online-orders" element={<ProtectedRoute allowedRoles={["staff"]}><OnlineOrders /></ProtectedRoute>} />
                        <Route path="orders-queue" element={<ProtectedRoute allowedRoles={["staff"]}><OrdersQueue /></ProtectedRoute>} />
                        <Route path="sales-report" element={<ProtectedRoute allowedRoles={["staff"]}><SalesReport /></ProtectedRoute>} />

                        {/* OWNER ONLY */}
                        <Route path="owner/menu" element={<ProtectedRoute allowedRoles={["owner"]}><OwnerMenu /></ProtectedRoute>} />
                        <Route path="owner/sales-report" element={<ProtectedRoute allowedRoles={["owner"]}><OwnerSalesReport /></ProtectedRoute>} />
                        <Route path="owner/inventory" element={<ProtectedRoute allowedRoles={["owner"]}><OwnerInventory /></ProtectedRoute>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </OrdersProvider>
    </StrictMode>
);