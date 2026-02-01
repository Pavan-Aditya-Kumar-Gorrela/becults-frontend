import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// Note: StrictMode is commented out because it causes double execution of effects
// in development, which breaks OAuth flows with single-use authorization codes.
// StrictMode is useful for development but interferes with OAuth callback handling.
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

