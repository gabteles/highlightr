import React from 'react';
import ReactDOM from 'react-dom/client';
import HighlightrElements from './components/HighlightrElements';
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
          <HighlightrElements />
        </SidebarContextProvider>
      </PageHighlightsProvider>
    </ConfigProvider>
  </React.StrictMode>
);
