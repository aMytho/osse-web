import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ConfigService } from './shared/services/config/config.service';
import { TrackService } from './shared/services/track/track.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {provide: ConfigService},
    {provide: TrackService}
  ]
};
