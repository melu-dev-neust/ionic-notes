import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../services/auth';
import { NotesService } from '../services/notes';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const notes = inject(NotesService);
  const router = inject(Router);

  const token = auth.getToken();
  const authReq =
    token && !req.headers.has('Authorization')
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // token expired or revoked on a protected call → back to login
      if (err.status === 401 && token && !req.url.includes('auth.php')) {
        notes.reset();
        auth.clearSession();
        router.navigate(['/login'], { replaceUrl: true });
      }
      return throwError(() => err);
    })
  );
};