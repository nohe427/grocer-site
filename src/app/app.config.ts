import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
// import { provideServerRendering } from '@angular/ssr';

import { routes } from './app.routes';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { WINDOW, windowProvider } from './providers/window';
import { DOCUMENT } from '@angular/common';
import { provideMarkdown } from 'ngx-markdown';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { environment } from '../environments/environment.development';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideClientHydration(withHttpTransferCacheOptions({
      includePostRequests: true
    })),
    provideRouter(routes),
    {
      provide: WINDOW,
      useFactory: (document: Document) => windowProvider(document),
      deps: [DOCUMENT],
    },provideMarkdown(),
      provideFirebaseApp(() => initializeApp(
        environment.firebase
      )),
      provideAuth(() => getAuth()),
      provideAppCheck(() => {
        const provider = environment.appCheckProvider;  
        return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
      }),
  ]
};
