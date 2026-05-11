import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyAgentManagementResponse, UpdatePropertyAgentBuildingsRequest } from '../models/property-agent-management';


@Injectable({
  providedIn: 'root'
})
export class PropertyAgentManagementService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/agents';

  constructor(private http: HttpClient) {}

  getMyCompanyAgents(): Observable<PropertyAgentManagementResponse[]> {
    return this.http.get<PropertyAgentManagementResponse[]>(`${this.baseUrl}/my-company`);
  }

  updateAgentBuildings(
    agentId: number,
    payload: UpdatePropertyAgentBuildingsRequest
  ): Observable<PropertyAgentManagementResponse> {
    return this.http.put<PropertyAgentManagementResponse>(`${this.baseUrl}/${agentId}/buildings`, payload);
  }

  removeAgent(agentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${agentId}`);
  }

  getAgents(): Observable<PropertyAgentManagementResponse[]> {
  return this.http.get<PropertyAgentManagementResponse[]>(this.baseUrl);
}
}