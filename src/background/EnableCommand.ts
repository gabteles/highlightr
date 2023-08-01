import HighlightStore from '../data/HighlightStore';

export default async function EnableCommand(payload: { enabled: boolean }) {
  HighlightStore.config.put({ name: 'enabled', value: payload.enabled, updatedAt: Date.now() });
}
