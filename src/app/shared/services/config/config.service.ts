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
      broadcastURL: environment.broadcastURL,
      showCoverBackgrounds: Boolean(localStorage.getItem('showCoverBackgrounds') ?? environment.showCoverBackgrounds),
      showVisualizer: Boolean(localStorage.getItem('showVisualizer') ?? environment.showVisualizer),
      visualizerSamples: Number(localStorage.getItem('visualizerSamples') ?? environment.visualizerSamples)
    };
  }

  public get<T extends keyof OsseConfig>(key: T, defaultVal?: any): OsseConfig[T] {
    return this.config[key] ?? defaultVal ?? null;
  }

  public save<T extends keyof OsseConfig>(key: T, val: OsseConfig[T]) {
    localStorage.setItem(key, String(val));
    this.config[key] = val;
  }
}
