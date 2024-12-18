import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private readonly apiUrl = `${environment.apiUrl}/user/login`;

  login(email: string, password: string): Observable<any> {
    const loginPayload = { email, password };

    return this.http.post<any>(this.apiUrl, loginPayload).pipe(
      map((response) => {
        if (response) {

          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.userId);

          return response.data;
        } else {
          throw new Error(response.status?.description || 'Login failed');
        }
      }),
      catchError((err) => {
        return throwError(() => new Error(err));
      })
    );
  }



  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
}
