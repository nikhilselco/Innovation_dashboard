const URL_PATTERN = /https?:\/\/\S+/;

export function extractUrl(value) {
  if (typeof value !== "string") return null;

  const match = value.match(URL_PATTERN);
  return match ? match[0] : null;
}
