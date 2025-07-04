import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Import the i18n configuration
import './i18n.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the App component in Suspense for i18next */}
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  </React.StrictMode>,
)
