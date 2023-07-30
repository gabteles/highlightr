function robustQuerySelector(query: string) {
  try {
    return document.querySelector(query);
  } catch (error) {
    let element: Element | Node | null = document;

    for (const queryPart of query.split(">")) {
      if (!element) return null;

      const re = /^(.*):nth-of-type\(([0-9]+)\)$/ui;
      const result = re.exec(queryPart);
      const tagName = result?.[1] ?? queryPart;
      const index = result?.[2] ? parseInt(result?.[2], 10) : 1;

      element = Array.from(element.childNodes)
        .filter((child) => (child as Element).localName === tagName)
        .at(index - 1) ?? null;
    }

    return element;
  }
}

export default function elementFromQuery(query: string): Element | Node | null {
  const re = />textNode:nth-of-type\(([0-9]+)\)$/ui;
  const result = re.exec(query);

  // For text nodes, nth-of-type needs to be handled differently (not a valid CSS selector)
  if (!result) return robustQuerySelector(query);

  const textNodeIndex = parseInt(result[1], 10) - 1;
  const parent = robustQuerySelector(query.replace(re, ""));
  return Array.from(parent?.childNodes || []).filter((n) => n.nodeType === Node.TEXT_NODE).at(textNodeIndex) ?? null;
}
