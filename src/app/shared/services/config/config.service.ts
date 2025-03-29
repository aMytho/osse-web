import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { OsseConfig } from './config';
import { getCookie } from '../../util/fetcher';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config!: OsseConfig;

  constructor() {
    this.initConfig();

    // Get the ENV and populate any variables. Localstorage has priority
    this.config = {
      apiURL: localStorage.getItem('apiURL') ?? environment.apiURL,
      version: environment.version,
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

  private initConfig() {
    // If the user hasn't set an API URl, check what the server says the URL is. Fallback to that, or the env.
    let userApiURL = localStorage.getItem('apiURL');
    if (!userApiURL) {
      let serverSaysApiUrl = getCookie('API_URL');
      if (serverSaysApiUrl) {
        localStorage.setItem('apiURL', serverSaysApiUrl.endsWith('/') ? serverSaysApiUrl : serverSaysApiUrl + '/');
      } else {
        localStorage.setItem('apiURL', environment.apiURL);
      }
    }
  }
}
