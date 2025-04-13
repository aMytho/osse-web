/**
 * Listen for Scan Events.
 */
export interface ScanEvents {
  listenForScanStarted(): void;
  listenForScanProgressed(): void;
  listenForScanCompleted(): void;
  listenForScanFailed(): void;
  listenForScanCancelled(): void;
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
  nextDirectoryToScan: string; // Will be empty string if last dir.
}

export interface ScanCompletedResult {
  directoryCount: number;
}

export interface ScanFailedResult {
  message: string;
}

export interface ScanCancelledResult {
  directoriesScannedBeforeCancellation: number;
}

export interface ScanEventMap {
  ScanStarted: ScanStartedResult;
  ScanProgressed: ScanProgressedResult;
  ScanCompleted: ScanCompletedResult;
  ScanFailed: ScanFailedResult;
  ScanCancelled: ScanCancelledResult;
}


/**
 * Scan channel names to subscrbe to.
 */
export enum ScanChannels {
  ScanStarted = "ScanStarted",
  ScanProgressed = "ScanProgressed",
  ScanCompleted = "ScanCompleted",
  ScanFailed = "ScanFailed",
  ScanCancelled = "ScanCancelled",
}
