export default function clearHighlightMarks() {
  const highlightNodes = document.querySelectorAll(`[data-highlight-id]`);
  for (const highlightNode of highlightNodes) {
    const parent = highlightNode.parentNode;
    if (!parent) continue;

    const textNode = document.createTextNode(highlightNode.textContent || '');
    parent.insertBefore(textNode, highlightNode);
    highlightNode.remove();
    parent.normalize();
  }
}
