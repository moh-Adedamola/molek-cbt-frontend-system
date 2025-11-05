import { useState } from 'react';
import { User, Lock, Mail, Phone, Save, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import { useAuthStore } from '../../store/authStore';
import { userService } from '../../api/services';

const TeacherProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [alert, setAlert] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [submitting, setSubmitting] = useState(false);

  // Profile form
  const [profileData, setProfileData] = useState({
    fullName: user?.full_name || user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone_number || user?.phoneNumber || '',
  });
  const [profileErrors, setProfileErrors] = useState({});

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const showAlert = (type, message) => {
    setAlert({ type, message });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateProfile = () => {
    const errors = {};

    if (!profileData.fullName) errors.fullName = 'Full name is required';
    if (!profileData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Email is invalid';
    }
    if (profileData.phone && !/^[0-9+\-\s()]+$/.test(profileData.phone)) {
      errors.phone = 'Phone number is invalid';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!validateProfile()) return;

    try {
      setSubmitting(true);

      const payload = {
        full_name: profileData.fullName,
        email: profileData.email,
        phone_number: profileData.phone || null,
      };

      await userService.update(user.userId || user.id, payload);

      // Update local user state
      updateUser({
        ...user,
        full_name: profileData.fullName,
        fullName: profileData.fullName,
        email: profileData.email,
        phone_number: profileData.phone,
        phoneNumber: profileData.phone,
      });

      showAlert('success', 'Profile updated successfully');
    } catch (error) {
      showAlert('error', error.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      setSubmitting(true);

      await userService.changePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });

      showAlert('success', 'Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      showAlert('error', error.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Alert */}
      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-600">Manage your personal information and security</p>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
            {(user?.full_name || user?.fullName || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.full_name || user?.fullName || 'Teacher'}
            </h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <p className="mt-1 text-sm">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                Teacher
              </span>
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="mr-2 inline h-4 w-4" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'password'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Lock className="mr-2 inline h-4 w-4" />
              Change Password
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
            <Input
              label="Full Name"
              value={profileData.fullName}
              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              error={profileErrors.fullName}
              placeholder="Enter your full name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              error={profileErrors.email}
              placeholder="your.email@school.com"
              required
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              error={profileErrors.phone}
              placeholder="+234 800 000 0000"
            />

            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> If you change your email address, you'll need to verify it
                before you can log in with the new email.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setProfileData({
                    fullName: user?.full_name || user?.fullName || '',
                    email: user?.email || '',
                    phone: user?.phone_number || user?.phoneNumber || '',
                  });
                  setProfileErrors({});
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className={`input-field pr-10 ${
                    passwordErrors.currentPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className={`input-field pr-10 ${
                    passwordErrors.newPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className={`input-field pr-10 ${
                    passwordErrors.confirmPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            <div className="rounded-lg bg-yellow-50 p-4">
              <h4 className="font-medium text-yellow-900">Password Requirements:</h4>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-yellow-800">
                <li>At least 8 characters long</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include at least one number</li>
                <li>Include at least one special character</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                  setPasswordErrors({});
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Additional Info */}
      <div className="card bg-gray-50">
        <h3 className="mb-3 font-semibold text-gray-900">Account Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">User ID</p>
            <p className="font-medium text-gray-900">{user?.userId || user?.id || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600">Role</p>
            <p className="font-medium text-gray-900">Teacher</p>
          </div>
          <div>
            <p className="text-gray-600">Account Status</p>
            <p className="font-medium text-green-600">Active</p>
          </div>
          <div>
            <p className="text-gray-600">Member Since</p>
            <p className="font-medium text-gray-900">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;