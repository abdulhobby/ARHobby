// OrderTerms.jsx
import { FiFileText, FiCheck, FiAlertCircle, FiTruck, FiCreditCard, FiPackage, FiRefreshCw, FiGift } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const OrderTerms = ({ accepted, onAcceptChange }) => {
  const terms = [
    {
      icon: FiPackage,
      text: "All items are collectible currencies/coins sold as-is based on the described condition."
    },
    {
      icon: FiCreditCard,
      text: "Payment must be completed via bank transfer or UPI within 24 hours of placing the order."
    },
    {
      icon: FiAlertCircle,
      text: "After payment, send payment proof screenshot via WhatsApp for verification."
    },
    {
      icon: FiTruck,
      text: "Orders will be shipped via India Post within 2-3 business days after payment verification."
    },
    {
      icon: FiPackage,
      text: "Tracking number will be provided once the order is shipped."
    },
    {
      icon: FiRefreshCw,
      text: "Once an item has been shipped, returns will not be accepted. Please contact us immediately if there are any issues with your order. We will do our best to resolve any problems, but we cannot accept returns or cancellations after shipping."
    },
    {
      icon: FiGift,
      text: "Free shipping on orders above ₹1500."
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 sm:p-5 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-border-green/30">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
          <FiFileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-text-primary">Terms & Conditions</h3>
          <Link to="/terms-and-conditions" className="underline text-green-500 hover:text-green-600">
            View Full Terms
          </Link>
          <p className="text-xs sm:text-sm text-text-light">Please read carefully before placing order</p>
        </div>
      </div>

      {/* Terms List */}
      <div className="p-4 sm:p-5">
        <div className="space-y-3 mb-6 max-h-[300px] sm:max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
          {terms.map((term, index) => {
            const IconComponent = term.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-3 sm:p-4 bg-bg-secondary rounded-xl border border-border-light hover:border-primary-200 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <IconComponent className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="flex items-start gap-2 flex-1">
                  <span className="w-5 h-5 rounded-full bg-primary-100 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {term.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Acceptance Checkbox */}
        <div
          className={`p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 ${accepted
              ? 'bg-primary-50 border-primary'
              : 'bg-bg-secondary border-border-light hover:border-primary-300'
            }`}
        >
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => onAcceptChange(e.target.checked)}
              className="w-6 h-6 mt-0.5 cursor-pointer accent-primary rounded transition-all duration-300 hover:accent-primary-dark"
              aria-label="Accept terms and conditions"
            />
            <span className={`text-sm sm:text-base font-medium transition-colors select-none ${accepted ? 'text-primary-dark' : 'text-text-secondary'
              }`}>
              I have read and agree to the terms and conditions
            </span>
          </label>
        </div>

        {/* Warning if not accepted */}
        {!accepted && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg animate-fade-in">
            <FiAlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
            <p className="text-sm text-warning font-medium">
              Please accept the terms and conditions to proceed with your order
            </p>
          </div>
        )}

        {/* Success indicator when accepted */}
        {accepted && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-primary-50 border border-primary-200 rounded-lg animate-fade-in">
            <FiCheck className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm text-primary font-medium">
              You have accepted the terms and conditions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTerms;