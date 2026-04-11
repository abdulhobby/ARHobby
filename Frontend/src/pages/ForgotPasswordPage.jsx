// ForgotPasswordPage.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { forgotPassword, clearError, clearMessage } from '../features/auth/authSlice';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';
import { 
  FiMail, 
  FiArrowLeft, 
  FiSend, 
  FiCheckCircle,
  FiLock,
  FiShield
} from 'react-icons/fi';
import { GiCoinflip } from 'react-icons/gi';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
    if (message) { 
      toast.success(message); 
      dispatch(clearMessage()); 
      setSubmitted(true);
    }
  }, [error, message, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <SEO title="Forgot Password" />
      
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to Login Link */}
        <Link 
          to="/login"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors cursor-pointer group"
        >
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary/10 border border-white/50 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-primary to-primary-dark text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
              <FiLock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-primary-100 text-sm sm:text-base">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            {submitted ? (
              /* Success State */
              <div className="text-center py-6 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
                  <FiCheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-3">Check Your Email</h2>
                <p className="text-text-secondary mb-6">
                  We've sent a password reset link to <span className="font-semibold text-primary">{email}</span>
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-text-light">
                    Didn't receive the email? Check your spam folder or
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Try another email
                  </button>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2">
                    <FiMail className="w-4 h-4 text-primary" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3.5 pl-12 rounded-xl border border-border bg-white text-text-primary placeholder:text-text-light transition-all duration-300 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 group-hover:border-primary-300"
                    />
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light group-focus-within:text-primary transition-colors" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-white font-bold rounded-xl cursor-pointer transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Security Note */}
            <div className="mt-6 pt-6 border-t border-border-light">
              <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-xl">
                <FiShield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-text-secondary">
                    For security reasons, the reset link will expire in 1 hour. If you don't see the email, check your spam folder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <GiCoinflip className="w-5 h-5" />
            <span className="font-semibold">AR Hobby</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;