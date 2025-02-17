import { Component, signal, WritableSignal } from '@angular/core';
import { ButtonComponent } from '../shared/ui/button/button.component';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { ToastService } from '../toast-container/toast.service';
import { ConfigService } from '../shared/services/config/config.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { fetcher } from '../shared/util/fetcher';

@Component({
  selector: 'app-registration',
  imports: [ButtonComponent, HeaderComponent, FormsModule],
  templateUrl: './registration.component.html',
  styles: ``
})
export class RegistrationComponent {
  public username: string = '';
  public password: string = '';
  public serverFound: WritableSignal<boolean> = signal(false);
  public url: WritableSignal<string> = signal(window.location.hostname + ':8000');
  public protocol: WritableSignal<string> = signal('http://');

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
      await fetch(this.protocol().concat(this.url()) + 'api/ping');
      // Save the URL
      this.configService.save("apiURL", this.protocol().concat(this.url()));
      this.notificationService.info("URL saved as " + this.configService.get("apiURL"));
      this.serverFound.set(true);
    } catch (e) {
      this.notificationService.error('Failed to reach server. Confirm that the URL is correct and that the server is running.');
    }
  }

  public async register() {
    if (this.username.length == 0 || this.password.length == 0) {
      this.notificationService.error('You must enter a username and password.');
      return;
    }

    let res = await fetcher('register', {
      method: 'POST',
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      }),
      rootURL: this.configService.get('apiURL')
    });

    if (res.status == 403) {
      this.notificationService.error('Account creation error. Check that registration is enabled in your server settings. ');
      return;
    } else if (res.status == 422) {
      this.notificationService.error('Account creation error. Check that the username is not in use and that the username and password are at least 1 character. ');
      return;
    }

    if (res.ok) {
      this.notificationService.info('Account created successfully! Welcome to Osse, ' + this.username + '.');
      await this.authService.attemptLogin();
      this.router.navigateByUrl('/home');
    } else {
      this.notificationService.error('Login error.');
    }
  }
}
