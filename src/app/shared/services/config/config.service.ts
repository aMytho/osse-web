import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { OsseConfig } from './config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config!: OsseConfig;

  constructor() {
    // Get the ENV and populate any variables. Localstorage has priority
    this.config = {
      apiURL: localStorage.getItem('apiURL') ?? environment.apiURL,
      version: environment.version,
      broadcastURL: environment.broadcastURL
    };
  }

  public get(key: keyof OsseConfig, defaultVal?: any) {
    return this.config[key] ?? defaultVal ?? null;
  }

  public save(key: keyof OsseConfig, val: any) {
    localStorage.setItem(key, val);
    this.config[key] = val;
  }
}
