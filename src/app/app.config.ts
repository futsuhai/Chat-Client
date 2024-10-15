import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { APP_ROUTES } from './routes/routes';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    importProvidersFrom(HttpClientModule),
  ]
};
