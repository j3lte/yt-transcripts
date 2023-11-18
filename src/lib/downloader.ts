import { generateRequest } from "./pagerequest.ts";
import { getVideoId } from "./video_id.ts";
import { YoutubeTranscriptError } from "./error.ts";
import { TranscriptResponse } from "./response.ts";

/**
 * Configuration for downloading transcript
 * @typedef {Object} TranscriptConfig
 * @property {string} [lang] Language for transcript
 * @property {string} [country] Country for transcript
 * @property {string} [proxy] Proxy for downloading transcript. Note! You will need to enable '--unstable' for this to work in Deno
 */
export interface TranscriptConfig {
  /** Language for transcript */
  lang?: string;
  /** Country for transcript */
  country?: string;
  /** Proxy for downloading transcript. Note! You will need to enable '--unstable' for this to work in Deno */
  proxy?: string;
}

/**
 * Transcript entry
 * @typedef {Object} TranscriptEntry
 * @property {string} text Text of transcript entry
 * @property {number} duration Duration of transcript entry in milliseconds
 * @property {number} offset Offset of transcript entry in milliseconds
 */
export type TranscriptEntry = {
  /** Text of transcript entry */
  text: string;
  /** Duration of transcript entry in milliseconds */
  duration: number;
  /** Offset of transcript entry in milliseconds */
  offset: number;
  /** Offset of transcript in simple string format */
  simpleOffset: string;
};

export abstract class AbstractYoutubeTranscript {
  fetcher!: (url: string, init: RequestInit) => Promise<Response>;

  private videoId: string;
  private config: TranscriptConfig;
  private proxy?: string;

  /**
   * @param videoId {string} YouTube video ID
   * @param config {TranscriptConfig} Configuration for downloading transcript
   */
  constructor(videoId: string, config?: TranscriptConfig) {
    const id = getVideoId(videoId);

    if (!id) {
      throw new YoutubeTranscriptError("Invalid YouTube video ID");
    }

    this.config = config || {};
    this.videoId = id;

    if (this.config.proxy) {
      this.proxy = this.config.proxy;
    }
  }

  /**
   * Sets the language for the transcript
   * @param lang {string} Language for transcript
   */
  public setLang(lang: string): void {
    this.config.lang = lang;
  }

  /**
   * Sets the country for the transcript
   * @param country {string} Country for transcript
   */
  public setCountry(country: string): void {
    this.config.country = country;
  }

  /**
   * Fetches the transcript
   * @returns {Promise<TranscriptEntry[]>} List of transcript entries
   */
  public async fetchTranscript(): Promise<TranscriptEntry[]> {
    const response = await this.fetcher(
      `https://www.youtube.com/watch?v=${this.videoId}`,
      {
        headers: {
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      },
    );

    if (!response.ok) {
      throw new YoutubeTranscriptError("No video found");
    }

    const body = await response.text();
    const innerTubeApiKey = body
      .toString()
      .split('"INNERTUBE_API_KEY":"')[1]
      .split('"')[0];

    if (innerTubeApiKey && innerTubeApiKey.length > 0) {
      const requestData = generateRequest(body.toString(), this.config);
      const transcriptResponse = await this.fetcher(
        `https://www.youtube.com/youtubei/v1/get_transcript?key=${innerTubeApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        },
      );
      if (!transcriptResponse.ok) {
        throw new YoutubeTranscriptError("No transcript found");
      }
      const transcript = await transcriptResponse.json() as TranscriptResponse;
      if (!transcript.actions) {
        throw new YoutubeTranscriptError("No transcript found");
      }

      const transcripts = transcript.actions[0].updateEngagementPanelAction.content
        .transcriptRenderer.body.transcriptBodyRenderer.cueGroups;

      return transcripts.map((cue) => ({
        text: cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer
          .cue.simpleText,
        duration: parseInt(
          cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer
            .durationMs,
        ),
        offset: parseInt(
          cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer
            .startOffsetMs,
        ),
        simpleOffset: cue.transcriptCueGroupRenderer.formattedStartOffset
          .simpleText,
      }));
    } else {
      throw new YoutubeTranscriptError("No key found to download the video transcript");
    }
  }
}
