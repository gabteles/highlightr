import { act, render } from '@testing-library/react';
import { useContext } from 'react';
import SidebarContext, { SidebarContextProvider } from './SidebarContext';
jest.mock('../hooks/useHighlightStore');

describe('SidebarContext', () => {
  it('provides is closed at first', () => {
    let result: any;
    const TestElem = () => {
      result = useContext(SidebarContext);
      return <></>
    };

    render(
      <SidebarContextProvider>
        <TestElem />
      </SidebarContextProvider>
    )

    expect(result.isOpen).toEqual(false);
  });

  it('opens the sidebar', () => {
    let result: any;
    const TestElem = () => {
      result = useContext(SidebarContext);
      return <></>
    };

    render(
      <SidebarContextProvider>
        <TestElem />
      </SidebarContextProvider>
    )

    act(() => { result.open(); });
    expect(result.isOpen).toEqual(true);
  });

  it('closes the sidebar', () => {
    let result: any;
    const TestElem = () => {
      result = useContext(SidebarContext);
      return <></>
    };

    render(
      <SidebarContextProvider>
        <TestElem />
      </SidebarContextProvider>
    )

    act(() => { result.close(); });
    expect(result.isOpen).toEqual(false);
  });

  it('toggles the sidebar', () => {
    let result: any;
    const TestElem = () => {
      result = useContext(SidebarContext);
      return <></>
    };

    render(
      <SidebarContextProvider>
        <TestElem />
      </SidebarContextProvider>
    )

    act(() => { result.toggle(); });
    expect(result.isOpen).toEqual(true);

    act(() => { result.toggle(); });
    expect(result.isOpen).toEqual(false);
  });
});
