// ErrorBoundary.jsx
import { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Admin Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            {/* Error Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-black/10 rounded-full mx-auto mb-6">
              <FiAlertTriangle className="w-8 h-8 text-black" />
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Something went wrong
            </h1>

            {/* Error Message */}
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Admin panel encountered an error. Don't worry, your data is safe. 
              Please refresh the page to continue.
            </p>

            {/* Refresh Button */}
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg group"
            >
              <FiRefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Refresh Page
            </button>

            {/* Additional Help */}
            <p className="text-xs text-gray-500 mt-6">
              If the problem persists, please contact support
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;