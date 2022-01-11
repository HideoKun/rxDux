import { useLayoutEffect } from 'react';

export const useSubscribe = (
  observable,
  subscribeFunc: (...args: any[]) => any,
  dependencies: any[] = []
): void => {
  useLayoutEffect(() => {
    const subscription = observable.subscribe(subscribeFunc);

    return () => subscription.unsubscribe();
  }, dependencies);
};
