import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearError } from '../features/auth/authSlice';
import SEO from '../components/common/SEO';
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheck,
  FiLoader,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      setIsSuccess(true);
      toast.success('Password reset successfully');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // ✅ FIXED: Pass confirmPassword to dispatch
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // ✅ Dispatch with confirmPassword
    dispatch(resetPassword({
      token,
      password,
      confirmPassword
    }));
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

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword && password === confirmPassword;

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-bg-secondary 
                    flex items-center justify-center p-4">
        <SEO title="Password Reset Successful" />

        <div className="w-full max-w-md text-center">
          {/* Success Animation */}
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-success to-primary rounded-full 
                          flex items-center justify-center shadow-2xl shadow-success/30 animate-pulse-green">
              <FiCheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-success/20 animate-ping"></div>
          </div>

          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Password Reset <span className="text-primary">Successful!</span>
          </h1>
          <p className="text-text-secondary mb-8">
            Your password has been changed. Redirecting you to the homepage...
          </p>

          <div className="flex items-center justify-center gap-2 text-primary">
            <FiLoader className="w-5 h-5 animate-spin" />
            <span>Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-bg-secondary 
                  flex items-center justify-center p-4">
      <SEO title="Reset Password" />

      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h2 className="text-2xl font-bold text-primary">AR Hobby</h2>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-border p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl 
                          flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
              <FiShield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Reset Password</h1>
            <p className="text-text-secondary mt-2">
              Create a new secure password for your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border bg-white
                           text-text-primary placeholder:text-text-light transition-all duration-300
                           focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light 
                           hover:text-text-primary transition-colors duration-300 cursor-pointer"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
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

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl border bg-white
                           text-text-primary placeholder:text-text-light transition-all duration-300
                           focus:outline-none focus:ring-3
                           ${confirmPassword
                      ? passwordsMatch
                        ? 'border-success focus:border-success focus:ring-success/20'
                        : 'border-error focus:border-error focus:ring-error/20'
                      : 'border-border focus:border-primary focus:ring-primary/20'
                    }`}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light 
                           hover:text-text-primary transition-colors duration-300 cursor-pointer"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>

                {/* Match Indicator */}
                {confirmPassword && passwordsMatch && (
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 text-success">
                    <FiCheck className="w-5 h-5" />
                  </div>
                )}
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="text-error text-sm mt-1.5 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-bg-secondary rounded-xl p-4">
              <h4 className="text-sm font-medium text-text-primary mb-3">Password Requirements:</h4>
              <ul className="space-y-2">
                {[
                  { check: password.length >= 6, text: 'At least 6 characters' },
                  { check: /[a-z]/.test(password) && /[A-Z]/.test(password), text: 'Upper & lowercase letters' },
                  { check: /\d/.test(password), text: 'At least one number' },
                  { check: /[^a-zA-Z0-9]/.test(password), text: 'At least one special character' },
                ].map((req, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                                  ${req.check ? 'bg-success text-white' : 'bg-border'}`}>
                      {req.check && <FiCheck className="w-3 h-3" />}
                    </div>
                    <span className={req.check ? 'text-text-primary' : 'text-text-light'}>
                      {req.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !passwordsMatch || password.length < 6}
              className="w-full flex items-center justify-center gap-2 py-4 px-6
                       bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold
                       transition-all duration-300 cursor-pointer shadow-lg shadow-primary/30
                       hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                       active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  Reset Password
                  <FiArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-text-secondary hover:text-primary font-medium transition-colors duration-300"
            >
              ← Back to Login
            </Link>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-sm text-text-light mt-6 flex items-center justify-center gap-2">
          <FiShield className="w-4 h-4" />
          Your password is encrypted and secure
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;