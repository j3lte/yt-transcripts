import node_fetch, { RequestInit, Response } from "npm:node-fetch@3.3.2";
import { HttpsProxyAgent } from "npm:https-proxy-agent@7.0.2";

export const fetcher = (url: string, init: RequestInit = {}, proxy?: string): Promise<Response> => {
  if (proxy) {
    const agent = new HttpsProxyAgent(proxy);
    return node_fetch(url, {
      ...init,
      agent,
    });
  }
  return node_fetch(url, init);
};

export type { Response };
