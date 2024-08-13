import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { ButtonComponent } from '../shared/ui/button/button.component';
import { ConfigService } from '../shared/services/config/config.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../toast-container/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [HeaderComponent, ButtonComponent, FormsModule],
  templateUrl: './settings.component.html',
  styles: ``
})
export class SettingsComponent implements OnInit {
  public scanInProgress = false;
  public directories: string[] = [];
  public url: string = this.configService.get("apiURL");
  constructor(private configService: ConfigService, private notificationService: ToastService) {}

  public scan() {
    this.scanInProgress = true;
    fetch(this.configService.get('apiURL') + 'tracks/scan', {
      method: 'POST'
    }).then(_v => {
      this.scanInProgress = false;
      alert('Scan Complete');
    });
  }

  public saveURL() {
    if (!this.url.endsWith("/")) {
      this.url += "/";
    }
    this.configService.save("apiURL", this.url);
    this.notificationService.info("URL saved as " + this.configService.get("apiURL"));
  }

  async ngOnInit(): Promise<void> {
    let req = await fetch(this.configService.get('apiURL') + 'config/directories');
    let res = await req.json();
    this.directories = res;
  }
}
