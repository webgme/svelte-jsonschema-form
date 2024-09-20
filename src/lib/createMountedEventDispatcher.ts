import { createEventDispatcher, onMount } from 'svelte';

type EventDispatcher<EventMap extends {} = any> = ReturnType<typeof createEventDispatcher<EventMap>>;
type EventDispatcherhArgs<EventMap extends {} = any> = Parameters<EventDispatcher<EventMap>>;

/**
 * Created an event dispatcher with Svelte's `createEventDispatcher` that will queue events until the component is mounted.
 */
export default function createMountedEventDispatcher<EventMap extends {} = any>(): EventDispatcher<EventMap> {
  let mounted = false;
  const dispatchOnMount: EventDispatcherhArgs<any>[] = [];
  const dispatch = createEventDispatcher();

  onMount(() => {
    mounted = true;
    dispatchOnMount.forEach(args => {
      dispatch.call(null, ...args);
    });
  });

  return (...args: EventDispatcherhArgs<any>) => {
    if (mounted) {
      return dispatch.call(null, ...args);
    }
    else {
      dispatchOnMount.push(args);
      return false;
    }
  };
}