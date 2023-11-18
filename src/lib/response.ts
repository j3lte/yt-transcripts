export type TranscriptResponse = {
  responseContext: {
    serviceTrackingParams: {
      service: string;
      params: {
        key: string;
        value: string;
      }[];
    }[];
    mainAppWebResponseContext: {
      loggedOut: boolean;
      trackingParam: string;
    };
    webResponseContextExtensionData: {
      hasDecorated: boolean;
    };
  };
  actions: {
    clickTrackingParams: string;
    updateEngagementPanelAction: {
      targetId: string;
      content: {
        transcriptRenderer: {
          body: {
            transcriptBodyRenderer: {
              cueGroups: {
                transcriptCueGroupRenderer: {
                  formattedStartOffset: {
                    simpleText: string;
                  };
                  cues: {
                    transcriptCueRenderer: {
                      cue: {
                        simpleText: string;
                      };
                      startOffsetMs: string;
                      durationMs: string;
                    };
                  }[];
                };
              }[];
            };
          };
          footer: {
            transcriptFooterRenderer: {
              languageMenu: {
                sortFilterSubMenuRenderer: {
                  subMenuItems: {
                    title: string;
                    selected: boolean;
                    continuation: {
                      reloadContinuationData: {
                        continuation: string;
                        clickTrackingParams: string;
                      };
                    };
                    trackingParams: string;
                  }[];
                  trackingParams: string;
                };
              };
            };
          };
          trackingParams: string;
        };
      };
    };
  }[];
  trackingParams: string;
};
