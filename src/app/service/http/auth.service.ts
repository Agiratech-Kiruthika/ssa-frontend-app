import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  login(email: string, password: string): Observable<{ message: string }> {
    const defaultEmail = 'test@example.com';
    const defaultPassword = 'password123';

    if (email === defaultEmail && password === defaultPassword) {
      return of({ message: 'Login successful' }).pipe(delay(1000)); 
    }

    return throwError(() => new Error('Invalid email or password')).pipe(delay(1000));
  }
}
