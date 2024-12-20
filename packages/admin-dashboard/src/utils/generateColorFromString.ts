export function generateColorFromString(name: string): string {
  const hashCode = (str: string): number => {
    return str.split('').reduce((hash, char) => {
      return char.charCodeAt(0) + ((hash << 5) - hash);
    }, 0);
  };

  const hashToHex = (hash: number): string => {
    const r = (hash & 0xff0000) >> 16;
    const g = (hash & 0x00ff00) >> 8;
    const b = hash & 0x0000ff;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const hash = hashCode(name);
  return hashToHex(hash);
}
