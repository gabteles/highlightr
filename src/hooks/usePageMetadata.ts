import { useEffect, useState } from 'react';

type Return = {
  canonical: string;
  title: string | undefined;
  image: string | undefined;
}

export default function usePageMetadata(): Return {
  const [value, setValue] = useState<Return>({
    canonical: '',
    title: undefined,
    image: undefined,
  });

  // TODO: This is a naive implementation. Correct one would observe the tags and update the state.
  useEffect(() => {
    const linkElements = document.getElementsByTagName('link');
    const metaElements = document.getElementsByTagName('meta');

    const canonical = Array.from(linkElements)
      .find((link) => link.getAttribute('rel') === 'canonical')
      ?.getAttribute('href') ?? window.location.href;
    const title = Array.from(metaElements)
      .find((meta) => meta.getAttribute('property') === 'og:title')
      ?.getAttribute('content') ?? document.title;
    const image = Array.from(metaElements)
      .find((meta) => meta.getAttribute('property') === 'og:image')
      ?.getAttribute('content') ?? undefined;

    setValue({ canonical, title, image });
  }, []);

  return value;
}
