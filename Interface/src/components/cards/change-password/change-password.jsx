import Input from '/src/components/elements/input/input.jsx';
import Button from '/src/components/elements/button/button.jsx';
import EyeIcon from '/src/assets/icons/eye.svg?react';
import EyeOffIcon from '/src/assets/icons/eye-off.svg?react';
import './change-password.css';

const FIELDS = [
  { key: 'current', label: 'Current Password', name: 'currentPassword', autoComplete: 'current-password' },
  { key: 'next', label: 'New Password', name: 'newPassword', autoComplete: 'new-password' },
  { key: 'confirm', label: 'Confirm New Password', name: 'confirmPassword', autoComplete: 'new-password' },
];

export default function ChangePassword({
  password,
  showPassword,
  passwordError,
  onChange,
  onToggleShow,
}) {
  return (
    <div className="settingsCard">
      <h3 className="cardTitle">Change Password</h3>

      {FIELDS.map(({ key, label, name, autoComplete }) => (
        <div key={key}>
          <label className="fieldLabel">{label}</label>
          <div className="passwordInputWrap">
            <Input
              type={showPassword[key] ? 'text' : 'password'}
              name={name}
              className="fieldInput"
              value={password[key]}
              onChange={onChange(key)}
              autoComplete={autoComplete}
            />
            <Button
              className="passwordToggleBtn"
              onClick={onToggleShow(key)}
              aria-label={showPassword[key] ? 'Hide password' : 'Show password'}
            >
              {showPassword[key] ? (
                <EyeIcon className="passwordToggleIcon" />
              ) : (
                <EyeOffIcon className="passwordToggleIcon" />
              )}
            </Button>
          </div>
        </div>
      ))}

      {passwordError && <p className="passwordError">{passwordError}</p>}
    </div>
  );
}