import { AbstractYoutubeTranscript, TranscriptConfig, TranscriptEntry } from "../lib/downloader.ts";
import { Fetcher } from "./fetcher.ts";

export class YoutubeTranscript extends AbstractYoutubeTranscript {
  constructor(videoId: string, config?: TranscriptConfig) {
    super(videoId, config);
    const fetcher = new Fetcher(config?.proxy);
    // deno-lint-ignore no-explicit-any
    this.fetcher = fetcher.fetch.bind(fetcher) as any;
  }
}

export type { TranscriptConfig, TranscriptEntry };
export * from "../lib/error.ts";
