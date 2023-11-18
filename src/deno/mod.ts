import { AbstractYoutubeTranscript, TranscriptConfig, TranscriptEntry } from "../lib/downloader.ts";
import { fetcher } from "./fetcher.ts";

export class YoutubeTranscript extends AbstractYoutubeTranscript {
  constructor(videoId: string, config?: TranscriptConfig) {
    super(videoId, config);
    this.fetcher = fetcher;
  }
}

export type { TranscriptConfig, TranscriptEntry };
export * from "../lib/error.ts";
