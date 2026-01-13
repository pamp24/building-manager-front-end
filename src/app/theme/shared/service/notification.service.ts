import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { NotificationDTO } from "../models/notificationDTO";

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/v1/notifications';

  constructor(private http: HttpClient) {}

  getMyNotifications(): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(`${this.apiUrl}/my`);
  }

  markAllRead(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/my/read-all`, {});
  }
}