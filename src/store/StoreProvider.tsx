import React, { createContext, useContext, ReactNode } from 'react';
import rootStore, { RootStore } from './RootStore'; 

const StoreContext = createContext<RootStore | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  );
};

export const useStores = (): RootStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('sad');
  }
  return store;
};