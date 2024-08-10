import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { ButtonComponent } from '../shared/ui/button/button.component';
import { ConfigService } from '../shared/services/config/config.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [HeaderComponent, ButtonComponent],
  templateUrl: './settings.component.html',
  styles: ``
})
export class SettingsComponent implements OnInit {
  public scanInProgress = false;
  public directories: string[] = [];
  constructor(private configService: ConfigService) {}

  public scan() {
    this.scanInProgress = true;
    fetch(this.configService.get('apiURL') + 'tracks/scan', {
      method: 'POST'
    }).then(_v => {
      this.scanInProgress = false;
      alert('Scan Complete');
    });
  }

  async ngOnInit(): Promise<void> {
    let req = await fetch(this.configService.get('apiURL') + 'config/directories');
    let res = await req.json();
    this.directories = res;
  }
}
