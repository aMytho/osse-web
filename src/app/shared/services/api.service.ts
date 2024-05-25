import { Injectable } from '@angular/core';
import { ConfigService } from './config/config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private configService: ConfigService) {

  }

  public async getAllTracks() {
    try {
      let request = await fetch(`${this.configService.get('apiURL')}tracks/all`);
      let response = await request.json();
      console.log(response);
      return response;
    } catch(e) {
      return [];
    }
  }

  public async getAudioRange(id: number, start: number, end: number): Promise<ArrayBuffer> {
    console.log("requesting", id);
    let request = await fetch(`${this.configService.get('apiURL')}stream`, {
      headers: {
        'Range': `bytes=${start}-${end}`,
        'Track': `${id}`
      }
    });

    console.log(request.status);
    console.log(request.statusText);

    return await request.arrayBuffer();
  }
}
