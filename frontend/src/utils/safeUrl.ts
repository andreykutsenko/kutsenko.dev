export const safeUrl = (url: string): string =>
  /^https?:\/\//i.test(url) ? url : '#';
