import { ResolveFn } from '@angular/router';
import { Album } from '../../shared/services/album/Album';
import { fetcher } from '../../shared/util/fetcher';

export const albumViewResolver: ResolveFn<Album> = async (route, state) => {
  let id = route.paramMap.get('id');

  let request = await fetcher(`albums/${id}?tracks=true`);
  if (request.ok) {
    let album = await request.json();
    return new Album(album.data);
  }

  throw "Not Found"
};
