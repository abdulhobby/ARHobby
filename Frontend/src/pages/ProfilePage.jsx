import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, updatePassword, updateAvatar, clearError, clearMessage } from '../features/auth/authSlice';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import SEO from '../components/common/SEO';
import {
  FiCamera,
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheck,
  FiLoader,
  FiEdit3
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error, message } = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', phone: user.phone || '' });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
      setIsEditingProfile(false);
    }
  }, [error, message, dispatch]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileData));
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    dispatch(updatePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }));
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('avatar', file);
      dispatch(updateAvatar(formData));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', 'bg-error', 'bg-warning', 'bg-warning', 'bg-success', 'bg-success'];

    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="bg-bg-secondary py-5">
      <SEO title="My Profile" />

      {/* Page Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl 
                          flex items-center justify-center shadow-lg shadow-primary/20">
              <FiUser className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My Profile</h1>
              <p className="text-text-secondary mt-1">Manage your account settings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <ProfileSidebar />
            </div>
          </aside>

          {/* Profile Content */}
          <main className="flex-1 min-w-0 space-y-8">

            {/* Avatar Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-bg-secondary/50">
                <h2 className="text-lg font-bold text-text-primary">Profile Photo</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Avatar */}
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 
                                  to-primary-200 border-4 border-white shadow-xl">
                      {avatarPreview || user?.avatar?.url ? (
                        <img
                          src={avatarPreview || user.avatar.url}
                          alt={user?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl font-bold text-primary">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Upload Button Overlay */}
                    <label className="absolute inset-0 flex items-center justify-center rounded-2xl
                                    bg-secondary/60 opacity-0 group-hover:opacity-100 
                                    transition-opacity duration-300 cursor-pointer">
                      <div className="flex flex-col items-center text-white">
                        <FiCamera className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Change</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Avatar Info */}
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold text-text-primary">{user?.name}</h3>
                    <p className="text-text-secondary">{user?.email}</p>
                    <p className="text-sm text-text-light mt-2">
                      Recommended: Square image, at least 200x200px
                    </p>
                    <label className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-primary/10 
                                    text-primary rounded-lg font-medium text-sm cursor-pointer
                                    hover:bg-primary/20 transition-colors duration-300">
                      <FiCamera className="w-4 h-4" />
                      Upload New Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-bg-secondary/50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <FiUser className="w-5 h-5 text-primary" />
                  Personal Information
                </h2>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary
                             hover:bg-primary/10 rounded-lg transition-colors duration-300 cursor-pointer"
                  >
                    <FiEdit3 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditingProfile}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all duration-300
                               ${isEditingProfile
                          ? 'border-border bg-white focus:border-primary focus:ring-3 focus:ring-primary/20'
                          : 'border-transparent bg-bg-secondary text-text-primary cursor-not-allowed'
                        }
                               focus:outline-none`}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email Field (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-transparent 
                               bg-bg-secondary text-text-secondary cursor-not-allowed"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-primary/10 
                                   text-primary text-xs font-medium rounded">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-text-light mt-1.5">
                    Email cannot be changed. Contact support for assistance.
                  </p>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditingProfile}
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all duration-300
                               ${isEditingProfile
                          ? 'border-border bg-white focus:border-primary focus:ring-3 focus:ring-primary/20'
                          : 'border-transparent bg-bg-secondary text-text-primary cursor-not-allowed'
                        }
                               focus:outline-none`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditingProfile && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6
                               bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold
                               transition-all duration-300 cursor-pointer shadow-lg shadow-primary/30
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <FiLoader className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiCheck className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileData({ name: user?.name || '', phone: user?.phone || '' });
                      }}
                      className="flex-1 py-3.5 px-6 bg-bg-secondary hover:bg-border text-text-primary
                               rounded-xl font-semibold transition-all duration-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-bg-secondary/50">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <FiShield className="w-5 h-5 text-primary" />
                  Change Password
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Ensure your account is using a strong password
                </p>
              </div>

              <form onSubmit={handlePasswordUpdate} className="p-6 space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border bg-white
                               text-text-primary placeholder:text-text-light transition-all duration-300
                               focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light 
                               hover:text-text-primary transition-colors duration-300 cursor-pointer"
                    >
                      {showPasswords.current ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border bg-white
                               text-text-primary placeholder:text-text-light transition-all duration-300
                               focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light 
                               hover:text-text-primary transition-colors duration-300 cursor-pointer"
                    >
                      {showPasswords.new ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {passwordData.newPassword && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-text-secondary">Password strength</span>
                        <span className={`font-medium ${passwordStrength.strength >= 4 ? 'text-success' :
                            passwordStrength.strength >= 3 ? 'text-warning' : 'text-error'
                          }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.strength ? passwordStrength.color : 'bg-border'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full pl-12 pr-12 py-3.5 rounded-xl border bg-white
                               text-text-primary placeholder:text-text-light transition-all duration-300
                               focus:outline-none focus:ring-3
                               ${passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword
                          ? 'border-error focus:border-error focus:ring-error/20'
                          : 'border-border focus:border-primary focus:ring-primary/20'
                        }`}
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light 
                               hover:text-text-primary transition-colors duration-300 cursor-pointer"
                    >
                      {showPasswords.confirm ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordData.confirmPassword && passwordData.confirmPassword !== passwordData.newPassword && (
                    <p className="text-error text-sm mt-1.5">Passwords do not match</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword ||
                      passwordData.newPassword !== passwordData.confirmPassword}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8
                             bg-secondary hover:bg-secondary-light text-white rounded-xl font-semibold
                             transition-all duration-300 cursor-pointer shadow-lg shadow-secondary/20
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <FiLoader className="w-5 h-5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiShield className="w-5 h-5" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Security Tips */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary/20">
              <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <FiShield className="w-5 h-5 text-primary" />
                Security Tips
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <FiCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  Use a combination of letters, numbers, and special characters
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  Avoid using personal information in your password
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  Change your password regularly for better security
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  Never share your password with anyone
                </li>
              </ul>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;