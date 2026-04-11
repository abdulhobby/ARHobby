import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { store } from './app/store.js';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          
          {/* Toast Notifications with Custom Styling */}
          <Toaster 
            position="top-right"
            toastOptions={{
              // Default options for all toasts
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#111827',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                fontWeight: '500',
              },
              
              // Custom success toast
              success: {
                duration: 3000,
                style: {
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #86efac',
                },
                iconTheme: {
                  primary: '#16a34a',
                  secondary: '#ffffff',
                },
              },
              
              // Custom error toast
              error: {
                duration: 5000,
                style: {
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                },
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#ffffff',
                },
              },
              
              // Custom loading toast
              loading: {
                style: {
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #86efac',
                },
              },
            }}
            containerStyle={{
              top: 80, // Below the header
              right: 16,
            }}
            gutter={12}
          />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);