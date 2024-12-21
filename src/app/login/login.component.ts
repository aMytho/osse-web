import { Component, signal, WritableSignal } from '@angular/core';
import { fetcher, getCookie } from '../shared/util/fetcher';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { ButtonComponent } from '../shared/ui/button/button.component';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../toast-container/toast.service';
import { ConfigService } from '../shared/services/config/config.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [HeaderComponent, ButtonComponent, FormsModule],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  public username: string = '';
  public password: string = '';
  public serverFound: WritableSignal<boolean> = signal(false);
  public url: WritableSignal<string> = signal(this.configService.get("apiURL"));

  constructor(
    private notificationService: ToastService,
    private configService: ConfigService,
    private router: Router,
    private authService: AuthService
  ) { }

  public async saveURL() {
    if (!this.url().endsWith("/")) {
      this.url.update(u => u + "/");
    }

    // Check if the server URL is right.
    try {
      await fetch(this.url() + 'api/ping');
      // Save the URL
      this.configService.save("apiURL", this.url());
      this.notificationService.info("URL saved as " + this.configService.get("apiURL"));
      this.serverFound.set(true);
    } catch (e) {
      this.notificationService.error('Failed to reach server. Confirm that the URL is correct and that the server is running.');
    }
  }

  public async login() {
    if (this.username.length == 0 || this.password.length == 0) {
      this.notificationService.error('You must enter a username and password.');
      return;
    }

    let res = await fetcher('login', {
      method: 'POST',
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      })
    });

    if (res.ok) {
      this.authService.login();
      this.router.navigateByUrl('/home');
    } else {
      this.notificationService.error('Login error. Check that the username and password are correct.');
    }
  }
}
