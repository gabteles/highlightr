export default function debounce<T extends Function>(cb: T, wait = 20) {
  let h: NodeJS.Timeout;

  return (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };
}
