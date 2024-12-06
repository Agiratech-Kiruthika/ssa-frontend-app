import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private apiUrl = 'http://localhost:8081/user/create'; 

  constructor(private http: HttpClient) {}

  signup(userData: any): Observable<any> {
    console.log("api call triggerrs")
    return this.http.post(this.apiUrl, userData);
  }
}
