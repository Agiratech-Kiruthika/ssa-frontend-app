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
      const mockToken = 'jwt-token';  
      localStorage.setItem('token', mockToken);  
      return of({ message: 'Login successful', token: mockToken }).pipe(delay(1000));
    }

    return throwError(() => new Error('Invalid email or password')).pipe(delay(1000));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
