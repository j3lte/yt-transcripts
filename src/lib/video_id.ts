const RE_YOUTUBE =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

export const getVideoId = (urlOrId: string): string | null => {
  if (urlOrId.length === 11) return urlOrId;
  const match = urlOrId.match(RE_YOUTUBE);
  return match ? match[1] : null;
};
