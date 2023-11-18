export const fetcher = (url: string, init: RequestInit = {}, proxy?: string): Promise<Response> => {
  if (proxy) {
    return fetch(url, {
      ...init,
      client: Deno.createHttpClient({
        proxy: { url: proxy },
      }),
    });
  }
  return fetch(url, init);
};
