import HighlightStore from '../data/HighlightStore';
import OpenAIAPI from '../data/OpenAIAPI';

export default async function SaveOpenAIKeyCommand(payload: { key: string }) {
  await OpenAIAPI.isValidKey(payload.key).then((isValid) => {
    HighlightStore.config.bulkPut([
      { name: 'openai-key', value: payload.key, updatedAt: Date.now() },
      { name: 'valid', value: isValid, updatedAt: Date.now() },
     ]);
  });
}
