import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true;
console.log("=== API DEBUG ===");
console.log("VITE_API_URL is:", import.meta.env.VITE_API_URL);
console.log("AXIOS BASE URL is:", axios.defaults.baseURL);
console.log("=================");

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
