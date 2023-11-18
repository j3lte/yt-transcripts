import { AbstractYoutubeTranscript, TranscriptConfig, TranscriptEntry } from "../lib/downloader.ts";
import { fetcher } from "./fetcher.ts";

export class YoutubeTranscript extends AbstractYoutubeTranscript {
  constructor(videoId: string, config?: TranscriptConfig) {
    super(videoId, config);
    // deno-lint-ignore no-explicit-any
    this.fetcher = fetcher as any;
  }
}

export type { TranscriptConfig, TranscriptEntry };
export * from "../lib/error.ts";
