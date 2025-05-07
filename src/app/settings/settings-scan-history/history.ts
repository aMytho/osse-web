export interface ScanJob {
  id: number;
  finished_at: string;
  started_at: string;
  status: string;
  total_dirs: number;
  directories: ScanDirectory[];
}

export interface ScanDirectory {
  id: number;
  files_scanned: number;
  files_skipped: number;
  status: string;
  path: string;
}
