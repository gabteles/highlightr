import HighlightStore from '../data/HighlightStore';
import OpenAIAPI from '../data/OpenAIAPI';

export default function SaveOpenAIKeyCommand(payload: { key: string }) {
  OpenAIAPI.isValidKey(payload.key).then((isValid) => {
    HighlightStore.config.bulkPut([
      { name: 'openai-key', value: payload.key },
      { name: 'valid', value: isValid },
     ]);
  });
}
