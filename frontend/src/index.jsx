import React from 'react';
import ReactDOM from 'react-dom/client'; // Sử dụng react-dom/client
import { Provider } from 'react-redux';

import './index.css';
import "./styles/globals.css";
import store from './redux/store';

import App from './App';

// Tìm phần tử gốc trong HTML
const rootElement = document.getElementById('root');

// Sử dụng createRoot thay cho ReactDOM.render
const root = ReactDOM.createRoot(rootElement);

// Render ứng dụng
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
