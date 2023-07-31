import Sidebar from '../Sidebar';
import Highlighter from '../Highlighter';
import HighlightMarkers from '../HighlightMarkers';
import { PageHighlightsProvider } from '../../context/PageHighlightsContext';
import { SidebarContextProvider } from '../../context/SidebarContext';
import { ConfigProvider } from '../../context/ConfigContext';

export default function HighlightController() {
  return (
    <ConfigProvider>
      <PageHighlightsProvider>
        <SidebarContextProvider>
          <HighlightMarkers />
          <Highlighter />
          <Sidebar />
        </SidebarContextProvider>
      </PageHighlightsProvider>
    </ConfigProvider>
  );
}
