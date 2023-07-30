import { Highlight } from '../../types/Highlight';
import elementFromQuery from '../../util/elementFromQuery';

function isTextNode(node: Node): node is Text {
  return node.nodeType === Node.TEXT_NODE;
}

type HighlightConfig = {
  highlight: Highlight;
  container?: Node;
  startFound?: boolean;
  charsHighlighted?: number;
};

export default function markHighlight(config: HighlightConfig): [boolean, number] {
  const { highlight } = config;
  const container = 'container' in config ? config.container : elementFromQuery(highlight.container);
  if (!container) return [false, 0];

  const selectionLength = highlight.text.length;

  let startFound = config.startFound ?? false;
  let charsHighlighted = config.charsHighlighted ?? 0;

  const anchorNode = elementFromQuery(highlight.anchorNode);
  const focusNode = elementFromQuery(highlight.focusNode);

  const contents = container.nodeType === Node.TEXT_NODE ? [container] : Array.from(container.childNodes);
  for (const element of contents) {
    if (charsHighlighted >= selectionLength) continue;

    if (!isTextNode(element)) {
      const htmlElement = element as HTMLElement;
      const cssVisible = getComputedStyle(htmlElement).visibility !== 'hidden';
      const htmlVisible = !!(htmlElement.offsetWidth || htmlElement.offsetHeight || htmlElement.getClientRects().length);
      const visible = cssVisible && htmlVisible;

      if (visible) {
        [startFound, charsHighlighted] = markHighlight({
          ...config,
          container: element,
          startFound,
          charsHighlighted,
        });
      }

      continue;
    }

    let startIndex = 0;
    if (!startFound) {
      if (anchorNode !== element && focusNode !== element) continue;

      startFound = true;
      startIndex = Math.min(...[
        ...(anchorNode === element ? [highlight.anchorOffset] : []),
        ...(focusNode === element ? [highlight.focusOffset] : []),
      ]);
    }

    const nodeValue = element.nodeValue || '';
    const parent = element.parentNode;

    if (startIndex > nodeValue.length) {
      // TODO: Throw?
      throw new Error('startIndex is greater than the nodeValue length');
    }

    const highlightTextEl = element.splitText(startIndex);

    let i = startIndex;
    for (; i < nodeValue.length; i++) {
      // Skip any whitespace characters in the selection string as there can be more than in the text node:
      while (charsHighlighted < selectionLength && highlight.text[charsHighlighted].match(/\s/u))
        charsHighlighted++;

      if (charsHighlighted >= selectionLength) break;

      const char = nodeValue[i];
      if (char === highlight.text[charsHighlighted]) {
        charsHighlighted++;
      } else if (!char.match(/\s/u)) { // FIXME: Here, this is where the issue happens
        // Similarly, if the char in the text node is a whitespace, ignore any differences
        // Otherwise, we can't find the highlight text; throw an error
        throw new Error(`No match found for highlight string '${highlight.text}'`);
      }
    }

    const elementCharCount = i - startIndex; // Number of chars to highlight in this particular element
    const insertBeforeElement = highlightTextEl.splitText(elementCharCount);
    const highlightText = highlightTextEl.nodeValue;

    // If the text is all whitespace, ignore it
    if (highlightText?.match(/^\s*$/u)) {
      parent?.normalize(); // Undo any 'splitText' operations
      continue;
    }

    const highlightNode = document.createElement('span');
    highlightNode.dataset.highlightId = highlight.uuid;
    highlightNode.textContent = highlightTextEl.nodeValue;
    parent?.insertBefore(highlightNode, insertBeforeElement);
    highlightTextEl.remove();
  }

  return [startFound, charsHighlighted];
}
