/**
 * Updates or adds an element in an array based on a predicate.
 * If an element matching the predicate exists, replaces it.
 * Otherwise, adds the element to the end.
 *
 * Standalone array utility used by EntityCustomFields
 * and several admin components.
 *
 * @example
 * ```ts
 * const items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
 *
 * // Replace matching element
 * setInArrayBy(items, (item) => item.id === 2, { id: 2, name: 'Updated' });
 * // => [{ id: 1, name: 'A' }, { id: 2, name: 'Updated' }]
 *
 * // Add when no match
 * setInArrayBy(items, (item) => item.id === 3, { id: 3, name: 'C' });
 * // => [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }]
 * ```
 */
export function setInArrayBy<T>(
  list: T[],
  predicate: (item: T) => boolean,
  element: T,
): T[] {
  const index = list.findIndex(predicate);
  if (index === -1) {
    return [...list, element];
  }
  const newList = [...list];
  newList[index] = element;
  return newList;
}
