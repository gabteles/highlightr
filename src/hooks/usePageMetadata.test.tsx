import React from 'react';
import { renderHook, render } from '@testing-library/react';
import usePageMetadata from './usePageMetadata';

describe('usePageMetadata', () => {
  it('gets the canonical URL', () => {
    render(<link rel="canonical" href="https://foobar.local/baz" />);
    const { result } = renderHook(() => usePageMetadata());
    expect(result.current.canonical).toBe('https://foobar.local/baz');
  });

  it('falls back to the current URL when canonical is not present', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: 'https://foobar.local/baz2' }
    });

    const { result } = renderHook(() => usePageMetadata());
    expect(result.current.canonical).toBe('https://foobar.local/baz2');
  });

  it('gets the page title from og:title', () => {
    render(<meta property="og:title" content="Foo Bar Baz" />);
    const { result } = renderHook(() => usePageMetadata());
    expect(result.current.title).toBe('Foo Bar Baz');
  });

  it('falls back to the page title from the title tag when og:title is not present', () => {
    render(<title>Foo Bar Baz</title>);
    const { result } = renderHook(() => usePageMetadata());
    expect(result.current.title).toBe('Foo Bar Baz');
  });

  it('gets the page image from og:image', () => {
    render(<meta property="og:image" content="https://foobar.local/baz.png" />);
    const { result } = renderHook(() => usePageMetadata());
    expect(result.current.image).toBe('https://foobar.local/baz.png');
  });
});
