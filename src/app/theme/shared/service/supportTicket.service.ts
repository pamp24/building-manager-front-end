import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SupportTicketRequest,
  SupportTicketResponse,
  SupportTicketStatus,
  TicketAgentResponse,
  TicketCommentRequest,
  TicketCommentResponse
} from '../models/supportTicket';

@Injectable({
  providedIn: 'root'
})
export class SupportTicketService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/support-tickets';

  constructor(private http: HttpClient) {}

  createTicket(payload: SupportTicketRequest): Observable<SupportTicketResponse> {
    return this.http.post<SupportTicketResponse>(this.baseUrl, payload);
  }

  getMyTickets(): Observable<SupportTicketResponse[]> {
    return this.http.get<SupportTicketResponse[]>(`${this.baseUrl}/myTickets`);
  }

  getCompanyTickets(companyId: number): Observable<SupportTicketResponse[]> {
    return this.http.get<SupportTicketResponse[]>(`${this.baseUrl}/company/${companyId}`);
  }

  getInboxTickets(): Observable<SupportTicketResponse[]> {
    return this.http.get<SupportTicketResponse[]>(`${this.baseUrl}/inbox`);
  }

  getTicketById(ticketId: number): Observable<SupportTicketResponse> {
    return this.http.get<SupportTicketResponse>(`${this.baseUrl}/${ticketId}`);
  }

  updateStatus(ticketId: number, status: SupportTicketStatus): Observable<SupportTicketResponse> {
    return this.http.patch<SupportTicketResponse>(`${this.baseUrl}/${ticketId}/status`, { status });
  }

  assignAgent(ticketId: number, agentId: number): Observable<SupportTicketResponse> {
    return this.http.patch<SupportTicketResponse>(`${this.baseUrl}/${ticketId}/assign-agent`, { agentId });
  }

  deleteTicket(ticketId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${ticketId}`);
  }

  getAvailableAgents(): Observable<TicketAgentResponse[]> {
    return this.http.get<TicketAgentResponse[]>(`${this.baseUrl}/agents`);
  }

  addComment(ticketId: number, payload: TicketCommentRequest): Observable<TicketCommentResponse> {
    return this.http.post<TicketCommentResponse>(`${this.baseUrl}/${ticketId}/comments`, payload);
  }

  getComments(ticketId: number): Observable<TicketCommentResponse[]> {
    return this.http.get<TicketCommentResponse[]>(`${this.baseUrl}/${ticketId}/comments`);
  }

  getListViewTickets(): Observable<SupportTicketResponse[]> {
    return this.http.get<SupportTicketResponse[]>(`${this.baseUrl}/list-view`);
  }
}
