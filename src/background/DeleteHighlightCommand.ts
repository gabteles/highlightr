import IndexedDbStore from '../data/IndexedDbStore';

export default function DeleteHighlightCommand(payload: { highlightId: string }) {
  IndexedDbStore.highlights.delete(payload.highlightId);
}
