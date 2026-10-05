import { useState, useCallback } from 'react';
import { createContext, useContext } from 'react';

const EnquiryCtx = createContext({ open: null, openEnquiry: () => {} });

export const useEnquiryModal = () => useContext(EnquiryCtx);

export function EnquiryProvider({ children }) {
  const [state, setState] = useState({ open: false, business: null, item: null });

  const openEnquiry = useCallback((business, item) => setState({ open: true, business: business || null, item: item || null }), []);
  const close = useCallback(() => setState(s => ({ ...s, open: false })), []);

  return (
    <EnquiryCtx.Provider value={{ open: state.open, business: state.business, item: state.item, openEnquiry, close }}>
      {children}
    </EnquiryCtx.Provider>
  );
}