import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { RenderMode, provideServerRoutesConfig } from '@angular/ssr';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
        provideServerRoutesConfig([{
          path: '/',
          renderMode: RenderMode.Server
        }]),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
