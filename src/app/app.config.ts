import { ApplicationConfig, DOCUMENT } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { WINDOW, windowProvider } from './providers/window';

import { provideMarkdown } from 'ngx-markdown';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { environment } from '../environments/environment.development';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideClientHydration(),
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
