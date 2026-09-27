import "./largeheader-wback.css";
import { useNavigate, useLocation } from "react-router";
import Button from "/src/components/elements/button/button.jsx";
import Logo from "/src/assets/logo/logo.svg?react";
import LogoutIcon from "/src/assets/icons/logout.svg?react";

const TABS = [
    { label: "Online Order Requests", path: "/online-orders" },
    { label: "Orders In-Queue", path: "/orders-queue" },
    { label: "Inventory", path: "/inventory" },
    { label: "Sales Report", path: "/sales-report" },
];

function LargeHeader({
    title = "Kopi Express/Staff",
    tabs = TABS,
    onLogout,
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        onLogout?.();
        navigate("/portal");
    };

    return (
        <div className="LargeHeader">
            <div className="headerTop">
                <Logo />
                <h1 className="LargeHeaderTitle">{title}</h1>
            </div>
            <div className="headerTabs">
                <div className="headerTabList">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.label}
                            className={`headerTab ${
                                location.pathname === tab.path ? "active" : ""
                            }`}
                            onClick={() => navigate(tab.path)}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>
                <Button className="headerLogout" onClick={handleLogout}>
                    <LogoutIcon />
                    <span>Log Out</span>
                </Button>
            </div>
        </div>
    );
}

export default LargeHeader;