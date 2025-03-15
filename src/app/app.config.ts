import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { ConfigService } from './shared/services/config/config.service';
import { TrackService } from './shared/services/track/track.service';
import { AuthService } from './shared/services/auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    { provide: ConfigService },
    { provide: TrackService },
    { provide: AuthService }
  ]
}
