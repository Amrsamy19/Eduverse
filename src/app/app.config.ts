import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { UserInterceptor } from './interceptors/userInterceptor';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withEnabledBlockingInitialNavigation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'disabled',
        anchorScrolling: 'disabled',
      })
    ),
    provideHttpClient(withFetch(), withInterceptors([UserInterceptor])),
    importProvidersFrom(OAuthModule.forRoot()),
  ],
};

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com', // Google OAuth endpoint
  clientId: '85917209129-o7it7cusi8ghs1rqhi6c60f0cadfd7r6.apps.googleusercontent.com',
  redirectUri: window.location.origin,
  scope: 'openid profile email',
  strictDiscoveryDocumentValidation: false,
};
