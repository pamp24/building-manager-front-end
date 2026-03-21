import { SupportTicketCategory, SupportTicketResponse, SupportTicketTargetRole } from './supportTicket';

export interface TicketStatusStats {
  total: number;
  open: number;
  inProgress: number;
  waitingResident: number;
  resolved: number;
  closed: number;
  rejected: number;
  active: number;      // IN_PROGRESS + WAITING_FOR_RESIDENT
  completed: number;   // RESOLVED + CLOSED
}

export interface TicketCategoryStat {
  key: SupportTicketCategory;
  label: string;
  count: number;
  percentage: number;
}

export interface TicketTargetStat {
  key: SupportTicketTargetRole;
  label: string;
  count: number;
  percentage: number;
}

export interface TicketActionStats {
  unassigned: number;
  waitingResident: number;
  rejected: number;
  open: number;
}

export interface AgentWorkloadStat {
  agentId: number;
  agentName: string;
  activeAssignedTickets: number;
  totalAssignedTickets: number;
  completedAssignedTickets: number;
}

export interface HelpdeskDashboardViewModel {
  status: TicketStatusStats;
  categories: TicketCategoryStat[];
  targets: TicketTargetStat[];
  latestTickets: SupportTicketResponse[];
  actions: TicketActionStats;
  agentWorkload: AgentWorkloadStat[];
}