export type SupportTicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_RESIDENT' | 'RESOLVED' | 'CLOSED' | 'REJECTED';

export type SupportTicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type SupportTicketCategory =
  | 'MAINTENANCE'
  | 'PAYMENTS'
  | 'DOCUMENTS'
  | 'COMPLAINT'
  | 'CLEANING'
  | 'HEATING'
  | 'ELEVATOR'
  | 'PLUMBING'
  | 'ELECTRICAL'
  | 'OTHER';

export type SupportTicketTargetRole = 'ADMIN' | 'PROPERTY_MANAGER' | 'BUILDING_MANAGER';

export interface SupportTicketRequest {
  buildingId: number;
  apartmentId?: number | null;
  title: string;
  description: string;
  priority: SupportTicketPriority;
  category: SupportTicketCategory;
  targetRole: SupportTicketTargetRole;
}

export interface SupportTicketResponse {
  id: number;
  ticketNumber: string;
  title: string;
  description: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  category: SupportTicketCategory;
  targetRole: SupportTicketTargetRole;
  buildingId: number;
  buildingName: string;
  apartmentId?: number | null;
  apartmentLabel?: string | null;
  createdByUserId: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
  assignedAgentId?: number | null;
  assignedAgentName?: string | null;
}

export interface TicketAgentResponse {
  id: number;
  fullName: string;
}

export type TicketCommentType = 'REPLY' | 'INTERNAL_NOTE';

export interface TicketCommentRequest {
  message: string;
  type: TicketCommentType;
}

export interface TicketCommentResponse {
  id: number;
  message: string;
  type: TicketCommentType;
  createdByName: string;
  createdAt: string;
}