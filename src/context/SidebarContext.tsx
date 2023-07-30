import { createContext, useCallback, useMemo, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

type ContextType = {
  isOpen: boolean;
  open: () => void;
  toggle: () => void;
};

const SidebarContext = createContext<ContextType>({
  isOpen: false,
  open: () => {},
  toggle: () => {},
});

export default SidebarContext;

export function SidebarContextProvider({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => { setIsOpen(true); }, [setIsOpen]);
  const close = useCallback(() => { setIsOpen(false); }, [setIsOpen]);
  const toggle = useCallback(() => { setIsOpen((prev) => !prev); }, [setIsOpen]);

  const value = useMemo(() => ({
    isOpen,
    open,
    close,
    toggle,
  }), [isOpen, open, close, toggle]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}
