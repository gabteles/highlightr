import { act, render } from '@testing-library/react';
import { useContext } from 'react';
import SidebarContext, { SidebarContextProvider } from './SidebarContext';
jest.mock('../hooks/useHighlightStore');

describe('SidebarContext', () => {
  const getContext = () => {
    let result: { current: any } = { current: undefined };
    const TestElem = () => {
      result.current = useContext(SidebarContext);
      return <></>
    };

    render(
      <SidebarContextProvider>
        <TestElem />
      </SidebarContextProvider>
    )

    return result;
  }

  it('provides is closed at first', () => {
    const result = getContext();
    expect(result.current.isOpen).toEqual(false);
  });

  it('opens the sidebar', () => {
    const result = getContext();
    act(() => { result.current.open(); });
    expect(result.current.isOpen).toEqual(true);
  });

  it('closes the sidebar', () => {
    const result = getContext();
    act(() => { result.current.close(); });
    expect(result.current.isOpen).toEqual(false);
  });

  it('toggles the sidebar', () => {
    const result = getContext();

    act(() => { result.current.toggle(); });
    expect(result.current.isOpen).toEqual(true);

    act(() => { result.current.toggle(); });
    expect(result.current.isOpen).toEqual(false);
  });
});
