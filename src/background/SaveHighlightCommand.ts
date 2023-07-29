import HighlightStore from '../data/HighlightStore';
import { Highlight } from '../types/Highlight';

export default function SaveHighlightCommand(payload: { highlight: Highlight }) {
  HighlightStore.highlights.add(payload.highlight);
}
