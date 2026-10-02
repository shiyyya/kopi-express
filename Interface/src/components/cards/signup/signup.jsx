import { useState } from "react";
import "./signup.css";
import { signup } from "/src/api/auth.api.js";
import { Link } from "react-router";
import Input from "/src/components/elements/input/input.jsx";
import Button from "/src/components/elements/button/button.jsx";
import Logo from "/src/assets/logo/logo.svg?react";
import EyeIcon from "/src/assets/icons/eye.svg?react";
import EyeOffIcon from "/src/assets/icons/eye-off.svg?react";

function SignUpCard({ onClose, onLogin, onSignUpSuccess }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [defaultAddress, setDefaultAddress] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const clearError = (field) => {
        setErrors((current) => {
            const next = { ...current };
            delete next[field];
            return next;
        });
    };

    const handleSignUp = async () => {
        const nextErrors = {};
        const trimmedFullName = fullName.trim();
        const trimmedEmail = email.trim();
        const trimmedPhoneNumber = phoneNumber.trim();
        const trimmedAddress = defaultAddress.trim();

        if (!trimmedFullName) {
            nextErrors.fullName = "Full Name is required.";
        } else if (!/[A-Za-z]/.test(trimmedFullName)) {
            nextErrors.fullName = "Full Name must contain at least one letter.";
        }

        if (!trimmedEmail) {
            nextErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            nextErrors.email = "Enter a valid email address.";
        }

        if (!trimmedPhoneNumber) {
            nextErrors.phoneNumber = "Phone Number is required.";
        } else if (!/^\+639\d{9}$/.test(trimmedPhoneNumber)) {
            nextErrors.phoneNumber = "Phone Number must follow the format +639XXXXXXXXX.";
        }

        if (!password) {
            nextErrors.password = "Password is required.";
        } else if (password.length < 8) {
            nextErrors.password = "Password must be at least 8 characters long.";
        } else if (password.length > 72) {
            nextErrors.password = "Password must not exceed 72 characters.";
        } else if (!/[A-Za-z]/.test(password)) {
            nextErrors.password = "Password must contain at least one letter.";
        } else if (!/\d/.test(password)) {
            nextErrors.password = "Password must contain at least one number.";
        } else if (/\s/.test(password)) {
            nextErrors.password = "Password must not contain spaces.";
        }

        if (!confirmPassword) {
            nextErrors.confirmPassword = "Confirm Password is required.";
        } else if (password !== confirmPassword) {
            nextErrors.confirmPassword = "Passwords do not match.";
        }

        if (trimmedAddress && trimmedAddress.length < 2) {
            nextErrors.defaultAddress = "Delivery Address must contain at least 2 characters.";
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) return;

        try {
            const user = await signup({
                fullName,
                email,
                phoneNumber,
                password,
                defaultAddress: defaultAddress || undefined,
            });
            localStorage.setItem("currentUser", JSON.stringify(user.data.customer));
            localStorage.setItem("token", user.data.token);
            console.log("Signup successful:", user.data.customer.fullName);
            onSignUpSuccess?.(user);
            onClose?.();
        } catch (err) {
            setErrors({ form: err.message || "Sign up failed. Please try again." });
        }
    };

    return (
        <div className="signUpOverlay" onClick={onClose}>
            <div className="SignUpCard" onClick={(event) => event.stopPropagation()}>
                <div className="SignUpHandle"></div>
                <div className="SignUpLogo">
                    <Logo />
                    <span>Kopi Express</span>
                </div>
                <h1>Create Account</h1>
                <p className="SignUpDescription">Join us for easy ordering.</p>
                <label>Full Name *</label>
                <Input
                    type="text"
                    name="fullName"
                    placeholder="Juan Dela Cruz"
                    className={`SignUpInput${errors.fullName ? " SignUpInputError" : ""}`}
                    value={fullName}
                    onChange={(e) => {
                        setFullName(e.target.value);
                        clearError("fullName");
                        clearError("form");
                    }}
                />
                {errors.fullName && <p className="SignUpFieldError">{errors.fullName}</p>}
                <label>Email *</label>
                <Input
                    type="email"
                    name="email"
                    placeholder="juan@email.com"
                    className={`SignUpInput${errors.email ? " SignUpInputError" : ""}`}
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        clearError("email");
                        clearError("form");
                    }}
                />
                {errors.email && <p className="SignUpFieldError">{errors.email}</p>}
                <label>Phone Number *</label>
                <Input
                    type="tel"
                    name="phone"
                    placeholder="+639XXXXXXXXX"
                    className={`SignUpInput${errors.phoneNumber ? " SignUpInputError" : ""}`}
                    value={phoneNumber}
                    onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        clearError("phoneNumber");
                        clearError("form");
                    }}
                />
                {errors.phoneNumber && <p className="SignUpFieldError">{errors.phoneNumber}</p>}
                <label>Password *</label>
                <div className={`SignUpPasswordWrapper${errors.password ? " SignUpPasswordError" : ""}`}>
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••"
                        className="SignUpInput"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            clearError("password");
                            clearError("confirmPassword");
                            clearError("form");
                        }}
                    />
                    <button
                        type="button"
                        className="SignUpPasswordToggle"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                </div>
                {errors.password && <p className="SignUpFieldError">{errors.password}</p>}
                <label>Confirm Password *</label>
                <div className={`SignUpPasswordWrapper${errors.confirmPassword ? " SignUpPasswordError" : ""}`}>
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="••••••"
                        className="SignUpInput"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            clearError("confirmPassword");
                            clearError("form");
                        }}
                    />
                    <button
                        type="button"
                        className="SignUpPasswordToggle"
                        onClick={() => setShowConfirmPassword((current) => !current)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                        {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="SignUpFieldError">{errors.confirmPassword}</p>}
                <label>Delivery Address (optional)</label>
                <Input
                    type="text"
                    name="address"
                    placeholder="House no., street, barangay, Pandi, Bulacan"
                    className={`SignUpInput${errors.defaultAddress ? " SignUpInputError" : ""}`}
                    value={defaultAddress}
                    onChange={(e) => {
                        setDefaultAddress(e.target.value);
                        clearError("defaultAddress");
                        clearError("form");
                    }}
                />
                {errors.defaultAddress && <p className="SignUpFieldError">{errors.defaultAddress}</p>}
                <p className="DeliveryNote">
                    Delivery zones: Siling Bata, Poblacion, Bunsuran.
                </p>
                {errors.form && (
                    <p className="SignUpError" role="alert">
                        {errors.form}
                    </p>
                )}
                <Button
                    type="button"
                    className="CreateAccountButton"
                    onClick={handleSignUp}
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