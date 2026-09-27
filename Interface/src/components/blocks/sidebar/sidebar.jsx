import { useNavigate } from 'react-router';
import './sidebar.css';
import Button from '/src/components/elements/button/button.jsx';
import CrownLogo from '/src/assets/logo/logo.svg?react';
import CloseIcon from '/src/assets/icons/close.svg?react';
import UserAvatar from '/src/assets/icons/avatar.svg?react';
import PersonIcon from '/src/assets/icons/login.svg?react';
import PinIcon from '/src/assets/icons/location.svg?react';
import CupIcon from '/src/assets/icons/cap.svg?react';
import HistoryIcon from '/src/assets/icons/time.svg?react';
import GearIcon from '/src/assets/icons/settings.svg?react';
import LogoutIcon from '/src/assets/icons/logout.svg?react';
import LinkButton from '/src/components/elements/button/link-button/link-button.jsx';

const MENU_ITEMS_LOGGED_IN = [
    { key: 'store-locator', label: 'Store Locator', icon: PinIcon, goto: '/store-locator' },
    { key: 'order-status', label: 'Order Status', icon: CupIcon, goto: '/order-status' },
    { key: 'order-history', label: 'Order History', icon: HistoryIcon, goto: '/order-history' },
    { key: 'settings', label: 'Settings', icon: GearIcon, goto: '/settings' },
];

const MENU_ITEMS_LOGGED_OUT = [
    { key: 'store-locator', label: 'Store Locator', icon: PinIcon, goto: '/store-locator' },
    { key: 'order-status', label: 'Order Status', icon: CupIcon, goto: '/login' },
    { key: 'order-history', label: 'Order History', icon: HistoryIcon, goto: '/login' },
    { key: 'settings', label: 'Settings', icon: GearIcon, goto: '/login' },
];

export default function Sidebar({
    isOpen = false,
    user,
    onClose,
    onLogout,
    onLogin,
}) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const isLoggedIn = !!user;
    const menuItems = isLoggedIn
        ? MENU_ITEMS_LOGGED_IN
        : MENU_ITEMS_LOGGED_OUT;

    const handleLogout = () => {
        onLogout?.();
        navigate('/');
    };

    return (
        <>
            <div className="sidebarOverlay" onClick={onClose} />
            <aside className="sidebar">
                <div className="sidebarHeader">
                    <div className="sidebarBrand">
                        <CrownLogo className="brandIcon" />
                        <span className="brandName">Kopi Express</span>
                    </div>
                    <button
                        type="button"
                        className="sidebarCloseBtn"
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        <CloseIcon className="closeIcon" />
                    </button>
                </div>
                {isLoggedIn ? (
                    <div className="sidebarUser">
                        <UserAvatar className="userAvatarIcon" />
                        <div>
                            <p className="userName">{user?.fullName}</p>
                        </div>
                    </div>
                ) : (
                    <Button
                        className="loginSignupBtn"
                        onClick={onLogin}
                    >
                        Log In / Sign Up
                    </Button>
                )}
                <nav className="sidebarNav">
                    {menuItems.map((item) => (
                        <LinkButton
                            key={item.key}
                            goto={item.goto}
                            icon={item.icon}
                            label={item.label}
                            type="normal"
                        />
                    ))}
                </nav>
                <div className="sidebarFooter">
                    {isLoggedIn ? (
                        <button
                            type="button"
                            className="logoutBtn"
                            onClick={handleLogout}
                        >
                            <LogoutIcon className="footerIcon" />
                            <span>Log Out</span>
                        </button>
                    ) : (
                        <Button
                            className="loginBtn"
                            onClick={onLogin}
                        >
                            <PersonIcon className="footerIcon" />
                            <span>Log In</span>
                        </Button>
                    )}
                </div>
            </aside>
        </>
    );
}