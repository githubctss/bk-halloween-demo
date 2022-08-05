import { useEffect, DependencyList } from 'react';
import { CustomEventMap, CustomListener } from '@bk/entities';

import { dispatchEvent } from './dispatchEvent';

export function useEvent<T extends keyof CustomEventMap>(
  type: T,
  listener: CustomListener<T>,
  deps: DependencyList,
): (detail: CustomEventMap[T]) => boolean {
  useEffect(() => {
    const frozen = (ev: CustomEvent<CustomEventMap[T]>) => listener(ev.detail);

    window.addEventListener(type, frozen);

    return () => {
      window.removeEventListener(type, frozen);
    }
  }, [type, listener, ...deps]);

  return detail => dispatchEvent(type, detail);
}