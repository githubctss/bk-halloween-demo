import { CustomEventMap } from '@bk/entities';

export function dispatchEvent<T extends keyof CustomEventMap>(type: T, args: CustomEventMap[T] | undefined) {
  const event = new CustomEvent(type, { detail: args });

  return window.dispatchEvent(event);
}