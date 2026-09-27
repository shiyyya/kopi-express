import { useEffect, useState } from 'react';
import './settings.css';
import Header from '/src/components/blocks/header-wback/header-wback.jsx';
import ProfileInformation from '/src/components/cards/profile-info/profile-info.jsx';
import SavedAddresses from '/src/components/cards/saved-addresses/saved-addresses.jsx';
import ChangePassword from '/src/components/cards/change-password/change-password.jsx';
import Button from '/src/components/elements/button/button.jsx';
import {getProfile,updateProfile,addAddress as addAddressApi,removeAddress as removeAddressApi,} from '/src/api/customer.api.js';

export default function Settings() {
  const [profile, setProfile] = useState({ fullName: '', email: '', phone: '' });
  const [savedProfile, setSavedProfile] = useState({ fullName: '', email: '', phone: '' });

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [password, setPassword] = useState({ current: '', next: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState({ current: false, next: false, confirm: false });
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getProfile();
        const loadedProfile = {
          fullName: res.data.customer.fullName,
          email: res.data.user.email,
          phone: res.data.customer.phoneNumber,
        };
        setProfile(loadedProfile);
        setSavedProfile(loadedProfile);
        setAddresses(res.data.addresses);
      } catch (err) {
        setLoadError(err.message || 'Failed to load settings.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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

  const handleAddAddress = async (address) => {
    try {
      const res = await addAddressApi(address);
      setAddresses((prev) => [...prev, res.data.customerAddress]);
    } catch (err) {
      setSaveError(err.message || 'Failed to add address.');
    }
  };

  const handleRemoveAddress = async (id) => {
    try {
      await removeAddressApi(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (err) {
      setSaveError(err.message || 'Failed to remove address.');
    }
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

  const isProfileChanged = JSON.stringify(profile) !== JSON.stringify(savedProfile);
  const isPasswordChanged = password.current || password.next || password.confirm;
  const hasChanges = isProfileChanged || isPasswordChanged;

  const handleSave = async () => {
    setSaveError('');

    if (isPasswordChanged) {
      const error = validatePassword();
      if (error) {
        setPasswordError(error);
        return;
      }
    }

    const payload = {};
    if (profile.fullName !== savedProfile.fullName) payload.fullName = profile.fullName;
    if (profile.email !== savedProfile.email) payload.email = profile.email;
    if (profile.phone !== savedProfile.phone) payload.phoneNumber = profile.phone;
    if (isPasswordChanged) {
      payload.currentPassword = password.current;
      payload.password = password.next;
    }

    setSaving(true);
    try {
      await updateProfile(payload);
      setSavedProfile(profile);
      setPassword({ current: '', next: '', confirm: '' });
      setShowPassword({ current: false, next: false, confirm: false });
    } catch (err) {
      setSaveError(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settingsPage">
        <Header title="Settings" />
        <div className="settingsContainer">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settingsPage">
      <Header title="Settings" />

      <div className="settingsContainer">
        {loadError && <p className="SettingsError" role="alert">{loadError}</p>}

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

        {saveError && <p className="SettingsError" role="alert">{saveError}</p>}

        <Button
          className="saveChangesBtn"
          onClick={handleSave}
          disabled={!hasChanges || saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}