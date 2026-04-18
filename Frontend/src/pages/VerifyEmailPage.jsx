import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyEmail, resendOtp, clearError, clearMessage } from '../features/auth/authSlice';
import toast from 'react-hot-toast';
import { FiMail, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import SEO from '../components/common/SEO';

const VerifyEmailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { verificationEmail, loading, error, message, isAuthenticated } = useSelector((state) => state.auth);
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get('email');
  const email = verificationEmail || emailFromQuery;

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (email) startTimer(30);
  }, [email]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  useEffect(() => {
    if (message) { toast.success(message); dispatch(clearMessage()); }
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [message, error, dispatch]);

  const startTimer = (seconds) => {
    setTimer(seconds);
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      inputRefs.current[5].focus();
    } else {
      toast.error('Please paste a valid 6-digit OTP');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return toast.error('Please enter the 6-digit OTP');
    if (!email) return toast.error('Email address is missing');
    dispatch(verifyEmail({ email, otp: otpCode }));
  };

  const handleResend = () => {
    if (!canResend) return;
    if (!email) return toast.error('Email address is missing');
    dispatch(resendOtp({ email })).then((res) => {
      if (!res.error) {
        startTimer(30);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
        toast.success('New OTP sent to your email');
      }
    });
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Missing Information</h1>
          <p className="text-gray-600 mb-6">We couldn't find your email address. Please register again.</p>
          <Link to="/register" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition inline-block">
            Back to Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 p-4">
      <SEO title="Verify Email" />
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
          <p className="text-primary-100 mt-2">We've sent a 6-digit code to</p>
          <p className="font-semibold mt-1">{email}</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={idx === 0 ? handlePaste : undefined}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-all shadow-lg shadow-primary/30 disabled:opacity-50"
            >
              {loading ? <><FiLoader className="w-5 h-5 animate-spin" /> Verifying...</> : <><FiCheckCircle className="w-5 h-5" /> Verify & Continue</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the code?{' '}
              {canResend ? (
                <button onClick={handleResend} disabled={loading} className="text-primary hover:text-primary-dark font-medium cursor-pointer">
                  Resend OTP
                </button>
              ) : (
                <span className="text-gray-400">Resend available in {timer}s</span>
              )}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link to="/login" className="text-sm text-gray-500 hover:text-primary transition-colors">← Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;