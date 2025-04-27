import React from 'react';

interface IDestroyable {
  destroy?(): void;
}

export const useLocalStore = <T extends IDestroyable>(creator: () => T): T => {

  const storeRef = React.useRef<T | null>(null);

  if (storeRef.current === null) {
    storeRef.current = creator();
  }

  React.useEffect(() => {
    return () => {
      storeRef.current?.destroy?.();
       console.log('Local store destroyed');
    };
  }, []);

  return storeRef.current;
};