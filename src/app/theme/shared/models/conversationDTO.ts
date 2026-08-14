export interface ParticipantDTO {
  userId: number;
  fullName: string;
  profileImageUrl?: string;
}

export interface ConversationDTO {
  id: number;
  type: 'BUILDING' | 'PRIVATE';
  buildingId?: number;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  members?: ParticipantDTO[];
}
