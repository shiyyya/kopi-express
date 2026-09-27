import { Outlet, Link } from "react-router";
import "./App.css";
import { signup, login } from "./api/auth.api";

function App() {
    // async function handleSignup() {
    //     const user = await signup({
    //         fullName: "Beday, Shine",
    //         email: "bedaybeday@gmail.com",
    //         phoneNumber: "+639123456789",
    //         defaultAddress: "sa bahay nila", // Optional
    //         password: "strawberry123",
    //         confirmPassword: "strawberry123"
    //     })

    //     console.log(user);
    //     console.log(user.data.customer.fullName);
    // }

    // async function handleLogin() {
    //     const user = await login({
    //         email: "tuazonkobe@gmail.com",
    //         password: "bikolangs5623"
    //     })

    //     console.log(user);
    //     console.log(user.data.account.fullName);
    // }

    return (
        <div>

            {/* <button onClick={handleSignup}>Sign Up</button>
            <button onClick={handleLogin}>Login</button> */}

            <div>
                <Outlet />
            </div>


            {/* <Link to="store-locator">Store Locator</Link><br />
            <Link to="settings">Settings</Link><br />
            <Link to="order-status">Order Status</Link><br />
            <Link to="order-history">Order History</Link><br />
            <Link to="place-order">Place Order</Link><br />
            <Link to="delivery-eligibility">Delivery Eligibility</Link><br />
            <Link to="login">Login</Link><br />
            <Link to="signup">Sign Up</Link><br />
            <Link to="qr-payment">QR Payment</Link><br />
            <Link to="payment-confirmation">Payment Confirmation</Link><br />
            <Link to="walk-in">Walk-in</Link><br />
            <Link to="inventory">Inventory</Link><br /> */}
        </div>
    );
}

export default App;