export function deepSortArray(array: any[]): any[] {
  return array
    .map((item) => {
      if (typeof item === "object" && !Array.isArray(item) && item !== null) {
        return Object.keys(item)
          .sort()
          .reduce((acc, key) => {
            acc[key] = Array.isArray(item[key])
              ? deepSortArray(item[key])
              : item[key];
            return acc;
          }, {} as any);
      }
      return item;
    })
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}
