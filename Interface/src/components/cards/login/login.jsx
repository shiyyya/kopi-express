import { useState } from "react";
import "./login.css";
import { login } from "/src/api/auth.api.js";
import { Link } from "react-router";
import Input from "/src/components/elements/input/input.jsx";
import Button from "/src/components/elements/button/button.jsx";
import Logo from "/src/assets/logo/logo.svg?react";
import EyeIcon from "/src/assets/icons/eye.svg?react";
import EyeOffIcon from "/src/assets/icons/eye-off.svg?react";

function LoginCard({ onClose, onSignUp, onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        const user = await login({ email, password });
        localStorage.setItem("currentUser", JSON.stringify(user.data));
        localStorage.setItem("token", JSON.stringify(user.data.token));
        console.log("Login successful:", user.data.customer.fullName);
        onLoginSuccess?.(user);
        onClose?.();
        return;
    };

    return (
        <div className="loginOverlay" onClick={onClose}>
            <div
                className="LoginCard"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="LoginHandle"></div>
                <div className="LoginLogo">
                    <Logo />
                    <span>Kopi Express</span>
                </div>
                <h2>Welcome Back</h2>
                <p className="LoginDescription">
                    Log in to place your order.
                </p>
                <Input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    className="LoginInput"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                    }}
                />
                <div className="LoginPasswordWrapper">
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className="LoginInput"
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                            setError("");
                        }}
                    />
                    <button
                        type="button"
                        className="LoginPasswordToggle"
                        onClick={() =>
                            setShowPassword((current) => !current)
                        }
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                </div>
                {error && (
                    <p className="LoginError" role="alert">
                        {error}
                    </p>
                )}
                <Button
                    type="button"
                    className="LoginButton"
                    onClick={handleLogin}
                >
                    Log In
                </Button>
                <p className="SignUpText">
                    No account?
                    <Link
                        to="/signup"
                        onClick={(event) => {
                            event.preventDefault();
                            onSignUp?.();
                        }}
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginCard;