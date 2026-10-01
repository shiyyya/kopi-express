import { useState } from "react";
import "./sales-report.css";
import Arrow from "../../assets/icons/arrow-down.svg?react";
import LargeHeader from "/src/components/largeheader-wback/largeheader-wback.jsx";

const salesData = [];

function SalesReport() {
    const [sales] = useState(salesData);
    const [search, setSearch] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("none");

    const filteredSales = sales
        .filter((sale) => {
            const orderId = sale.orderId || sale.order_id || "";
            const product = sale.product || sale.productName || "";
            return orderId.toLowerCase().includes(search.toLowerCase()) || product.toLowerCase().includes(search.toLowerCase());
        })
        .filter((sale) => {
            if (filter === "all") return true;
            if (filter === "online") return sale.orderType === "Online";
            if (filter === "walk-in") return sale.orderType === "Walk-In";
            if (filter === "gcash") return sale.paymentMethod === "GCash";
            if (filter === "cash") return sale.paymentMethod === "Cash";
            return true;
        })
        .sort((a, b) => {
            if (sort === "date") return new Date(b.date) - new Date(a.date);
            if (sort === "total") return Number(b.totalSale) - Number(a.totalSale);
            if (sort === "units") return Number(b.unitsSold) - Number(a.unitsSold);
            return 0;
        });

    return (
        <div className="sales-report-page">
            <LargeHeader title="Kopi Express/Staff" />
            <div className="sales-report-content">
                <div className="content-frame">
                    <div className="sales-report-controls">
                        <div className="sales-report-search">
                            <span>⌕</span>
                            <input
                                id="sales-report-search"
                                name="sales-report-search"
                                type="text"
                                placeholder="Search sales..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="sales-report-actions">
                            <div className="sales-report-action">
                                <button onClick={() => {
                                    setShowFilter((current) => !current);
                                    setShowSort(false);
                                }}>
                                    Filter
                                    <span><Arrow /></span>
                                </button>
                                {showFilter && (
                                    <div className="sales-report-dropdown">
                                        <button onClick={() => { setFilter("all"); setShowFilter(false); }}>All</button>
                                        <button onClick={() => { setFilter("online"); setShowFilter(false); }}>Online</button>
                                        <button onClick={() => { setFilter("walk-in"); setShowFilter(false); }}>Walk-In</button>
                                        <button onClick={() => { setFilter("gcash"); setShowFilter(false); }}>GCash</button>
                                        <button onClick={() => { setFilter("cash"); setShowFilter(false); }}>Cash</button>
                                    </div>
                                )}
                            </div>
                            <div className="sales-report-action">
                                <button onClick={() => {
                                    setShowSort((current) => !current);
                                    setShowFilter(false);
                                }}>
                                    Sort
                                    <span><Arrow /></span>
                                </button>
                                {showSort && (
                                    <div className="sales-report-dropdown">
                                        <button onClick={() => { setSort("none"); setShowSort(false); }}>Default</button>
                                        <button onClick={() => { setSort("date"); setShowSort(false); }}>Date</button>
                                        <button onClick={() => { setSort("total"); setShowSort(false); }}>Total Sale</button>
                                        <button onClick={() => { setSort("units"); setShowSort(false); }}>Units Sold</button>
                                    </div>
                                )}
                            </div>
                            <button className="sales-report-export">Export</button>
                        </div>
                    </div>
                    <div className="sales-report-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Order ID</th>
                                    <th>Product</th>
                                    <th>Units Sold</th>
                                    <th>Unit Price</th>
                                    <th>Total Sale</th>
                                    <th>Payment Method</th>
                                    <th>Order Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSales.length === 0 ? (
                                    <tr>
                                        <td colSpan="8">No sales found.</td>
                                    </tr>
                                ) : (
                                    filteredSales.map((sale) => (
                                        <tr key={sale.id}>
                                            <td>{sale.date}</td>
                                            <td>{sale.orderId || sale.order_id}</td>
                                            <td>{sale.product || sale.productName}</td>
                                            <td>{sale.unitsSold}</td>
                                            <td>₱{sale.unitPrice}</td>
                                            <td>₱{sale.totalSale}</td>
                                            <td>{sale.paymentMethod}</td>
                                            <td>{sale.orderType}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SalesReport;