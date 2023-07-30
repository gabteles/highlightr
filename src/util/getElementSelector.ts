// From an DOM element, get a query to that DOM element
export default function getElementSelector(element: HTMLElement | Node | null): string {
  if (!element) return '';
  if ((element as HTMLElement).id) return `#${CSS.escape((element as HTMLElement).id)}`;
  if ((element as HTMLElement).localName === 'html') return 'html';

  const parent = element.parentNode as Node;
  const parentSelector = getElementSelector(parent);
  const siblings = Array.from(parent.childNodes) as (HTMLElement | Node)[];
  const localName = (element as HTMLElement).localName;

  // Element is a text node
  if (!localName) {
    const index = siblings.filter((sib) => sib.nodeType === Node.TEXT_NODE).indexOf(element);
    return `${parentSelector}>textNode:nth-of-type(${index + 1})`;
  }

  const index = siblings.filter((sib) => (sib as HTMLElement).localName === localName).indexOf(element) + 1;
  return `${parentSelector}>${localName}:nth-of-type(${index})`;
}
