/**
 * Patched version of @radix-ui/react-compose-refs@1.1.2
 *
 * Fixes React 19 infinite loop caused by composeRefs being called inline
 * (not memoized) in SlotClone on every render.
 *
 * Root cause: SlotClone calls `composeRefs(forwardedRef, childrenRef)` inline,
 * creating a new ref callback each render. React 19 detects the identity change,
 * calls old ref with null + new ref with node. If any sub-ref triggers setState,
 * this re-renders → new composed ref → infinite loop.
 *
 * Fix: `composeRefs` returns a cached function when called with the same refs.
 * Since forwardedRef and childrenRef are typically stable across renders (ref
 * objects from forwardRef/useRef, or stable callbacks), the cache hit rate is
 * high and the composed ref identity stays stable, preventing the loop.
 *
 * Upstream: https://github.com/radix-ui/primitives/issues/3799
 * Remove this patch when @radix-ui/react-compose-refs ships a fix.
 */
import { useCallback } from 'react';

function setRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
}

// Cache composed ref functions keyed by first ref → Map<secondRef, composedFn>.
// For the common 2-ref case (SlotClone), this ensures the same composed function
// is returned when called with the same pair of refs.
const composeCache = new WeakMap();

function composeRefs(...refs) {
  // Fast path: single ref or no refs
  if (refs.length === 0) return () => {};
  if (refs.length === 1) return (node) => setRef(refs[0], node);

  // For 2+ refs, try to return a cached composed function.
  // Use the first ref as the outer WeakMap key.
  const first = refs[0];
  if (first != null && (typeof first === 'object' || typeof first === 'function')) {
    let innerMap = composeCache.get(first);
    if (!innerMap) {
      innerMap = new WeakMap();
      composeCache.set(first, innerMap);
    }
    // For 2-ref case (most common - SlotClone), use second ref as inner key.
    if (refs.length === 2) {
      const second = refs[1];
      if (second != null && (typeof second === 'object' || typeof second === 'function')) {
        let cached = innerMap.get(second);
        if (cached) return cached;
        cached = (node) => {
          setRef(first, node);
          setRef(second, node);
        };
        innerMap.set(second, cached);
        return cached;
      }
    }
  }

  // Fallback for non-cacheable refs (null, undefined, >2 refs)
  return (node) => refs.forEach((ref) => setRef(ref, node));
}

function useComposedRefs(...refs) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(composeRefs(...refs), refs);
}

export { composeRefs, useComposedRefs };
