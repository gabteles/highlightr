import PageSummary from '../PageSummary';
import Highlighter from '../Highlighter';
import HighlightMarkers from '../HighlightMarkers';
import { PageHighlightsProvider } from '../../context/PageHighlightsContext';

export default function HighlightController() {
  return (
    <PageHighlightsProvider>
      <HighlightMarkers />
      <Highlighter />
      <PageSummary />
    </PageHighlightsProvider>
  );
}
