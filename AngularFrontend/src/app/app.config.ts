// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';

// export const appConfig: ApplicationConfig = {
//   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
// };

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter,withDebugTracing,withRouterConfig } from '@angular/router';
import { provideHttpClient,withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
// import { MatSnackBarModule } from '@angular/material/snack-bar'; 
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,
      withRouterConfig({onSameUrlNavigation:'reload'}),
      withDebugTracing()
    ),
    importProvidersFrom(BrowserAnimationsModule),
    provideHttpClient(withInterceptors([authInterceptor])), // Provide HttpClient here
    // MatSnackBarModule,
    // BrowserAnimationsModule,
  ],
};
