/**
 * Listen for Scan Events.
 */
export interface ScanEvents {
  listenForScanStarted(): void;
  listenForScanProgressed(): void;
  listenForScanCompleted(): void;
  listenForScanFailed(): void;
}

export interface ScanStartedResult {
  directories: number
}

export interface ScanProgressedResult {
  filesScanned: number;
  directoryName: string;
  filesSkipped: number;
  totalDirectories: number;
  scannedDirectories: number;
}

export interface ScanCompletedResult {
  directoryCount: number;
}

export interface ScanFailedResult {
  message: string;
}

export interface ScanEventMap {
  ScanStarted: ScanStartedResult;
  ScanProgressed: ScanProgressedResult;
  ScanCompleted: ScanCompletedResult;
  ScanFailed: ScanFailedResult;
}


/**
 * Scan channel names to subscrbe to.
 */
export enum ScanChannels {
  ScanStarted = "ScanStarted",
  ScanProgressed = "ScanProgressed",
  ScanCompleted = "ScanCompleted",
  ScanFailed = "ScanFailed",
}
