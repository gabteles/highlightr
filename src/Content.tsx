import React from 'react';
import ReactDOM from 'react-dom/client';
import HighlightController from './components/HighlightController';
import { PageHighlightsProvider } from './context/PageHighlightsContext';
import { SidebarContextProvider } from './context/SidebarContext';
import { ConfigProvider } from './context/ConfigContext';

const root = document.createElement("div")
document.body.appendChild(root)
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ConfigProvider>
      <PageHighlightsProvider>
        <SidebarContextProvider>
          <HighlightController />
        </SidebarContextProvider>
      </PageHighlightsProvider>
    </ConfigProvider>
  </React.StrictMode>
);
