import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // if you have a separate routes file

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes) // only if you are using routing
  ]
}).catch(err => console.error(err));
