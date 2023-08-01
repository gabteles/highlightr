import React from 'react';
import ReactDOM from 'react-dom/client';
import Config from './components/Config';
import { ConfigProvider } from './context/ConfigContext';

const root = document.createElement("div")
document.body.appendChild(root)
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <div style={{ width: 400 }}>
      <ConfigProvider>
        <Config onSetup={() => window.close()} />
      </ConfigProvider>
    </div>
  </React.StrictMode>
);
