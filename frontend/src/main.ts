import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // <-- 1. Fix import

bootstrapApplication(AppComponent, appConfig)      // <-- 2. Fix class name
  .catch((err) => console.error(err));