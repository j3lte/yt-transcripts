export class Fetcher {
  private client: Deno.HttpClient | null = null;

  constructor(proxy?: string) {
    if (proxy) {
      this.client = Deno.createHttpClient({
        proxy: { url: proxy },
      });
    }
  }

  fetch(url: string, init?: RequestInit): Promise<Response> {
    if (this.client) {
      return fetch(url, {
        ...init,
        client: this.client,
      });
    }
    return fetch(url, init);
  }
}
