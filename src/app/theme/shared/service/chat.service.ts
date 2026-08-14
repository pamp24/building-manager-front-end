import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConversationDTO } from '../models/conversationDTO';
import { ChatMessageDTO } from '../models/chatMessageDTO';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = `${environment.apiUrl}/api/v1/conversations`;

  constructor(private http: HttpClient) {}

  getConversations(): Observable<ConversationDTO[]> {
    return this.http.get<ConversationDTO[]>(`${this.apiUrl}`);
  }

  getOrCreateBuildingConversation(buildingId: number): Observable<ConversationDTO> {
    return this.http.post<ConversationDTO>(`${this.apiUrl}/building/${buildingId}`, {});
  }

  getOrCreatePrivateConversation(userId: number): Observable<ConversationDTO> {
    return this.http.post<ConversationDTO>(`${this.apiUrl}/private`, { userId });
  }

  getMessages(conversationId: number): Observable<ChatMessageDTO[]> {
    return this.http.get<ChatMessageDTO[]>(`${this.apiUrl}/${conversationId}/messages`);
  }

  sendMessage(conversationId: number, content: string): Observable<ChatMessageDTO> {
    return this.http.post<ChatMessageDTO>(`${this.apiUrl}/${conversationId}/messages`, { content });
  }

  sendImageMessage(conversationId: number, file: File, caption?: string): Observable<ChatMessageDTO> {
    const formData = new FormData();
    formData.append('file', file);
    if (caption) {
      formData.append('caption', caption);
    }
    return this.http.post<ChatMessageDTO>(`${this.apiUrl}/${conversationId}/messages/image`, formData);
  }
}
