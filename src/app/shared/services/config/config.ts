export interface OsseConfig {
  /**
   * Current version of the app. dev or x.x.x
  */
  version: string,
  /**
   * API URL.
  */
  apiURL: string;
  /**
   * URL for events
   */
  broadcastURL: string;
  /**
  * Show album/track art in the background on certain pages.
  */
  showCoverBackgrounds: boolean;
  /**
   * Show a music visualizer on the homepage.
  */
  showVisualizer: boolean;
  /**
   * Amount of samples taken for the visualizer.
  */
  visualizerSamples: number;
}
