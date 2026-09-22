import { useState } from "react";
import "./owner-sales-report.css";
import LargeHeader from "/src/components/largeheader-wback/largeheader-wback.jsx";
import SearchIcon from "/src/assets/icons/search.svg";
import Arrow from "/src/assets/icons/arrow-down.svg?react";
import salesData from "/src/data/sales.js";
const OWNER_TABS = [
    { label: "Menu", path: "/owner/menu" },
    { label: "Sales Report", path: "/owner/sales-report" },
    { label: "Inventory", path: "/owner/inventory" },
];
function OwnerSalesReport() {
    const [sales] = useState(salesData);
    const [search, setSearch] = useState("");
    const [showBranch, setShowBranch] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [branch, setBranch] = useState("all");
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("none");
    const filteredSales = sales
        .filter((sale) => {
            const matchesSearch = sale.orderId.toLowerCase().includes(search.toLowerCase());
            const matchesBranch = branch === "all" || sale.branches?.includes(branch);
            return matchesSearch && matchesBranch;
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
            <LargeHeader title="Kopi Express / Owner" tabs={OWNER_TABS} />
            <div className="sales-report-content">
                <div className="content-frame">
                    <div className="sales-report-controls">
                        <div className="sales-report-search">
                            <img className="search-icon" src={SearchIcon} alt="Search" />
                            <input
                                type="text"
                                placeholder="Search by order ID"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="sales-report-actions">
                            <div className="sales-report-action">
                                <button onClick={() => {
                                    setShowBranch((current) => !current);
                                    setShowFilter(false);
                                    setShowSort(false);
                                }}>
                                    Branch
                                    <span><Arrow /></span>
                                </button>
                                {showBranch && (
                                    <div className="sales-report-dropdown">
                                        <button onClick={() => {
                                            setBranch("all");
                                            setShowBranch(false);
                                        }}>All Branches</button>
                                        <button onClick={() => {
                                            setBranch("Poblacion");
                                            setShowBranch(false);
                                        }}>Poblacion</button>
                                        <button onClick={() => {
                                            setBranch("Bunsuran II");
                                            setShowBranch(false);
                                        }}>Bunsuran II</button>
                                        <button onClick={() => {
                                            setBranch("Cacarong Bata");
                                            setShowBranch(false);
                                        }}>Cacarong Bata</button>
                                    </div>
                                )}
                            </div>
                            <div className="sales-report-action">
                                <button onClick={() => {
                                    setShowFilter((current) => !current);
                                    setShowBranch(false);
                                    setShowSort(false);
                                }}>
                                    Filter
                                    <span><Arrow /></span>
                                </button>
                                {showFilter && (
                                    <div className="sales-report-dropdown">
                                        <button onClick={() => {
                                            setFilter("all");
                                            setShowFilter(false);
                                        }}>All</button>
                                        <button onClick={() => {
                                            setFilter("online");
                                            setShowFilter(false);
                                        }}>Online</button>
                                        <button onClick={() => {
                                            setFilter("walk-in");
                                            setShowFilter(false);
                                        }}>Walk-In</button>
                                        <button onClick={() => {
                                            setFilter("gcash");
                                            setShowFilter(false);
                                        }}>GCash</button>
                                        <button onClick={() => {
                                            setFilter("cash");
                                            setShowFilter(false);
                                        }}>Cash</button>
                                    </div>
                                )}
                            </div>
                            <div className="sales-report-action">
                                <button onClick={() => {
                                    setShowSort((current) => !current);
                                    setShowBranch(false);
                                    setShowFilter(false);
                                }}>
                                    Sort
                                    <span><Arrow /></span>
                                </button>
                                {showSort && (
                                    <div className="sales-report-dropdown">
                                        <button onClick={() => {
                                            setSort("none");
                                            setShowSort(false);
                                        }}>Default</button>
                                        <button onClick={() => {
                                            setSort("date");
                                            setShowSort(false);
                                        }}>Date</button>
                                        <button onClick={() => {
                                            setSort("total");
                                            setShowSort(false);
                                        }}>Total Sale</button>
                                        <button onClick={() => {
                                            setSort("units");
                                            setShowSort(false);
                                        }}>Units Sold</button>
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
                                {filteredSales.map((sale) => (
                                    <tr key={sale.id}>
                                        <td>{sale.date}</td>
                                        <td>{sale.orderId}</td>
                                        <td>{sale.product}</td>
                                        <td>{sale.unitsSold}</td>
                                        <td>₱{sale.unitPrice}</td>
                                        <td>₱{sale.totalSale}</td>
                                        <td>{sale.paymentMethod}</td>
                                        <td>{sale.orderType}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default OwnerSalesReport;