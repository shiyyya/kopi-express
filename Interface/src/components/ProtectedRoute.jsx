import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router";

export function decodeToken(token) {
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

export function isTokenExpired(token) {
    const payload = decodeToken(token);
    return !payload || payload.exp * 1000 < Date.now();
}

export function getRole(token) {
    const payloadRole = decodeToken(token)?.role;
    if (payloadRole) return String(payloadRole).toLowerCase();
    try {
        const stored = JSON.parse(localStorage.getItem("currentUser"))?.role;
        return stored ? String(stored).toLowerCase() : undefined;
    } catch {
        return undefined;
    }
}

// Saan pupunta pagkatapos mag-login ang bawat role
export function homeForRole(role) {
    if (role === "owner") return "/owner/menu";
    if (role === "staff") return "/online-orders";
    return "/";
}

function ProtectedRoute({ children, allowedRoles }) {
    const navigate = useNavigate();

    const loginPath = allowedRoles?.includes("customer") ? "/" : "/portal";

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key !== null && e.key !== "token" && e.key !== "currentUser") return;

            const newToken = localStorage.getItem("token");

            if (!newToken || isTokenExpired(newToken)) {
                navigate(loginPath, { replace: true });
                return;
            }

            const newRole = getRole(newToken);
            if (allowedRoles && !allowedRoles.includes(newRole)) {
                navigate(homeForRole(newRole), { replace: true });
            }
        };

        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [navigate, allowedRoles, loginPath]);

    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        return <Navigate to={loginPath} replace />;
    }

    const role = getRole(token);
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to={homeForRole(role)} replace />;
    }

    return children;
}

export default ProtectedRoute;