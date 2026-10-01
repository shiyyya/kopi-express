import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./sales-report.css";
import Arrow from "../../assets/icons/arrow-down.svg?react";
import LargeHeader from "/src/components/largeheader-wback/largeheader-wback.jsx";
import { getSalesReport } from "../../api/sales-rep.api.js";

function SalesReport() {
    const [sales, setSales] = useState([]);
    const [branchName, setBranchName] = useState("");
    const [search, setSearch] = useState("");
    const [showPayment, setShowPayment] = useState(false);
    const [showOrderType, setShowOrderType] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const [showSort, setShowSort] = useState(false);
    const [filter, setFilter] = useState({
        paymentMethod: "all",
        orderType: "all",
        startDate: "",
        endDate: ""
    });
    const [sort, setSort] = useState("none");

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const result = await getSalesReport();
                setSales(result.data || []);
                setBranchName(result.branch || "");
            } catch (error) {
                console.error("Failed to fetch sales report:", error);
                setSales([]);
                setBranchName("");
            }
        };
        fetchSales();
    }, []);

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

    const filteredSales = sales
        .filter((sale) => {
            const orderId = String(sale.orderId || sale.order_id || "").toLowerCase();
            const product = String(sale.product || sale.productName || "").toLowerCase();
            const searchValue = search.toLowerCase().trim();
            return orderId.includes(searchValue) || product.includes(searchValue);
        })
        .filter((sale) => {
            if (filter.paymentMethod === "all") return true;
            return String(sale.paymentMethod || "").toLowerCase() === filter.paymentMethod;
        })
        .filter((sale) => {
            if (filter.orderType === "all") return true;
            return String(sale.orderType || "").toLowerCase() === filter.orderType;
        })
        .filter((sale) => {
            if (!filter.startDate && !filter.endDate) return true;
            const saleDate = new Date(sale.date);
            if (Number.isNaN(saleDate.getTime())) return false;
            saleDate.setHours(0, 0, 0, 0);
            if (filter.startDate) {
                const startDate = new Date(`${filter.startDate}T00:00:00`);
                if (saleDate < startDate) return false;
            }
            if (filter.endDate) {
                const endDate = new Date(`${filter.endDate}T23:59:59.999`);
                if (saleDate > endDate) return false;
            }
            return true;
        })
        .sort((a, b) => {
            if (sort === "date") return new Date(b.date) - new Date(a.date);
            if (sort === "total") return Number(b.totalSale) - Number(a.totalSale);
            if (sort === "units") return Number(b.unitsSold) - Number(a.unitsSold);
            if (sort === "price") return Number(b.unitPrice) - Number(a.unitPrice);
            return 0;
        });

    const overallTotal = filteredSales.reduce(
        (total, sale) => total + Number(sale.totalSale || 0),
        0
    );

    const closeDropdowns = () => {
        setShowPayment(false);
        setShowOrderType(false);
        setShowDate(false);
        setShowSort(false);
    };

    const getAppliedFilters = () => {
        const filters = [];
        if (filter.paymentMethod !== "all") filters.push(getPaymentLabel(filter.paymentMethod));
        if (filter.orderType !== "all") filters.push(getOrderTypeLabel(filter.orderType));
        if (filter.startDate || filter.endDate) {
            const start = filter.startDate ? formatDate(filter.startDate) : "Any Date";
            const end = filter.endDate ? formatDate(filter.endDate) : "Any Date";
            filters.push(`${start} - ${end}`);
        }
        return filters.length ? filters.join(" • ") : "None";
    };

    const handleExport = () => {
        if (filteredSales.length === 0) return;

        const reportDate = new Date();
        const formattedReportDate = reportDate.toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        const today = reportDate.toISOString().split("T")[0];
        const safeBranchName = String(branchName || "Branch")
            .replace(/[\\/:*?"<>|]/g, "")
            .trim()
            .replace(/\s+/g, "-");

        const exportData = [
            ["Kopi Express - Sales Report"],
            ["Branch", branchName || "Branch"],
            ["Report Date", formattedReportDate],
            ["Filters", getAppliedFilters()],
            [],
            ["Date", "Order ID", "Product", "Units Sold", "Unit Price", "Total Sale", "Payment Method", "Order Type"],
            ...filteredSales.map((sale) => [
                formatDate(sale.date),
                sale.orderId || sale.order_id || "",
                sale.product || sale.productName || "",
                Number(sale.unitsSold || 0),
                Number(sale.unitPrice || 0),
                Number(sale.totalSale || 0),
                getPaymentLabel(sale.paymentMethod),
                getOrderTypeLabel(sale.orderType)
            ]),
            [],
            ["", "", "Overall Total", "", "", overallTotal, "", ""]
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        worksheet["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }
        ];

        worksheet["!cols"] = [
            { wch: 16 },
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
            `Kopi-Express-Sales-Report-${safeBranchName}-${today}.xlsx`
        );
    };

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
                                    const next = !showPayment;
                                    closeDropdowns();
                                    setShowPayment(next);
                                }}>
                                    Payment Method
                                    <span><Arrow /></span>
                                </button>
                                {showPayment && (
                                    <div className="sales-report-dropdown">
                                        <button onClick={() => {
                                            setFilter((current) => ({ ...current, paymentMethod: "all" }));
                                            setShowPayment(false);
                                        }}>All Payments</button>
                                        <button onClick={() => {
                                            setFilter((current) => ({ ...current, paymentMethod: "cash" }));
                                            setShowPayment(false);
                                        }}>Cash</button>
                                        <button onClick={() => {
                                            setFilter((current) => ({ ...current, paymentMethod: "gcash" }));
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
                                            setFilter((current) => ({ ...current, orderType: "all" }));
                                            setShowOrderType(false);
                                        }}>All Order Types</button>
                                        <button onClick={() => {
                                            setFilter((current) => ({ ...current, orderType: "delivery" }));
                                            setShowOrderType(false);
                                        }}>Delivery</button>
                                        <button onClick={() => {
                                            setFilter((current) => ({ ...current, orderType: "pickup" }));
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
                                            value={filter.startDate}
                                            onChange={(e) => setFilter((current) => ({
                                                ...current,
                                                startDate: e.target.value
                                            }))}
                                        />
                                        <input
                                            type="date"
                                            value={filter.endDate}
                                            onChange={(e) => setFilter((current) => ({
                                                ...current,
                                                endDate: e.target.value
                                            }))}
                                        />
                                        <button onClick={() => {
                                            setFilter((current) => ({
                                                ...current,
                                                startDate: "",
                                                endDate: ""
                                            }));
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
                                        <button onClick={() => {
                                            setSort("price");
                                            setShowSort(false);
                                        }}>Unit Price</button>
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
                                        <tr key={`${sale.orderId}-${sale.product}-${sale.date}`}>
                                            <td>{formatDate(sale.date)}</td>
                                            <td>{sale.orderId || sale.order_id}</td>
                                            <td>{sale.product || sale.productName}</td>
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

export default SalesReport;