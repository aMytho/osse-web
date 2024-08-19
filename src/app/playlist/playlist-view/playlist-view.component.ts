import { Component, Input, numberAttribute, OnInit } from '@angular/core';
import { ConfigService } from '../../shared/services/config/config.service';
import { Playlist } from '../../shared/services/playlist/Playlist';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { EditPlaylist } from './editPlaylistModel';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { mdiPencil, mdiTrashCan } from '@mdi/js';

@Component({
  selector: 'app-playlist-view',
  standalone: true,
  imports: [HeaderComponent, ButtonComponent, IconComponent, CommonModule, FormsModule],
  templateUrl: './playlist-view.component.html',
  styles: ``
})
export class PlaylistViewComponent implements OnInit {
  @Input({transform: numberAttribute})
  set id(id: number) {
    this.getPlaylist(id);
  }

  pencil = mdiPencil;
  trash = mdiTrashCan;

  public playlist!: Playlist;
  public showEditMenu = false;
  public ready = false;
  public model = new EditPlaylist('');

  constructor(
    private configService: ConfigService, private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  public delete() {
    fetch(this.configService.get('apiURL') + 'playlists/' + this.playlist.id, {
      method: 'DELETE',
    }).then((_r) => {
      this.router.navigate(['/playlists']);
    })
  }

  public async edit() {
    let req = await fetch(this.configService.get('apiURL') + 'playlists/' + this.playlist.id, {
      method: 'PATCH',
      body: JSON.stringify({
        name: this.model.name
      }),
      headers: [
        ['Content-Type', 'application/json']
      ]
    });

    if (req.ok) {
      this.getPlaylist(this.playlist.id);
      this.showEditMenu = false;
    }
  }

  public ngOnInit(): void {
    let id = this.activatedRoute.snapshot.params['id'];
    if (id != null) {
      this.id = Number(id);
    }
  }

  private async getPlaylist(id: number) {
    let res = await fetch(this.configService.get('apiURL') + 'playlists/' + id);
    let playlist = await res.json()
    this.ready = true;
    this.playlist = playlist;
    this.model.name = this.playlist.name;
  }
}
