import { EventEmitter, Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { ConfigService } from '../config/config.service';
import { fetcher } from '../../util/fetcher';
import { ScanChannels, ScanCompletedResult, ScanEvents, ScanFailedResult, ScanProgressedResult, ScanStartedResult } from './channels/scan';
import { EchoChannel, EchoResult } from './channels';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EchoService implements ScanEvents {
  private echo!: Echo<"reverb">;
  private pusher!: typeof Pusher;
  private echoEvent = new EventEmitter<{ channel: EchoChannel; data: EchoResult<EchoChannel> }>();

  constructor(private configService: ConfigService) { }

  public connect(key: string) {
    if (!key) {
      throw "Tried to connect without a reverb key. Please authenticate first!";
    }

    let url = new URL(this.configService.get('apiURL'));

    this.pusher = Pusher;

    this.echo = new Echo({
      broadcaster: 'reverb',
      key: key,
      wsHost: url.hostname,
      wsPort: 8080,
      wssPort: 443,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
      authorizer: (channel: any, _options: any) => ({
        authorize: (socketId: any, callback: any) => {
          fetcher(`broadcasting/auth`, {
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
            method: 'POST'
          })
            .then(async response => {
              callback(null, await response.json());
            })
            .catch(error => {
              callback(error);
            });
        },
      })
    });
  }


  public subscribeToEvent<T extends EchoChannel>(
    channel: T,
    callback?: (data: EchoResult<T>) => void
  ): Observable<EchoResult<T>> {
    return new Observable<EchoResult<T>>((observer) => {
      const subscription = this.echoEvent.subscribe(({ channel: emittedChannel, data }) => {
        if (emittedChannel === channel) {
          const eventData = data as EchoResult<T>;
          observer.next(eventData); // Emit the data through the observable
          if (callback) {
            callback(eventData); // Optionally execute the callback
          }
        }
      });

      // Clean up when the observable is unsubscribed
      return () => subscription.unsubscribe();
    });
  }

  private emitEvent<T extends EchoChannel>(channel: T, data: EchoResult<T>): void {
    this.echoEvent.emit({ channel, data });
  }

  listenForScanStarted(): void {
    this.echo.private('scan')
      .listen('ScanStarted', (ev: ScanStartedResult) => this.emitEvent(ScanChannels.ScanStarted, ev));
  }

  listenForScanProgressed(): void {
    this.echo.private('scan')
      .listen('ScanProgressed', (ev: ScanProgressedResult) => this.emitEvent(ScanChannels.ScanProgressed, ev));
  }

  listenForScanCompleted(): void {
    this.echo.private('scan')
      .listen('ScanCompleted', (ev: ScanCompletedResult) => this.emitEvent(ScanChannels.ScanCompleted, ev));
  }

  listenForScanFailed(): void {
    this.echo.private('scan')
      .listen('ScanFailed', (ev: ScanFailedResult) => this.emitEvent(ScanChannels.ScanFailed, ev));
  }

  public disconnect() {
    this.echo.disconnect();
  }
}
