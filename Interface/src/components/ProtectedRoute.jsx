import { Navigate } from "react-router";

function isTokenExpired(token) {
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(atob(base64));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;