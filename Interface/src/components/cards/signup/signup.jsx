import { useState } from "react";
import "./signup.css";
import { signup } from "/src/api/auth.api.js";
import { Link } from "react-router";
import Input from "/src/components/elements/input/input.jsx";
import Button from "/src/components/elements/button/button.jsx";
import Logo from "/src/assets/logo/logo.svg?react";
import EyeIcon from "/src/assets/icons/eye.svg?react";
import EyeOffIcon from "/src/assets/icons/eye-off.svg?react";
function SignUpCard({ onClose, onLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignUp = async () => {
        const user = await signup({ fullName, email, phoneNumber, password, confirmPassword, defaultAddress });
        localStorage.setItem("currentUser", JSON.stringify(user.data));
        localStorage.setItem("token", JSON.stringify(user.data.token));
        console.log("Login successful:", user.data.customer.fullName);
        onLoginSuccess?.(user);
        onClose?.();
        return;
    };

    return (
        <div
            className="signUpOverlay"
            onClick={onClose}
        >
            <div
                className="SignUpCard"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="SignUpHandle"></div>
                <div className="SignUpLogo">
                    <Logo />
                    <span>Kopi Express</span>
                </div>
                <h1>Create Account</h1>
                <p className="SignUpDescription">
                    Join us for easy ordering.
                </p>
                <label>Full Name *</label>
                <Input
                    type="text"
                    name="fullName"
                    placeholder="Juan Dela Cruz"
                    className="SignUpInput"
                />
                <label>Email *</label>
                <Input
                    type="email"
                    name="email"
                    placeholder="juan@email.com"
                    className="SignUpInput"
                />
                <label>Phone Number *</label>
                <Input
                    type="tel"
                    name="phone"
                    placeholder="09XX-XXX-XXXX"
                    className="SignUpInput"
                />
                <label>Password *</label>
                <div className="SignUpPasswordWrapper">
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••"
                        className="SignUpInput"
                    />
                    <button
                        type="button"
                        className="SignUpPasswordToggle"
                        onClick={() =>
                            setShowPassword((current) => !current)
                        }
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showPassword ? (
                            <EyeIcon />
                        ) : (
                            <EyeOffIcon />
                        )}
                    </button>
                </div>
                <label>Confirm Password *</label>
                <div className="SignUpPasswordWrapper">
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="••••••"
                        className="SignUpInput"
                    />
                    <button
                        type="button"
                        className="SignUpPasswordToggle"
                        onClick={() =>
                            setShowConfirmPassword((current) => !current)
                        }
                        aria-label={
                            showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showConfirmPassword ? (
                            <EyeIcon />
                        ) : (
                            <EyeOffIcon />
                        )}
                    </button>
                </div>
                <label>Delivery Address (optional)</label>
                <Input
                    type="text"
                    name="address"
                    placeholder="House no., street, barangay, Pandi, Bulacan"
                    className="SignUpInput"
                />
                <p className="DeliveryNote">
                    Delivery zones: Siling Bata, Poblacion, Bunsuran.
                </p>
                <Button
                    type="button"
                    className="CreateAccountButton"
                >
                    Create Account
                </Button>
                <p className="LoginText">
                    Have an account?
                    <Link
                        to="/login"
                        onClick={(event) => {
                            event.preventDefault();
                            onLogin?.();
                        }}
                    >
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}
export default SignUpCard;