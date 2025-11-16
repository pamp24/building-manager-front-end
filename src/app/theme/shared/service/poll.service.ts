/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PollService {
  private apiUrl = 'http://localhost:8080/api/v1/polls';

  constructor(private http: HttpClient) {}

  getAll(buildingId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/building/${buildingId}/all`);
  }

  getByBuilding(buildingId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/building/${buildingId}`);
  }

  create(poll: any) {
    return this.http.post(`${this.apiUrl}`, poll);
  }

  vote(pollId: number, optionId: number) {
    return this.http.post(`${this.apiUrl}/${pollId}/vote/${optionId}`, {});
  }

  getVotes(pollId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${pollId}/votes`);
  }

  deactivate(pollId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${pollId}`);
  }
}
