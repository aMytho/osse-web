import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, signal } from '@angular/core';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { ButtonComponent } from '../shared/ui/button/button.component';
import { ConfigService } from '../shared/services/config/config.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../toast-container/toast.service';
import { fetcher } from '../shared/util/fetcher';

@Component({
  selector: 'app-settings',
  imports: [HeaderComponent, ButtonComponent, FormsModule],
  templateUrl: './settings.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  public scanInProgress: WritableSignal<boolean> = signal(false);
  public directories: WritableSignal<string[]> = signal([]);
  public url: WritableSignal<string> = signal(this.configService.get("apiURL"));

  constructor(private configService: ConfigService, private notificationService: ToastService) { }

  public scan() {
    this.scanInProgress.set(true);

    fetcher('tracks/scan', {
      method: 'POST'
    }).then(_v => {
      this.scanInProgress.set(false);
      alert('Scan has started.');
    });
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

  public async requestSettings() {
    try {
      let res = await fetcher('config/directories');
      this.directories.set(await res.json());
    } catch (e) {
      this.notificationService.error('Failed to reach server. Check that the URL is correct and that the server is running.');
    }

  }

  async ngOnInit(): Promise<void> {
    await this.requestSettings();
  }
}
