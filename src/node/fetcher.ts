import node_fetch, { RequestInit, Response } from "npm:node-fetch@3.3.2";
import { HttpsProxyAgent } from "npm:https-proxy-agent@7.0.2";

export type { Response };

export class Fetcher {
  private agent: HttpsProxyAgent<string> | null = null;

  constructor(proxy?: string) {
    if (proxy) {
      this.agent = new HttpsProxyAgent(proxy);
    }
  }

  fetch(url: string, init?: RequestInit): Promise<Response> {
    if (this.agent) {
      return node_fetch(url, {
        ...init,
        agent: this.agent,
      });
    }
    return node_fetch(url, init);
  }
}
