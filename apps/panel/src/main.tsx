import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@deenruv/admin-dashboard/src/root.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Suspense fallback="Loading...">
    <App />
  </React.Suspense>,
);
