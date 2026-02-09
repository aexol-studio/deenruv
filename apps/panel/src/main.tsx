import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@deenruv/admin-dashboard/dist/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Suspense
    fallback={
      <div className="flex h-screen w-full items-center justify-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
        </div>
      </div>
    }
  >
    <App />
  </React.Suspense>,
);
