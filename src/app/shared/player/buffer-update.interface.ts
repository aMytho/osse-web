export interface BufferUpdate {
  /**
   * Duration from the scan.
  */
  duration: number;
  /**
   * Browser duration estimate. May not be accurate.
  */
  durationEstimate: number;
  buffered: TimeRanges;
}
