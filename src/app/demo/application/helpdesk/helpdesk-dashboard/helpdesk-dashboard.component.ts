import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { IconService } from '@ant-design/icons-angular';
import {
  BellOutline,
  CheckCircleOutline,
  ClockCircleOutline,
  MoreOutline,
  StopOutline,
  UserOutline
} from '@ant-design/icons-angular/icons';

import { SupportTicketCategory, SupportTicketResponse, SupportTicketStatus } from 'src/app/theme/shared/models/supportTicket';
import { SupportTicketService } from 'src/app/theme/shared/service/supportTicket.service';
import { AuthenticationService } from 'src/app/theme/shared/service';
import { TicketRecentActivityTableComponent } from 'src/app/theme/shared/apexchart/ticket-recent-activity-table/ticket-recent-activity-table.component';
import { TicketActionTableComponent } from 'src/app/theme/shared/apexchart/ticket-action-table/ticket-action-table.component';

interface DashboardSummary {
  total: number;
  open: number;
  active: number;
  completed: number;
  unassigned: number;
}

interface AgentWorkloadRow {
  agentId: number;
  agentName: string;
  activeTickets: number;
  completedTickets: number;
  totalTickets: number;
}

@Component({
  selector: 'app-helpdesk-dashboard',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, TicketRecentActivityTableComponent, TicketActionTableComponent],
  templateUrl: './helpdesk-dashboard.component.html',
  styleUrl: './helpdesk-dashboard.component.scss'
})
export class HelpdeskDashboardComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);
  private supportTicketService = inject(SupportTicketService);
  private authenticationService = inject(AuthenticationService);

  loading = false;
  errorMessage = '';

  tickets: SupportTicketResponse[] = [];

  currentRole: string | null = null;

  summary: DashboardSummary = {
    total: 0,
    open: 0,
    active: 0,
    completed: 0,
    unassigned: 0
  };

  actionTickets: SupportTicketResponse[] = [];
  latestTickets: SupportTicketResponse[] = [];
  agentWorkload: AgentWorkloadRow[] = [];

  constructor() {
    this.iconService.addIcon(...[MoreOutline, BellOutline, ClockCircleOutline, CheckCircleOutline, StopOutline, UserOutline]);
  }

  ngOnInit(): void {
    this.currentRole = this.getCurrentRole();
    this.loadDashboardTickets();
  }

  private getCurrentRole(): string | null {
    const currentUser = this.authenticationService.currentUserValue;
    const role = currentUser?.role ?? null;

    return role ? role.trim().toUpperCase().replace(/\s+/g, '_') : null;
  }

  isPmOrAdmin(): boolean {
    return this.currentRole === 'PROPERTYMANAGER' || this.currentRole === 'PROPERTY_MANAGER' || this.currentRole === 'ADMIN';
  }

  loadDashboardTickets(): void {
    this.loading = true;
    this.errorMessage = '';

    this.supportTicketService
      .getListViewTickets()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response: SupportTicketResponse[]) => {
          this.tickets = response ?? [];
          this.buildDashboard();
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || this.uiLocale.text('Failed to load dashboard.');
          this.tickets = [];
          this.buildDashboard();
        }
      });
  }

  private buildDashboard(): void {
    const tickets = [...this.tickets];

    this.summary = {
      total: tickets.length,
      open: tickets.filter((t) => t.status === 'OPEN').length,
      active: tickets.filter((t) => this.isActiveStatus(t.status)).length,
      completed: tickets.filter((t) => this.isCompletedStatus(t.status)).length,
      unassigned: tickets.filter((t) => !t.assignedAgentId).length
    };

    this.actionTickets = tickets
      .filter((t) => this.needsAttention(t))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 8);

    this.latestTickets = tickets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 8);

    this.agentWorkload = this.buildAgentWorkload(tickets);
  }

  private buildAgentWorkload(tickets: SupportTicketResponse[]): AgentWorkloadRow[] {
    const map = new Map<number, AgentWorkloadRow>();

    tickets.forEach((ticket) => {
      if (!ticket.assignedAgentId) {
        return;
      }

      const existing = map.get(ticket.assignedAgentId) ?? {
        agentId: ticket.assignedAgentId,
        agentName: ticket.assignedAgentName || this.uiLocale.text('Unknown agent'),
        activeTickets: 0,
        completedTickets: 0,
        totalTickets: 0
      };

      existing.totalTickets += 1;

      if (this.isActiveStatus(ticket.status) || ticket.status === 'OPEN') {
        existing.activeTickets += 1;
      }

      if (this.isCompletedStatus(ticket.status)) {
        existing.completedTickets += 1;
      }

      map.set(ticket.assignedAgentId, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.activeTickets - a.activeTickets);
  }

  needsAttention(ticket: SupportTicketResponse): boolean {
    return (
      ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS' || ticket.status === 'WAITING_FOR_RESIDENT' || !ticket.assignedAgentId
    );
  }

  isActiveStatus(status: SupportTicketStatus): boolean {
    return status === 'IN_PROGRESS' || status === 'WAITING_FOR_RESIDENT';
  }

  isCompletedStatus(status: SupportTicketStatus): boolean {
    return status === 'RESOLVED' || status === 'CLOSED';
  }

  getStatusLabel(status: SupportTicketStatus): string {
    switch (status) {
      case 'OPEN':
        return this.uiLocale.text('Open');
      case 'IN_PROGRESS':
        return this.uiLocale.text('In progress');
      case 'WAITING_FOR_RESIDENT':
        return this.uiLocale.text('Waiting by a resident');
      case 'RESOLVED':
        return this.uiLocale.text('It has been resolved');
      case 'CLOSED':
        return this.uiLocale.text('Closed');
      case 'REJECTED':
        return this.uiLocale.text('It was rejected');
      default:
        return status;
    }
  }

  getCategoryLabel(category: SupportTicketCategory): string {
    switch (category) {
      case 'MAINTENANCE':
        return this.uiLocale.text('Maintenance');
      case 'PAYMENTS':
        return this.uiLocale.text('Payments');
      case 'DOCUMENTS':
        return this.uiLocale.text('Documents');
      case 'COMPLAINT':
        return this.uiLocale.text('Complaint');
      case 'CLEANING':
        return this.uiLocale.text('Cleanliness');
      case 'HEATING':
        return this.uiLocale.text('Heating');
      case 'ELEVATOR':
        return this.uiLocale.text('Elevator');
      case 'PLUMBING':
        return this.uiLocale.text('Plumbing');
      case 'ELECTRICAL':
        return this.uiLocale.text('Electrically');
      case 'OTHER':
        return this.uiLocale.text('So');
      default:
        return category;
    }
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'LOW':
        return this.uiLocale.text('Low');
      case 'MEDIUM':
        return this.uiLocale.text('Medium');
      case 'HIGH':
        return this.uiLocale.text('High');
      case 'URGENT':
        return this.uiLocale.text('urgent');
      default:
        return priority;
    }
  }

  getStatusBadgeClass(status: SupportTicketStatus): string {
    switch (status) {
      case 'OPEN':
        return 'bg-light-primary text-primary';
      case 'IN_PROGRESS':
        return 'bg-light-warning text-warning';
      case 'WAITING_FOR_RESIDENT':
        return 'bg-light-info text-info';
      case 'RESOLVED':
        return 'bg-light-success text-success';
      case 'CLOSED':
        return 'bg-light-secondary text-secondary';
      case 'REJECTED':
        return 'bg-light-danger text-danger';
      default:
        return 'bg-light-secondary text-secondary';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'LOW':
        return 'bg-light-secondary text-secondary';
      case 'MEDIUM':
        return 'bg-light-info text-info';
      case 'HIGH':
        return 'bg-light-warning text-warning';
      case 'URGENT':
        return 'bg-light-danger text-danger';
      default:
        return 'bg-light-secondary text-secondary';
    }
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) {
      return '-';
    }

    return new Date(dateString).toLocaleString(this.uiLocale.locale);
  }

  trackByTicketId(_: number, ticket: SupportTicketResponse): number {
    return ticket.id;
  }

  trackByAgentId(_: number, agent: AgentWorkloadRow): number {
    return agent.agentId;
  }
}
