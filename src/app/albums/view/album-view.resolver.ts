import { ResolveFn } from '@angular/router';
import { Album } from '../../shared/services/album/Album';
import { inject } from '@angular/core';
import { ConfigService } from '../../shared/services/config/config.service';

export const albumViewResolver: ResolveFn<Album> = async (route, state) => {
  let id = route.paramMap.get('id');
  let configService = inject(ConfigService);

  let request = await fetch(`${configService.get('apiURL')}albums/${id}/tracks`);
  if (request.ok) {
    let album = await request.json();
    return new Album(album);
  }

  throw "Not Found"
};
