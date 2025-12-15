import { ApplicationConfig, provideZoneChangeDetection, PLATFORM_ID, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch, HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { routes } from './app.routes';
import { errorInterceptor } from './interceptors/error.interceptor';

// Auth interceptor to add token to requests
const authInterceptor: HttpInterceptorFn = (req, next) => {
    const platformId = inject(PLATFORM_ID);

    // Only access localStorage in browser
    if (isPlatformBrowser(platformId)) {
        const token = localStorage.getItem('token');
        if (token) {
            req = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
        }
    }
    return next(req);
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient(
            withFetch(),                          // <-- Add for SSR
            withInterceptors([authInterceptor, errorInterceptor])
        )
    ]
};