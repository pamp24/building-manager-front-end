import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../components/_helpers/user';
import { Observable } from 'rxjs';
import { UserUpdateDTO } from 'src/app/theme/shared/models/UserUpdateDTO';

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
  assignRole(userId: number, role: string): Observable<void> {
  return this.http.post<void>(`http://localhost:8080/api/v1/users/${userId}/roles/assign`, null, {
    params: { roleName: role }
  });
}
}
