export function camelCaseToSpaces(input: string | undefined): string {
  if (!input) return '';
  const spaced = input.replace(/([a-z])([A-Z])/g, '$1 $2');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}
