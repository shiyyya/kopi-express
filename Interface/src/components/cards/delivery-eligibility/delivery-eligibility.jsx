import { useState } from 'react';
import './delivery-eligibility.css';
import Input from '/src/components/elements/input/input.jsx';
import Button from '/src/components/elements/button/button.jsx';
import PinIcon from '/src/assets/icons/location.svg?react';
import CheckCircleIcon from '/src/assets/icons/check-circle.svg?react';
import AlertIcon from '/src/assets/icons/alert.svg?react';

const DELIVERY_ZONES = ['Siling Bata', 'Poblacion', 'Bunsuran', 'San Roque', 'Siling Matanda'];

const normalize = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/^(brgy\.?|barangay)\s+/i, '')
    .replace(/\s+/g, ' ');

export default function DeliveryEligibility() {
  const [barangay, setBarangay] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setBarangay(e.target.value);
    setResult(null);
  };

  const handleCheck = () => {
    const query = normalize(barangay);
    if (!query) return setResult(null);

    const eligible = DELIVERY_ZONES.some((zone) => normalize(zone) === query);
    setResult(eligible ? 'eligible' : 'ineligible');
  };

  const ResultIcon = result === 'eligible' ? CheckCircleIcon : AlertIcon;

  return (
    <div className="eligibilityCard">
      <div className="eligibilityTitleRow">
        <PinIcon className="titleIcon" />
        <h2>Check Delivery Eligibility</h2>
      </div>
      <p className="eligibilitySubtext">Enter your barangay to check if we can deliver to you.</p>

      <div className="eligibilityForm">
        <Input
          value={barangay}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          placeholder="e.g. Poblacion, Pandi, Bulacan"
          className="eligibilityInput"
        />
        <Button type="button" onClick={handleCheck} className="eligibilityButton">
          Check
        </Button>
      </div>

      {result && (
        <div className={`eligibilityResult ${result}`}>
          <ResultIcon className="resultIcon" />
          <div>
            <p className="eligibilityResultTitle">
              {result === 'eligible' ? 'We deliver to your area!' : 'Sorry, not in our delivery zone yet.'}
            </p>
            <p className="eligibilityResultSubtitle">
              {result === 'eligible' ? 'Delivery fee: ₱50.00' : 'Self-pickup is available for everyone!'}
            </p>
          </div>
        </div>
      )}

      <div className="zonesSection">
        <p className="zonesLabel">Delivery Zones:</p>
        <div className="zonesList">
          {DELIVERY_ZONES.map((zone) => (
            <span key={zone} className="zoneTag">{zone}</span>
          ))}
        </div>
      </div>
    </div>
  );
}