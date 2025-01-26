import { Component, computed, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../shared/ui/icon/icon.component';
import { mdiCog, mdiHome, mdiLogout, mdiMenu, mdiMenuClose } from '@mdi/js';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth/auth.service';


@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, IconComponent, CommonModule],
  templateUrl: './navigation.component.html',
  styles: ``
})
export class NavigationComponent implements OnInit {
  gear = mdiCog;
  home = mdiHome;
  exit = mdiLogout;
  mobileMenuOpen: WritableSignal<boolean> = signal(false);
  mobileMenuIcon = computed(() => this.mobileMenuOpen() ? mdiMenuClose : mdiMenu);
  showLogoutButton: WritableSignal<boolean> = signal(false);

  constructor(public authService: AuthService, private router: Router) { }

  public toggleMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }

  public logout() {
    this.authService.logout();
    this.router.navigateByUrl('login');
  }

  async ngOnInit() {
    this.authService.authStateChanged.subscribe((v) => {
      this.showLogoutButton.set(v);
    });
  }
}
