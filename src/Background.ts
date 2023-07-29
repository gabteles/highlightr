import Demux from './util/communication/Demux';
import SaveHighlightCommand from './background/SaveHighlightCommand';
import PageHighlightsSubscription from './background/PageHighlightsSubscription';

// Temporary
import HighlightStore from './data/HighlightStore';
HighlightStore.highlights.clear();

const commPort = new Demux({
  commands: {
    'save-highlight': SaveHighlightCommand,
  },
  subscriptions: {
    'page-highlights': PageHighlightsSubscription,
  },
});

commPort.listen();
export {}
