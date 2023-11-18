import { AbstractYoutubeTranscript, TranscriptConfig, TranscriptEntry } from "../lib/downloader.ts";
import { Fetcher } from "./fetcher.ts";

export class YoutubeTranscript extends AbstractYoutubeTranscript {
  constructor(videoId: string, config?: TranscriptConfig) {
    super(videoId, config);
    const fetcher = new Fetcher(config?.proxy);
    this.fetcher = fetcher.fetch.bind(fetcher);
  }
}

export type { TranscriptConfig, TranscriptEntry };
export * from "../lib/error.ts";
