import { useState } from "react";
import { useNavigate } from "react-router";
import "./staff-owner-login.css";
import Input from "/src/components/elements/input/input.jsx";
import Button from "/src/components/elements/button/button.jsx";
import Logo from "/src/assets/logo/logo.svg?react";
import EyeIcon from "/src/assets/icons/eye.svg?react";
import EyeOffIcon from "/src/assets/icons/eye-off.svg?react";
import { apiFetch } from "/src/api/client.js";
import { homeForRole } from "/src/components/ProtectedRoute.jsx";

function StaffOwnerLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            const response = await apiFetch("/auth/admin/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            const userData = response.data.user;
            const accountData = response.data.account;
            const token = response.data.token;

            if (userData.role !== "staff" && userData.role !== "owner") {
                setError("Your account does not have a valid role.");
                return;
            }

            const currentUser = {
                ...userData,
                ...(accountData || {}),
            };

            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            localStorage.setItem("token", token);
            setError("");
            navigate(homeForRole(userData.role), { replace: true });
        } catch (error) {
            setError(error.message || "Invalid email or password. Please check your credentials.");
        }
    };

    return (
        <div className="staff-owner-login-page">
            <div className="staff-owner-login-landing">
                <div className="staff-owner-login-intro">
                    <div className="staff-owner-login-brand">
                        <Logo />
                        <span>Kopi Express</span>
                    </div>
                    <div className="staff-owner-login-welcome">
                        <p className="staff-owner-login-eyebrow">
                            EST. JANUARY 2023 · PANDI, BULACAN
                        </p>
                        <h1>A cup that brings people together.</h1>
                        <p>
                            Founded by Mr. Primo Theo C. Morandarte — inspired
                            by a cafe experience in Vietnam, brought home to
                            Bulacan.
                        </p>
                    </div>
                </div>
                <div className="staff-owner-login-form">
                    <div className="staff-owner-login-card">
                        <h2>Welcome Back</h2>
                        <p className="staff-owner-login-description">
                            Log in to access your workspace.
                        </p>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            className="staff-owner-login-input"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                setError("");
                            }}
                        />
                        <div className="staff-owner-login-password-wrapper">
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                className="staff-owner-login-input"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setError("");
                                }}
                            />
                            <button
                                type="button"
                                className="staff-owner-login-password-toggle"
                                onClick={() => setShowPassword((current) => !current)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                            </button>
                        </div>
                        {error && (
                            <p className="staff-owner-login-error" role="alert">
                                {error}
                            </p>
                        )}
                        <Button
                            type="button"
                            className="staff-owner-login-button"
                            onClick={handleLogin}
                        >
                            Log In
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StaffOwnerLogin;