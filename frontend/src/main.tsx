import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProviderWrapper } from './contexts/ThemeContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProviderWrapper>
      <App />
    </ThemeProviderWrapper>
  </React.StrictMode>
);