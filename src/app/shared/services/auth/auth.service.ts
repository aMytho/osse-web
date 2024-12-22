import { Injectable } from '@angular/core';
import { fetcher } from '../../util/fetcher';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private statusChecked = false;

  constructor() {
    // Check if we are logged in by requesting the current user. If this fails, we know we are not logged in.
    this.checkLoginStatus();
  }

  /**
   * Attempt to login. This will get a CSRF token and try to login as the user.
   * If this fails (csrf or user request), we set as not logged in.
   */
  async checkLoginStatus() {
    try {
      let req = await fetcher('user');
      if (req.ok) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }

      this.statusChecked = true;
    } catch (e) {
      this.statusChecked = true;
      this.isLoggedIn = false;
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
  * The work is already done, this just lets the client routes work.
  */
  login(): void {
    this.isLoggedIn = true;
  }
}

