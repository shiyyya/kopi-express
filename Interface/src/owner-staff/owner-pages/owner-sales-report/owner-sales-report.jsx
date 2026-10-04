import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./owner-sales-report.css";
import LargeHeader from "/src/components/largeheader-wback/largeheader-wback.jsx";
import SearchIcon from "/src/assets/icons/search.svg";
import Arrow from "/src/assets/icons/arrow-down.svg?react";
import { getSalesReport } from "../../../api/sales-rep.api.js";

const OWNER_TABS = [
    { label: "Menu", path: "/owner/menu" },
    { label: "Sales Report", path: "/owner/sales-report" },
    { label: "Inventory", path: "/owner/inventory" },
];

function OwnerSalesReport() {
    const [sales, setSales] = useState([]);
    const [search, setSearch] = useState("");
    const [showBranch, setShowBranch] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showOrderType, setShowOrderType] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [branch, setBranch] = useState("all");
    const [payment, setPayment] = useState("all");
    const [orderType, setOrderType] = useState("all");
    const [dateFilter, setDateFilter] = useState({
        startDate: "",
        endDate: ""
    });
    const [sort, setSort] = useState("none");

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const result = await getSalesReport();
                setSales(result.data || []);
            } catch (error) {
                console.error("Failed to fetch owner sales report:", error);
                setSales([]);
            }
        };
        fetchSales();
    }, []);

    const filteredSales = sales
        .filter((sale) => {
            const searchValue = search.toLowerCase().trim();
            const orderId = String(sale.orderId || "").toLowerCase();
            const product = String(sale.product || "").toLowerCase();
            const matchesSearch = orderId.includes(searchValue) || product.includes(searchValue);
            const matchesBranch = branch === "all" || sale.branch === branch;
            return matchesSearch && matchesBranch;
        })
        .filter((sale) => {
            if (payment === "all") return true;
            return String(sale.paymentMethod).toLowerCase() === payment;
        })
        .filter((sale) => {
            if (orderType === "all") return true;
            return String(sale.orderType).toLowerCase() === orderType;
        })
        .filter((sale) => {
            if (!dateFilter.startDate && !dateFilter.endDate) return true;
            const saleDate = new Date(sale.date);
            if (Number.isNaN(saleDate.getTime())) return false;
            saleDate.setHours(0, 0, 0, 0);
            if (dateFilter.startDate) {
                const startDate = new Date(`${dateFilter.startDate}T00:00:00`);
                if (saleDate < startDate) return false;
            }
            if (dateFilter.endDate) {
                const endDate = new Date(`${dateFilter.endDate}T23:59:59.999`);
                if (saleDate > endDate) return false;
            }
            return true;
        })
        .sort((a, b) => {
            if (sort === "date") return new Date(b.date) - new Date(a.date);
            if (sort === "total") return Number(b.totalSale) - Number(a.totalSale);
            if (sort === "units") return Number(b.unitsSold) - Number(a.unitsSold);
            return 0;
        });

    const overallTotal = filteredSales.reduce(
        (total, sale) => total + Number(sale.totalSale || 0),
        0
    );

    const formatDate = (date) => {
        if (!date) return "";
        const value = new Date(date);
        if (Number.isNaN(value.getTime())) return date;
        return value.toLocaleDateString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const getPaymentLabel = (value) => {
        if (!value) return "";
        const normalized = String(value).toLowerCase();
        if (normalized === "gcash") return "GCash";
        if (normalized === "cash") return "Cash";
        return value;
    };

    const getOrderTypeLabel = (value) => {
        if (!value) return "";
        const normalized = String(value).toLowerCase();
        if (normalized === "delivery") return "Delivery";
        if (normalized === "pickup") return "Pickup";
        return value;
    };

    const getAppliedFilters = () => {
        const filters = [];
        if (branch !== "all") filters.push(branch);
        if (payment !== "all") filters.push(getPaymentLabel(payment));
        if (orderType !== "all") filters.push(getOrderTypeLabel(orderType));
        if (dateFilter.startDate || dateFilter.endDate) {
            const start = dateFilter.startDate ? formatDate(dateFilter.startDate) : "Any Date";
            const end = dateFilter.endDate ? formatDate(dateFilter.endDate) : "Any Date";
            filters.push(`${start} - ${end}`);
        }
        return filters.length ? filters.join(" • ") : "None";
    };

    const handleExport = () => {
        if (filteredSales.length === 0) return;

        const reportDate = new Date();
        const today = reportDate.toISOString().split("T")[0];
        const formattedReportDate = reportDate.toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        const exportData = [
            ["Kopi Express - Consolidated Sales Report"],
            ["Report Date", formattedReportDate],
            ["Filters", getAppliedFilters()],
            [],
            ["Date", "Branch", "Order ID", "Product", "Units Sold", "Unit Price", "Total Sale", "Payment Method", "Order Type"],
            ...filteredSales.map((sale) => [
                formatDate(sale.date),
                sale.branch || "",
                sale.orderId || "",
                sale.product || "",
                Number(sale.unitsSold || 0),
                Number(sale.unitPrice || 0),
                Number(sale.totalSale || 0),
                getPaymentLabel(sale.paymentMethod),
                getOrderTypeLabel(sale.orderType)
            ]),
            [],
            ["", "", "", "Overall Total", "", "", overallTotal, "", ""]
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        worksheet["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }
        ];

        worksheet["!cols"] = [
            { wch: 16 },
            { wch: 18 },
            { wch: 28 },
            { wch: 28 },
            { wch: 12 },
            { wch: 14 },
            { wch: 14 },
            { wch: 18 },
            { wch: 16 }
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
        XLSX.writeFile(
            workbook,
            `Kopi-Express-Consolidated-Sales-Report-${today}.xlsx`
        );
    };

    const closeDropdowns = () => {
        setShowBranch(false);
        setShowPayment(false);
        setShowOrderType(false);
        setShowDate(false);
        setShowSort(false);
    };

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
                                    const next = !showBranch;
                                    closeDropdowns();
                                    setShowBranch(next);
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
                                            setBranch("Siling Bata");
                                            setShowBranch(false);
                                        }}>Siling Bata</button>
                                    </div>
                                )}
                            </div>
                            <div className="sales-report-action">
                                <button onClick={() => {
                                    const next = !showPayment;
                                    closeDropdowns();
                                    setShowPayment(next);
                                }}>
                                    Payment
                                    <span><Arrow /></span>
                                </button>
                                {showPayment && (
                                    <div className="sales-report-dropdown">
                                        <button onClick={() => {
                                            setPayment("all");
                                            setShowPayment(false);
                                        }}>All Payments</button>
                                        <button onClick={() => {
                                            setPayment("cash");
                                            setShowPayment(false);
                                        }}>Cash</button>
                                        <button onClick={() => {
                                            setPayment("gcash");
                                            setShowPayment(false);
                                        }}>GCash</button>
                                    </div>
                                )}
                            </div>
                            <div className="sales-report-action">
                                <button onClick={() => {
                                    const next = !showOrderType;
                                    closeDropdowns();
                                    setShowOrderType(next);
                                }}>
                                    Order Type
                                    <span><Arrow /></span>
                                </button>
                                {showOrderType && (
                                    <div className="sales-report-dropdown">
                                        <button onClick={() => {
                                            setOrderType("all");
                                            setShowOrderType(false);
                                        }}>All Order Types</button>
                                        <button onClick={() => {
                                            setOrderType("delivery");
                                            setShowOrderType(false);
                                        }}>Delivery</button>
                                        <button onClick={() => {
                                            setOrderType("pickup");
                                            setShowOrderType(false);
                                        }}>Pickup</button>
                                    </div>
                                )}
                            </div>
                            <div className="sales-report-action">
                                <button onClick={() => {
                                    const next = !showDate;
                                    closeDropdowns();
                                    setShowDate(next);
                                }}>
                                    Date
                                    <span><Arrow /></span>
                                </button>
                                {showDate && (
                                    <div className="sales-report-dropdown">
                                        <input
                                            type="date"
                                            value={dateFilter.startDate}
                                            onChange={(e) => setDateFilter((current) => ({
                                                ...current,
                                                startDate: e.target.value
                                            }))}
                                        />
                                        <input
                                            type="date"
                                            value={dateFilter.endDate}
                                            onChange={(e) => setDateFilter((current) => ({
                                                ...current,
                                                endDate: e.target.value
                                            }))}
                                        />
                                        <button onClick={() => {
                                            setDateFilter({
                                                startDate: "",
                                                endDate: ""
                                            });
                                            setShowDate(false);
                                        }}>Clear Date</button>
                                    </div>
                                )}
                            </div>
                            <div className="sales-report-action">
                                <button onClick={() => {
                                    const next = !showSort;
                                    closeDropdowns();
                                    setShowSort(next);
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
                            <button
                                className="sales-report-export"
                                onClick={handleExport}
                                disabled={filteredSales.length === 0}
                            >
                                Export
                            </button>
                        </div>
                    </div>
                    <div className="sales-report-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Branch</th>
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
                                        <td colSpan="9">No sales found.</td>
                                    </tr>
                                ) : (
                                    filteredSales.map((sale, index) => (
                                        <tr key={`${sale.orderId}-${sale.product}-${sale.date}-${index}`}>
                                            <td>{formatDate(sale.date)}</td>
                                            <td>{sale.branch}</td>
                                            <td>{sale.orderId}</td>
                                            <td>{sale.product}</td>
                                            <td>{sale.unitsSold}</td>
                                            <td>₱{Number(sale.unitPrice).toFixed(2)}</td>
                                            <td>₱{Number(sale.totalSale).toFixed(2)}</td>
                                            <td>{getPaymentLabel(sale.paymentMethod)}</td>
                                            <td>{getOrderTypeLabel(sale.orderType)}</td>
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

export default OwnerSalesReport;