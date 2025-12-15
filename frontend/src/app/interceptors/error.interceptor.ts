import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(error => {
      console.error('HTTP Error:', error);
      
      if (error.status === 0) {
        console.error('Backend is not reachable. Please check if the server is running on http://localhost:3000');
      }
      
      return throwError(() => error);
    })
  );
};