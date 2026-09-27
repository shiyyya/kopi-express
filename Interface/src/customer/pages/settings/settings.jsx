import { useState } from 'react';
import './settings.css';
import Header from '/src/components/blocks/header-wback/header-wback.jsx';
import ProfileInformation from '/src/components/cards/profile-info/profile-info.jsx';
import SavedAddresses from '/src/components/cards/saved-addresses/saved-addresses.jsx';
import ChangePassword from '/src/components/cards/change-password/change-password.jsx';
import Button from '/src/components/elements/button/button.jsx';

const INITIAL_PROFILE = {
  fullName: 'Primo Morandarte',
  email: '',
  phone: '',
};

const INITIAL_ADDRESSES = ['Siling Bata, Pandi, Bulacan'];

export default function Settings() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [savedProfile, setSavedProfile] = useState(INITIAL_PROFILE);

  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [savedAddresses, setSavedAddresses] = useState(INITIAL_ADDRESSES);

  const [password, setPassword] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const handleProfileChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePasswordChange = (field) => (e) => {
    setPassword((prev) => ({ ...prev, [field]: e.target.value }));
    setPasswordError('');
  };

  const toggleShowPassword = (field) => () => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleAddAddress = (address) => {
    setAddresses((prev) => [...prev, address]);
  };

  const handleRemoveAddress = (index) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const validatePassword = () => {
    if (!password.current || !password.next || !password.confirm) {
      return 'All password fields are required.';
    }
    if (password.next.length < 8) {
      return 'New password must be at least 8 characters.';
    }
    if (password.next !== password.confirm) {
      return 'New password and confirmation do not match.';
    }
    return '';
  };

  const isProfileChanged =
    JSON.stringify(profile) !== JSON.stringify(savedProfile);
  const isAddressesChanged =
    JSON.stringify(addresses) !== JSON.stringify(savedAddresses);
  const isPasswordChanged =
    password.current || password.next || password.confirm;

  const hasChanges = isProfileChanged || isAddressesChanged || isPasswordChanged;

  const handleSave = () => {
    if (isPasswordChanged) {
      const error = validatePassword();
      if (error) {
        setPasswordError(error);
        return;
      }
    }

    const payload = {
      profile,
      addresses,
      ...(isPasswordChanged && {
        currentPassword: password.current,
        newPassword: password.next,
      }),
    };
    console.log('Saving settings:', payload);

    setSavedProfile(profile);
    setSavedAddresses(addresses);
    setPassword({ current: '', next: '', confirm: '' });
    setPasswordError('');
    setShowPassword({ current: false, next: false, confirm: false });
  };

  return (
    <div className="settingsPage">
      <Header title="Settings" />

      <div className="settingsContainer">
        <ProfileInformation profile={profile} onChange={handleProfileChange} />

        <SavedAddresses
          addresses={addresses}
          onAdd={handleAddAddress}
          onRemove={handleRemoveAddress}
        />

        <ChangePassword
          password={password}
          showPassword={showPassword}
          passwordError={passwordError}
          onChange={handlePasswordChange}
          onToggleShow={toggleShowPassword}
        />

        <Button
          className="saveChangesBtn"
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}