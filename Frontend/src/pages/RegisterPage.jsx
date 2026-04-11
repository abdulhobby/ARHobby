import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../features/auth/authSlice';
import SEO from '../components/common/SEO';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiPhone, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight,
  FiCheck,
  FiLoader,
  FiShield,
  FiGift,
  FiTruck,
  FiAward
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    phone: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) { 
      toast.error(error); 
      dispatch(clearError()); 
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast.error('Please agree to the Terms & Conditions');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    dispatch(register({ 
      name: formData.name, 
      email: formData.email, 
      password: formData.password, 
      phone: formData.phone 
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

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

  const benefits = [
    { icon: FiGift, title: 'Exclusive Offers', description: 'Get special discounts on rare collectibles' },
    { icon: FiTruck, title: 'Free Shipping', description: 'Free delivery on orders above ₹500' },
    { icon: FiShield, title: 'Secure Shopping', description: '100% authentic products guaranteed' },
    { icon: FiAward, title: 'Loyalty Rewards', description: 'Earn points on every purchase' },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary flex">
      <SEO title="Create Account" />
      
      {/* Left Side - Benefits (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
          {/* Logo */}
          <Link to="/" className="mb-12">
            <h2 className="text-3xl font-bold">AR Hobby</h2>
          </Link>
          
          {/* Welcome Text */}
          <div className="mb-12">
            <h1 className="text-4xl xl:text-5xl font-bold mb-4">
              Start Your Collection Journey
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Join thousands of collectors who trust AR Hobby for authentic coins, 
              notes, and stamps. Create your account today and unlock exclusive benefits.
            </p>
          </div>
          
          {/* Benefits */}
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{benefit.title}</h3>
                  <p className="text-white/70 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
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
                <FiUser className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Create Account</h1>
              <p className="text-text-secondary mt-2">Join AR Hobby to start collecting</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Full Name <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white
                             text-text-primary placeholder:text-text-light transition-all duration-300
                             focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white
                             text-text-primary placeholder:text-text-light transition-all duration-300
                             focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Phone Number <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-border bg-white
                             text-text-primary placeholder:text-text-light transition-all duration-300
                             focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border bg-white
                             text-text-primary placeholder:text-text-light transition-all duration-300
                             focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
                    placeholder="Create a password"
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
                
                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-secondary">Password strength</span>
                      <span className={`font-medium ${
                        passwordStrength.strength >= 4 ? 'text-success' : 
                        passwordStrength.strength >= 3 ? 'text-warning' : 'text-error'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength.strength ? passwordStrength.color : 'bg-border'
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
                  Confirm Password <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border bg-white
                             text-text-primary placeholder:text-text-light transition-all duration-300
                             focus:outline-none focus:ring-3
                             ${formData.confirmPassword 
                               ? passwordsMatch 
                                 ? 'border-success focus:border-success focus:ring-success/20'
                                 : 'border-error focus:border-error focus:ring-error/20'
                               : 'border-border focus:border-primary focus:ring-primary/20'
                             }`}
                    placeholder="Confirm your password"
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
                  {formData.confirmPassword && (
                    <div className={`absolute right-12 top-1/2 -translate-y-1/2 ${
                      passwordsMatch ? 'text-success' : 'text-error'
                    }`}>
                      {passwordsMatch ? <FiCheck className="w-5 h-5" /> : null}
                    </div>
                  )}
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-error text-xs mt-1.5">Passwords do not match</p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 rounded border-border text-primary 
                           focus:ring-primary/20 cursor-pointer mt-0.5"
                />
                <label htmlFor="terms" className="text-sm text-text-secondary cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:text-primary-dark font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:text-primary-dark font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !agreedToTerms}
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-text-light">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-4 px-6
                       bg-bg-secondary hover:bg-border text-text-primary rounded-xl font-semibold
                       transition-all duration-300 cursor-pointer border border-border
                       hover:border-primary/30"
            >
              Sign In Instead
            </Link>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-text-light mt-6">
            By creating an account, you agree to receive updates and promotional 
            emails from AR Hobby.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;