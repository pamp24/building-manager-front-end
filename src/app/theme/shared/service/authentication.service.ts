import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AuthenticationResponse } from '../models/authentication-response.model';
import { User } from 'src/app/theme/shared/components/_helpers/user';
import { RegistrationRequest } from '../models/registration-request';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private router = inject(Router);
  private http = inject(HttpClient);

  private currentUser: User | null = null;

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser) as User;
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUser;
  }

  login(email: string, password: string): Observable<AuthenticationResponse> {
  return this.http
    .post<AuthenticationResponse>('http://localhost:8080/api/v1/auth/authenticate', {
      email,
      password
    })
    .pipe(
      map((response: AuthenticationResponse) => {
        const user: User = {
          ...response.user,
          role: response.user.role 
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('token', response.token);
        this.currentUser = user;

        return {
          token: response.token,
          user: user
        };
      })
    );
}



  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  register(request: RegistrationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>('http://localhost:8080/api/v1/auth/register', request);
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
  confirm(token: string) {
    return this.http.post('http://localhost:8080/api/v1/auth/activate-account', { token });
  }
  sendResetPasswordEmail(email: string) {
    console.log('Κλήση API για forgot-password με email:', email);
    return this.http.post('http://localhost:8080/api/v1/auth/forgot-password', { email });
  }
  resetPassword(token: string, newPassword: string): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>('http://localhost:8080/api/v1/auth/reset-password', {
      token,
      newPassword
    });
  }
}
