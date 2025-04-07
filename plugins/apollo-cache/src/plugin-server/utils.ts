export const parseCookie = (str: string) =>
  str
    .split(";")
    .map((v) => v.split("="))
    .reduce(
      (acc, v) => {
        if (v) {
          acc[decodeURIComponent(v[0].trim())] =
            v[1] && decodeURIComponent(v[1].trim());
        }
        return acc;
      },
      {} as Record<string, string>,
    );
