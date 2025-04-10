import { EventEmitter, Injectable } from '@angular/core';
import { fetcher } from '../../util/fetcher';
import { EchoService } from '../echo/echo.service';
import { AuthResponse } from './auth.interface';
import { TrackService } from '../track/track.service';
import { BackgroundImageService } from '../../ui/background-image.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private statusChecked = false;
  public authStateChanged = new EventEmitter<boolean>();

  constructor(private echoService: EchoService, private trackService: TrackService, private backgroundImageService: BackgroundImageService) {
    // Check if we are logged in by requesting the current user. If this fails, we know we are not logged in.
    this.checkLoginStatus();
  }

  /**
   * Tries to login. Sets the status accordingly.
   */
  public async checkLoginStatus() {
    try {
      await this.attemptLogin();
      this.statusChecked = true;
    } catch (e) {
      this.statusChecked = true;
      this.isLoggedIn = false;
    }
  }

  /**
   * Attempt to login. This will get a CSRF token and try to login as the user.
   * If this fails (csrf or user request), we set as not logged in.
   */
  public async attemptLogin() {
    let req = await fetcher('user');
    if (req.ok) {
      this.login(await req.json());
    } else {
      throw "Login failure.";
    }
  }

  /**
   * Checks if the user is authenticated.
   * If the request has not been made, it will wait until it is made.
   */
  isAuthenticated(): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      if (this.statusChecked) {
        resolve(this.isLoggedIn);
      }

      setTimeout(async () => {
        let result = await this.isAuthenticated();
        resolve(result);
      }, 1000);
    });
  }

  /**
  * Call this after logging in.
  * The work is already done, this just lets the client routes work and subscribes to events.
  */
  private login(userAuth: AuthResponse): void {
    this.isLoggedIn = true;

    // Listen for events.
    this.echoService.connect().then((_e) => {
      this.echoService.listenForScanStarted();
      this.echoService.listenForScanProgressed();
      this.echoService.listenForScanCompleted();
      this.echoService.listenForScanFailed();
      this.echoService.listenForScanCancelled();
    }).catch(() => {
      console.error("Failed to connect to osse-broadcast. Live events will not be received!");
    });

    this.authStateChanged.emit(true);
  }

  public async logout() {
    this.trackService.clearTracks();
    this.backgroundImageService.clearBG();
    this.echoService.disconnect();
    await fetcher('logout', { method: 'POST' });
    // Delete xsrf token.
    document.cookie = "XSRF-TOKEN=;expires=" + new Date(0).toUTCString();

    this.isLoggedIn = false;
    this.authStateChanged.emit(false);
  }
}

