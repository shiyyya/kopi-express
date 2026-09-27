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
    const [error, setError] = useState("");

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
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
            setError(err.message || "Sign up failed. Please try again.");
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
                    className="SignUpInput"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setError(""); }}
                />

                <label>Email *</label>
                <Input
                    type="email"
                    name="email"
                    placeholder="juan@email.com"
                    className="SignUpInput"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                />

                <label>Phone Number *</label>
                <Input
                    type="tel"
                    name="phone"
                    placeholder="+639XXXXXXXXX"
                    className="SignUpInput"
                    value={phoneNumber}
                    onChange={(e) => { setPhoneNumber(e.target.value); setError(""); }}
                />

                <label>Password *</label>
                <div className="SignUpPasswordWrapper">
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••"
                        className="SignUpInput"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
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

                <label>Confirm Password *</label>
                <div className="SignUpPasswordWrapper">
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="••••••"
                        className="SignUpInput"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
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

                <label>Delivery Address (optional)</label>
                <Input
                    type="text"
                    name="address"
                    placeholder="House no., street, barangay, Pandi, Bulacan"
                    className="SignUpInput"
                    value={defaultAddress}
                    onChange={(e) => setDefaultAddress(e.target.value)}
                />
                <p className="DeliveryNote">
                    Delivery zones: Siling Bata, Poblacion, Bunsuran.
                </p>

                {error && (
                    <p className="SignUpError" role="alert">
                        {error}
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