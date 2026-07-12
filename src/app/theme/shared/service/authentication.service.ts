import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AuthenticationResponse } from '../models/authentication-response.model';
import { User } from 'src/app/theme/shared/components/_helpers/user';
import { RegistrationRequest } from '../models/registration-request';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private router = inject(Router);
  private http = inject(HttpClient);

  private currentUser: User | null = null;

  constructor(private userService: UserService) {
    const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');

    if (storedUser) {
      this.currentUser = JSON.parse(storedUser) as User;
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUser;
  }

  login(email: string, password: string, rememberMe: boolean): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>('http://localhost:8080/api/v1/auth/authenticate', {
        email,
        password,
        rememberMe
      })
      .pipe(
        map((response: AuthenticationResponse) => {
          const user: User = {
            ...response.user,
            role: response.user.role
          };

          const storage = rememberMe ? localStorage : sessionStorage;

          storage.setItem('token', response.token);
          this.persistCurrentUser(user, storage);

          return {
            token: response.token,
            user
          };
        })
      );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
  }

  register(request: RegistrationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>('http://localhost:8080/api/v1/auth/register', request);
  }

  logout(message?: string) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    localStorage.removeItem('buildingId');
    sessionStorage.removeItem('buildingId');

    this.currentUser = null;

    this.router.navigate(['/login'], {
      queryParams: message ? { reason: message } : {}
    });
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

  getUser() {
    const userJson = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');

    return userJson ? JSON.parse(userJson) : null;
  }

  updateCurrentUserProfileImage(profileImageUrl: string) {
    const stored = localStorage.getItem('currentUser');
    if (!stored) return;

    const user = JSON.parse(stored);
    user.profileImageUrl = profileImageUrl;

    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser = user; // refresh runtime value
  }

  getCurrentUserRole(): string | null {
    return localStorage.getItem('role');
  }

  refreshCurrentUser(): Observable<User> {
    return this.userService.getCurrentUser().pipe(
      tap((user) => {
        this.persistCurrentUser(user);
      })
    );
  }

  refreshCurrentUserAndReload(targetUrl?: string): void {
    this.refreshCurrentUser().subscribe({
      next: (user) => {
        window.location.href = targetUrl ?? this.getDefaultRouteForRole(user.role);
      },
      error: () => {
        window.location.href = targetUrl ?? this.getDefaultRouteForRole(this.currentUserValue?.role);
      }
    });
  }

  private persistCurrentUser(user: User, storage: Storage = this.getActiveStorage()): void {
    storage.setItem('currentUser', JSON.stringify(user));

    if (storage === localStorage) {
      sessionStorage.removeItem('currentUser');
    } else {
      localStorage.removeItem('currentUser');
    }

    if (user.currentBuildingId) {
      localStorage.setItem('buildingId', String(user.currentBuildingId));
      sessionStorage.setItem('buildingId', String(user.currentBuildingId));
    } else {
      localStorage.removeItem('buildingId');
      sessionStorage.removeItem('buildingId');
    }

    this.currentUser = user;
  }

  private getActiveStorage(): Storage {
    if (localStorage.getItem('token') || localStorage.getItem('currentUser')) {
      return localStorage;
    }

    return sessionStorage;
  }

  private getDefaultRouteForRole(role: string | undefined): string {
    switch (role) {
      case 'Admin':
        return '/admin/dashboard';
      case 'PropertyManager':
      case 'PropertyAgent':
      case 'AdminAgent':
        return '/pm/pm-dashboard';
      case 'BuildingManager':
        return '/statement/dashboard';
      default:
        return '/dashboard/default';
    }
  }
}
