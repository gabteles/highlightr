import HighlightStore from '../data/HighlightStore';

export default function DeleteHighlightCommand(payload: { highlightId: string }) {
  HighlightStore.highlights.delete(payload.highlightId);
}
