import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-secondary flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="bg-bg-primary rounded-2xl shadow-2xl p-8 sm:p-12 max-w-lg w-full text-center border border-border-light">
            {/* Error Icon */}
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-error"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
              Something went wrong
            </h1>

            <p className="text-text-secondary text-sm sm:text-base mb-8 leading-relaxed">
              We are sorry for the inconvenience. Please try refreshing the page.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark 
                           text-text-white font-semibold py-3 px-6 rounded-lg cursor-pointer 
                           transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl 
                           transform hover:-translate-y-0.5 text-sm sm:text-base
                           focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Page
              </button>

              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.href = '/';
                }}
                className="inline-flex items-center justify-center gap-2 bg-bg-primary 
                           border-2 border-primary text-primary hover:bg-primary-50 
                           font-semibold py-3 px-6 rounded-lg cursor-pointer 
                           transition-all duration-300 ease-in-out shadow-md hover:shadow-lg 
                           transform hover:-translate-y-0.5 text-sm sm:text-base
                           focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
                  />
                </svg>
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;