import { useState } from "react";
import "./delivery-eligibility.css";
import Input from "/src/components/elements/input/input.jsx";
import Button from "/src/components/elements/button/button.jsx";
import PinIcon from "/src/assets/icons/location.svg?react";
import CheckCircleIcon from "/src/assets/icons/check-circle.svg?react";
import AlertIcon from "/src/assets/icons/alert.svg?react";
import { apiFetch } from "/src/api/client.js";

export default function DeliveryEligibility() {
    const [barangay, setBarangay] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setBarangay(e.target.value);
        setResult(null);
    };

    const handleCheck = async () => {
        const query = barangay.trim();
        if (!query || loading) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await apiFetch(
                `/delivery/eligibility?address=${encodeURIComponent(query)}`
            );
            setResult(response.data?.eligible ? "eligible" : "ineligible");
        } catch (error) {
            console.error("Failed to check delivery eligibility:", error);
            setResult("ineligible");
        } finally {
            setLoading(false);
        }
    };

    const ResultIcon = result === "eligible" ? CheckCircleIcon : AlertIcon;

    return (
        <div className="eligibilityCard">
            <div className="eligibilityTitleRow">
                <PinIcon className="titleIcon" />
                <h2>Check Delivery Eligibility</h2>
            </div>
            <p className="eligibilitySubtext">
                Enter your barangay or address to check if we can deliver to you.
            </p>
            <div className="eligibilityForm">
                <Input
                    value={barangay}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                    placeholder="e.g. Cacarong Bata, Pandi, Bulacan"
                    className="eligibilityInput"
                />
                <Button
                    type="button"
                    onClick={handleCheck}
                    className="eligibilityButton"
                    disabled={loading}
                >
                    {loading ? "Checking..." : "Check"}
                </Button>
            </div>
            {result && (
                <div className={`eligibilityResult ${result}`}>
                    <ResultIcon className="resultIcon" />
                    <div>
                        <p className="eligibilityResultTitle">
                            {result === "eligible"
                                ? "We deliver to your area!"
                                : "Sorry, not in our delivery zone yet."}
                        </p>
                        <p className="eligibilityResultSubtitle">
                            {result === "eligible"
                                ? "Delivery fee: ₱50.00"
                                : "Self-pickup is available for everyone!"}
                        </p>
                    </div>
                </div>
            )}
            <div className="zonesSection">
                <p className="zonesLabel">Delivery Zone:</p>
                <div className="zonesList">
                    <span className="zoneTag">All barangays in Pandi, Bulacan</span>
                </div>
            </div>
        </div>
    );
}