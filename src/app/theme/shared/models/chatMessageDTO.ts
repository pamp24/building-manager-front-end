export interface ChatMessageDTO {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  mine: boolean;
}
