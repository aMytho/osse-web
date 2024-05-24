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
}
