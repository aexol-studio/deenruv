export const stripHtmlTags = (htmlString: string) => {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, '');
};
