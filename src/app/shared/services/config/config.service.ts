import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { OsseConfig } from './config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config!: OsseConfig;
  
  constructor() {
    // Get the ENV and populate any variables
    this.config = {
      apiURL: environment.apiUrl
    }
  }

  public get(key: keyof OsseConfig, defaultVal?: any) {
    return this.config[key] ?? defaultVal ?? null;
  }
}
