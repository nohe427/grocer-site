import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { WINDOW, windowProvider } from './providers/window';
import { DOCUMENT } from '@angular/common';
import { provideMarkdown } from 'ngx-markdown';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideClientHydration(),
    {
      provide: WINDOW,
      useFactory: (document: Document) => windowProvider(document),
      deps: [DOCUMENT],
    },provideMarkdown(), provideFirebaseApp(() => initializeApp({"projectId":"lon-next","appId":"1:1039410413539:web:70afda114ffd296afb2ad6","storageBucket":"lon-next.firebasestorage.app","apiKey":"AIzaSyDsfZ75K15WUutJxESZnIHxPAt6qo-_aXI","authDomain":"lon-next.firebaseapp.com","messagingSenderId":"1039410413539"})), provideAuth(() => getAuth()), provideAppCheck(() => {
  // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_
  const provider = new ReCaptchaEnterpriseProvider("6LcnyboqAAAAAF5RKuAPmld7DSmllAbsk-LNorji");
  return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
})
  ]
};
