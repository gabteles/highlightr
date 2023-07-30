import Sidebar from '../Sidebar';
import Highlighter from '../Highlighter';
import HighlightMarkers from '../HighlightMarkers';
import { PageHighlightsProvider } from '../../context/PageHighlightsContext';
import { SidebarContextProvider } from '../../context/SidebarContext';

export default function HighlightController() {
  return (
    <PageHighlightsProvider>
      <SidebarContextProvider>
        <HighlightMarkers />
        <Highlighter />
        <Sidebar />
      </SidebarContextProvider>
    </PageHighlightsProvider>
  );
}
