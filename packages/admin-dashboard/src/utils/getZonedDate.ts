export const getZonedDate = (date: Date | string): Date => {
  const _date = new Date(date);
  const timezoneOffsetInMs = _date.getTimezoneOffset() * 60000;

  return new Date(_date.getTime() + timezoneOffsetInMs);
};
