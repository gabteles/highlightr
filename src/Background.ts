import Demux from './util/communication/Demux';
import SaveHighlightCommand from './background/SaveHighlightCommand';
import PageHighlightsSubscription from './background/PageHighlightsSubscription';
import SaveOpenAIKeyCommand from './background/SaveOpenAIKeyCommand';
import GetConfigSubscription from './background/GetConfigSubscription';
import PageSummarySubscription from './background/PageSummarySubscription';

// Temporary
import HighlightStore from './data/HighlightStore';
HighlightStore.highlights.clear();

const commPort = new Demux({
  commands: {
    'save-highlight': SaveHighlightCommand,
    'set-openai-key': SaveOpenAIKeyCommand,
  },
  subscriptions: {
    'page-highlights': PageHighlightsSubscription,
    'get-config': GetConfigSubscription,
    'page-summary': PageSummarySubscription,
  },
});

commPort.listen();
export {}
