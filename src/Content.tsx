import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HighlightController from './components/HighlightController';

const root = document.createElement("div")
document.body.appendChild(root)
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <HighlightController />
  </React.StrictMode>
);
