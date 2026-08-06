
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Suppress warnings and debug logs for production release
const originalWarn = console.warn;
const originalLog = console.log;

console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes("KaTeX doesn't work in quirks mode")) {
    return;
  }
  originalWarn(...args);
};

// Optional: clean up console for public users if desired, or keep for debugging
// console.log = () => {}; 

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
