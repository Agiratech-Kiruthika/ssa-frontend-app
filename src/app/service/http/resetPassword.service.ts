import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  constructor(private http: HttpClient) {}

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/send-otp`, { email });
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/verify`, { email, otp });
  }

  resetPassword(email: string, newPassword: string, confirmPassword: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    const body = { newPassword, confirmPassword };
  
    return this.http.patch(`${environment.apiUrl}/user/reset-password`, body, { params });
  }
  
}
