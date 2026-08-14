/* eslint-disable @typescript-eslint/no-explicit-any */
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../components/_helpers/user';
import { Observable } from 'rxjs';
import { UserUpdateDTO } from 'src/app/theme/shared/models/UserUpdateDTO';
import { UserTableDto } from 'src/app/theme/shared/models/userTableDTO';
import { AdminUserDTO } from 'src/app/theme/shared/models/adminUserDTO';
import { inviteRequest } from '../models/inviteRequest';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1`;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`);
  }

  updateUser(user: UserUpdateDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/update`, user);
  }

  removeUserFromBuilding(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}/building`);
  }

  assignRole(userId: number, role: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/${userId}/roles/assign`, null, {
      params: { roleName: role }
    });
  }

  getUsersInSameBuilding(): Observable<UserTableDto[]> {
    return this.http.get<UserTableDto[]>(`${this.apiUrl}/users/same-building`);
  }

  getAllUsers(): Observable<AdminUserDTO[]> {
    return this.http.get<AdminUserDTO[]>(`${this.apiUrl}/users`);
  }

  setUserEnabled(userId: number, enabled: boolean): Observable<AdminUserDTO> {
    return this.http.put<AdminUserDTO>(`${this.apiUrl}/users/${userId}/enable`, null, {
      params: { enabled }
    });
  }

  softDeleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  inviteUserToBuilding(payload: inviteRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/invites`, payload);
  }

  acceptInvite(code: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/invites/accept`, {}, { params: { code } });
  }

  uploadProfileImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/users/me/profile-image`, formData);
  }

  updateProfessionalsFavoritesOnly(enabled: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/preferences/professionals-favorites-only?enabled=${enabled}`, {});
  }
}
