export function getGqlError(err: unknown) {
  if (typeof err !== 'object' || !('errors' in err!) || !Array.isArray(err.errors)) return '';
  return err.errors[0]?.message;
}
