import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketResponse,
  SupportTicketStatus
} from 'src/app/theme/shared/models/supportTicket';

@Component({
  selector: 'app-ticket-action-table',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './ticket-action-table.component.html',
  styleUrl: './ticket-action-table.component.scss'
})
export class TicketActionTableComponent {
  private readonly uiLocale = inject(UiLocaleService);

  @Input() tickets: SupportTicketResponse[] = [];
  @Input() title = this.uiLocale.text('Requests that need energy');
  @Input() emptyMessage = this.uiLocale.text('There are no tickets that require immediate action.');
  @Input() detailsRoute = '/helpdesk/ticket/details';
  @Input() showAgentColumn = false;

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

  getPriorityLabel(priority: SupportTicketPriority): string {
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

  getPriorityBadgeClass(priority: SupportTicketPriority): string {
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
}
