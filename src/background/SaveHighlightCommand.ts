import IndexedDbStore from '../data/IndexedDbStore';
import { Highlight } from '../types/Highlight';

export default function SaveHighlightCommand(payload: { highlight: Highlight }) {
  IndexedDbStore.highlights.add(payload.highlight);
}
