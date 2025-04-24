export const getLocalStorageVersion = (key: string) => {
  return [key, "v1"].join("-");
};
