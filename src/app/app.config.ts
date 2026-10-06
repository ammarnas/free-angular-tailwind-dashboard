import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    // The active locale is not set here: `LanguageService` owns it so the
    // stored preference is applied exactly once, in one place.
    provideTranslateService({
      fallbackLang: 'ar',
      loader: provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json' })
    })
  ]
};
