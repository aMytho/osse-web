import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { ConfigService } from '../shared/services/config/config.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../toast-container/toast.service';
import { fetcher } from '../shared/util/fetcher';
import { BackgroundImageService } from '../shared/ui/background-image.service';
import { CommonModule } from '@angular/common';
import { SettingsLogsComponent } from './settings-logs/settings-logs.component';
import { SettingsScanComponent } from "./settings-scan/settings-scan.component";
import { SettingsScanHistoryComponent } from './settings-scan-history/settings-scan-history.component';
import { IconComponent } from "../shared/ui/icon/icon.component";
import { mdiGraph, mdiImage, mdiMusic, mdiQueueFirstInLastOut, mdiRestore, mdiSettingsHelper } from '@mdi/js';

@Component({
  selector: 'app-settings',
  imports: [HeaderComponent, FormsModule, CommonModule, SettingsLogsComponent, SettingsScanComponent, SettingsScanHistoryComponent, IconComponent],
  templateUrl: './settings.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  @ViewChild('samples') sampleElement!: ElementRef<HTMLInputElement>;
  public activeTab: string = 'scan';

  public directories: WritableSignal<string[]> = signal([]);
  public showBackgrounds: WritableSignal<boolean> = signal(false);
  public showVisualizer: WritableSignal<boolean> = signal(false);
  public visualizerSamples: WritableSignal<number> = signal(1);
  public enableQueue: WritableSignal<boolean> = signal(true);

  public visualizerIcon = mdiGraph;
  public imageIcon = mdiImage;
  public queueIcon = mdiRestore;

  constructor(
    private configService: ConfigService,
    private notificationService: ToastService,
    private backgroundImageService: BackgroundImageService
  ) { }


  public saveBackgroundCoverPreference() {
    this.configService.save('showCoverBackgrounds', this.showBackgrounds());
    this.notificationService.info('Saved Preferences!');

    if (!this.configService.get('showCoverBackgrounds')) {
      this.backgroundImageService.clearBG();
    }
  }

  public saveVisualizerPreference() {
    this.configService.save('showVisualizer', this.showVisualizer());
    this.configService.save('visualizerSamples', Number(this.sampleElement.nativeElement.value));
    this.visualizerSamples.set(Number(this.sampleElement.nativeElement.value));
    this.notificationService.info('Saved Preferences!');
  }

  public async saveQueuePreferences() {
    let res = await fetcher('config/queue', {
      method: 'POST',
      body: JSON.stringify({
        'queue': this.enableQueue()
      })
    });

    if (res.ok) {
      this.notificationService.info('Settings Saved!');
    } else {
      this.notificationService.error('Failed to save queue preferences. Try again?');
    }
  }

  public saveAll() {

  }

  public async requestSettings() {
    let res = await fetcher('config');

    if (res.ok) {
      let response = await res.json();
      this.directories.set(response.directories);
      this.enableQueue.set(response.queueEnabled);
    } else {
      this.notificationService.error('Failed to reach server. Check that the URL is correct and that the server is running.');
    }
  }

  async ngOnInit(): Promise<void> {
    await this.requestSettings();

    this.showBackgrounds.set(this.configService.get('showCoverBackgrounds'));
    this.showVisualizer.set(this.configService.get('showVisualizer'));
    this.visualizerSamples.set(this.configService.get('visualizerSamples'));
  }
}
