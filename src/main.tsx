//src/main.tsx
// src/main.tsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// The Redux imports have been removed.
// import { Provider } from 'react-redux';
// import { store } from './redux/store';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* The <Provider> wrapper has been removed */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);