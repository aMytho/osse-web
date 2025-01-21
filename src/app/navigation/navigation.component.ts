import { Component, computed, signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../shared/ui/icon/icon.component';
import { mdiCog, mdiFolderHome, mdiHome, mdiMenu, mdiMenuClose } from '@mdi/js';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, IconComponent, CommonModule],
  templateUrl: './navigation.component.html',
  styles: ``
})
export class NavigationComponent {
  gear = mdiCog;
  home = mdiHome;
  mobileMenuOpen: WritableSignal<boolean> = signal(false);
  mobileMenuIcon = computed(() => this.mobileMenuOpen() ? mdiMenuClose : mdiMenu);

  public toggleMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }
}
