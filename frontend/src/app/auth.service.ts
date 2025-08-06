import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  getRegistrationOptions(username: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/register-options?username=${encodeURIComponent(username)}`);
  }

  verifyRegistration(username: string, credential: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register-verify`, { username, credential });
  }

  getLoginOptions(username: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/login-options?username=${encodeURIComponent(username)}`);
  }

  verifyLogin(username: string, credential: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login-verify`, { username, credential });
  }
}