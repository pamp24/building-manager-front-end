﻿/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../components/_helpers/user';
import { Observable } from 'rxjs';
import { UserUpdateDTO } from 'src/app/theme/shared/models/UserUpdateDTO';
import { UserTableDto } from 'src/app/theme/shared/models/userTableDTO';
import { inviteRequest } from '../models/inviteRequest';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/auth/authenticate';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>('http://localhost:8080/api/v1/auth/me');
  }

  updateUser(user: UserUpdateDTO): Observable<void> {
    return this.http.put<void>('http://localhost:8080/api/v1/users/update', user);
  }

  removeUserFromBuilding(userId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/api/v1/users/${userId}/building`);
  }

  assignRole(userId: number, role: string): Observable<void> {
    return this.http.post<void>(`http://localhost:8080/api/v1/users/${userId}/roles/assign`, null, {
      params: { roleName: role }
    });
  }

  getUsersInSameBuilding(): Observable<UserTableDto[]> {
    return this.http.get<UserTableDto[]>('http://localhost:8080/api/v1/users/same-building');
  }

  inviteUserToBuilding(payload: inviteRequest): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/v1/invites', payload);
  }

  acceptInvite(code: string): Observable<void> {
    return this.http.post<void>(`http://localhost:8080/api/v1/invites/accept?code=${code}`, {});
  }
}
