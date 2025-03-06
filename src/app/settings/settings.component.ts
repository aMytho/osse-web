import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, WritableSignal, signal } from '@angular/core';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { ButtonComponent } from '../shared/ui/button/button.component';
import { ConfigService } from '../shared/services/config/config.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../toast-container/toast.service';
import { fetcher } from '../shared/util/fetcher';
import { EchoService } from '../shared/services/echo/echo.service';
import { merge, Subscription } from 'rxjs';
import { ScanChannels } from '../shared/services/echo/channels/scan';
import { BackgroundImageService } from '../shared/ui/background-image.service';
import { ScanProgress } from './scan-progress.interface';

@Component({
  selector: 'app-settings',
  imports: [HeaderComponent, ButtonComponent, FormsModule],
  templateUrl: './settings.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy {
  public scanInProgress: WritableSignal<boolean> = signal(false);
  public waitingForScanConfirmation: WritableSignal<boolean> = signal(false);
  public scanFailMessage: WritableSignal<string> = signal('');
  public scanComplete: WritableSignal<boolean> = signal(false);
  public scanProgress: WritableSignal<ScanProgress> = signal({ active: false });

  public directories: WritableSignal<string[]> = signal([]);
  public url: WritableSignal<string> = signal(this.configService.get("apiURL"));
  private subscription!: Subscription;
  public showBackgrounds: WritableSignal<boolean> = signal(false);
  public logs: WritableSignal<string> = signal('');
  public showLogs: WritableSignal<boolean> = signal(false);

  constructor(
    private configService: ConfigService,
    private notificationService: ToastService,
    private echoService: EchoService,
    private backgroundImageService: BackgroundImageService
  ) { }

  public scan() {
    this.waitingForScanConfirmation.set(true);

    fetcher('scan', {
      method: 'POST'
    }).finally(() => this.waitingForScanConfirmation.set(false));
  }

  public async saveURL() {
    if (!this.url().endsWith("/")) {
      this.url.update(u => u + "/");
    }

    // Check if the server is running
    try {
      await fetch(this.url() + 'api/ping');
      // Save the URL
      this.configService.save("apiURL", this.url());
      this.notificationService.info("URL saved as " + this.configService.get("apiURL"));
      this.requestSettings();
    } catch (e) {
      alert('Failed to reach server. URL not set. Confirm that the URL is correct and that the server is running.');
    }
  }

  public saveBackgroundCoverPreference() {
    this.configService.save('showCoverBackgrounds', this.showBackgrounds());
    this.notificationService.info('Saved Preferences!');

    if (!this.configService.get('showCoverBackgrounds')) {
      this.backgroundImageService.clearBG();
    }
  }

  public async requestSettings() {
    let res = await fetcher('config/directories');

    if (res.ok) {
      this.directories.set(await res.json());
      this.requestLogs();
    } else {
      this.notificationService.error('Failed to reach server. Check that the URL is correct and that the server is running.');
    }
  }

  private async requestScanProgress() {
    let res = await fetcher('scan');
    if (res.ok) {
      let response: ScanProgress = await res.json();
      console.log(response);
      // Set the progress. If active, show the progress bar.
      this.scanProgress.set(response);
      if (response.active) {
        this.scanInProgress.set(true);
      }
    }
  }

  private async requestLogs() {
    let res = await fetcher('config/logs');

    if (res.ok) {
      this.logs.set(await res.text());
    } else {
      this.notificationService.error('Failed to access logs.');
    }
  }

  async ngOnInit(): Promise<void> {
    await this.requestSettings();
    // Request scan progress, but don't wait for it.
    this.requestScanProgress();

    const scanStarted$ = this.echoService.subscribeToEvent(ScanChannels.ScanStarted, (data) => {
      this.notificationService.info(`Started scanning ${data.directories} directories.`);
      this.scanInProgress.set(true);
      this.scanProgress.set({ active: true, finished_count: 0, total_directories: data.directories })
      this.scanFailMessage.set('');
      this.scanComplete.set(false);
    });
    const scanProgressed$ = this.echoService.subscribeToEvent(ScanChannels.ScanProgressed, (data) => {
      console.log(data);
      // Update progress bar.
      this.scanProgress.update((v) => ({
        active: v.active,
        finished_count: data.scannedDirectories,
        total_directories: data.totalDirectories
      }));
      this.notificationService.info(`Scanned dir ${data.directoryName} with ${data.filesScanned} files scanned and ${data.filesSkipped} files skipped.`)
    });
    const scanCompleted$ = this.echoService.subscribeToEvent(ScanChannels.ScanCompleted, (data) => {
      this.notificationService.info(`Finished scanning ${data.directoryCount} directories.`)
      this.scanInProgress.set(false);
      this.scanProgress.set({ active: false })
      this.scanComplete.set(true);
    });
    const scanFailed$ = this.echoService.subscribeToEvent(ScanChannels.ScanFailed, (data) => {
      this.notificationService.error('Scan Failed!');
      this.scanFailMessage.set(data.message);
      this.scanInProgress.set(false);
      this.scanProgress.set({ active: false })
    });

    this.subscription = merge(scanStarted$, scanProgressed$, scanCompleted$, scanFailed$).subscribe();

    this.showBackgrounds.set(this.configService.get('showCoverBackgrounds'));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
