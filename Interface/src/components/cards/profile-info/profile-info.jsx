import Input from '/src/components/elements/input/input.jsx';
import './profile-info.css';

export default function ProfileInformation({ profile, onChange }) {
  return (
    <div className="settingsCard">
      <h3 className="cardTitle">Profile Information</h3>

      <label className="fieldLabel">Full Name</label>
      <Input
        name="fullName"
        className="fieldInput"
        value={profile.fullName}
        onChange={onChange('fullName')}
      />

      <label className="fieldLabel">Email</label>
      <Input
        type="email"
        name="email"
        className="fieldInput"
        value={profile.email}
        onChange={onChange('email')}
      />

      <label className="fieldLabel">Phone</label>
      <Input
        type="tel"
        name="phone"
        className="fieldInput"
        value={profile.phone}
        onChange={onChange('phone')}
      />
    </div>
  );
}