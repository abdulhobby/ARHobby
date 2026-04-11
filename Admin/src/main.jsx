// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { store } from './app/store.js';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import './index.css';

// const basename = import.meta.env.MODE === 'production' ? '/admin' : '/';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              // Default options
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1f2937',
                padding: '12px 16px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                fontWeight: '500',
              },
              // Success style
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#000',
                  secondary: '#fff',
                },
                style: {
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #86efac',
                },
              },
              // Error style
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#fff',
                },
                style: {
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fca5a5',
                },
              },
              // Loading style
              loading: {
                iconTheme: {
                  primary: '#000',
                  secondary: '#fff',
                },
                style: {
                  background: '#f9fafb',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                },
              },
            }}
          />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);