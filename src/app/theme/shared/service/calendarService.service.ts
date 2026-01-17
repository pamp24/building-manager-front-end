/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarDTO } from '../models/calendarDTO';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private baseUrl = `http://localhost:8080/api/v1/calendar`;

  constructor(private http: HttpClient) {}

  getByBuilding(buildingId: number): Observable<CalendarDTO[]> {
  return this.http.get<CalendarDTO[]>(`${this.baseUrl}/building/${buildingId}`);
}

  create(event: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, event);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  update(event: any) {
    return this.http.put(`${this.baseUrl}/${event.id}`, event);
  }
  pinEvent(id: number, pinned: boolean) {
  return this.http.put<CalendarDTO>(`${this.baseUrl}/${id}/pin?pinned=${pinned}`, {});
  }
}
