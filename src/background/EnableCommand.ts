import IndexedDbStore from '../data/IndexedDbStore';

export default async function EnableCommand(payload: { enabled: boolean }) {
  IndexedDbStore.config.put({ name: 'enabled', value: payload.enabled, updatedAt: Date.now() });
}
