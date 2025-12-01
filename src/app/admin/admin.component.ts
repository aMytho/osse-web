import { Component, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../shared/ui/header/header.component";
import { fetcher } from '../shared/util/fetcher';
import { User } from './admin.interface';

@Component({
  selector: 'app-admin',
  imports: [HeaderComponent],
  templateUrl: './admin.component.html',
  styles: ``
})
export class AdminComponent implements OnInit {
  public users = signal<User[]>([]);

  async ngOnInit(): Promise<void> {
    let req = await fetcher('admin/users');

    if (req.ok) {
      this.users.set(await req.json());
    }
  }
}
