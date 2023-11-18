// deno-lint-ignore-file no-explicit-any

import { TranscriptConfig } from "./downloader.ts";
import { generateNonce } from "./nonce.ts";

type RequestData = {
  context: {
    client: {
      hl?: string;
      gl?: string;
      visitorData: string;
      userAgent: string;
      clientName: string;
      clientVersion: string;
      osName: string;
      osVersion: string;
      browserName: string;
      browserVersion: string;
      screenWidthPoints: number;
      screenHeightPoints: number;
      screenPixelDensity: number;
      utcOffsetMinutes: number;
      userInterfaceTheme: string;
      connectionType: string;
    };
    request: {
      sessionId: string;
      internalExperimentFlags: any[];
      consistencyTokenJars: any[];
    };
    user: Record<string | number | symbol, never>;
    clientScreenNonce: string;
    clickTracking: {
      clickTrackingParams: string;
    };
  };
  params: string;
};

export const generateRequest = (page: string, config?: TranscriptConfig): RequestData => {
  const params = page.split('"serializedShareEntity":"')[1]?.split('"')[0];
  const visitorData = page.split('"VISITOR_DATA":"')[1]?.split('"')[0];
  const sessionId = page.split('"sessionId":"')[1]?.split('"')[0];
  const clientVersion = page.split('"interfaceVersion":"')[1]?.split('"')[0];
  const userInterfaceTheme = page.split('"userInterfaceTheme":"')[1]?.split('"')[0];
  const clickTrackingParams = page
    ?.split('"clickTrackingParams":"')[1]
    ?.split('"')[0];
  const data: RequestData = {
    context: {
      client: {
        visitorData,
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)",
        clientName: "WEB",
        clientVersion: clientVersion ?? "2.20200925.01.00",
        osName: "Macintosh",
        osVersion: "10_15_4",
        browserName: "Chrome",
        browserVersion: "85.0f.4183.83",
        screenWidthPoints: 1440,
        screenHeightPoints: 770,
        screenPixelDensity: 2,
        utcOffsetMinutes: 120,
        userInterfaceTheme: userInterfaceTheme ?? "USER_INTERFACE_THEME_LIGHT",
        connectionType: "CONN_CELLULAR_3G",
      },
      request: {
        sessionId,
        internalExperimentFlags: [],
        consistencyTokenJars: [],
      },
      user: {},
      clientScreenNonce: generateNonce(),
      clickTracking: {
        clickTrackingParams,
      },
    },
    params,
  };

  if (config?.lang) {
    data.context.client.hl = config.lang;
  }

  if (config?.country) {
    data.context.client.gl = config.country;
  }

  return data;
};
