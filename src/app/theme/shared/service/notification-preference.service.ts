import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationPreferenceDTO } from '../models/notificationPreferenceDTO';

@Injectable({ providedIn: 'root' })
export class NotificationPreferenceService {
  private apiUrl = `${environment.apiUrl}/api/v1/notification-preferences`;

  constructor(private http: HttpClient) {}

  getPreferences(): Observable<NotificationPreferenceDTO> {
    return this.http.get<NotificationPreferenceDTO>(this.apiUrl);
  }

  updatePreferences(payload: NotificationPreferenceDTO): Observable<NotificationPreferenceDTO> {
    return this.http.put<NotificationPreferenceDTO>(this.apiUrl, payload);
  }
}
