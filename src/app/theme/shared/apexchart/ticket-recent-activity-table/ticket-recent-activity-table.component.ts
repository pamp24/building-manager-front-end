import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {
  SupportTicketCategory,
  SupportTicketResponse,
  SupportTicketStatus
} from 'src/app/theme/shared/models/supportTicket';

@Component({
  selector: 'app-ticket-recent-activity-table',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './ticket-recent-activity-table.component.html',
  styleUrl: './ticket-recent-activity-table.component.scss'
})
export class TicketRecentActivityTableComponent {
  @Input() tickets: SupportTicketResponse[] = [];
  @Input() title = 'Πρόσφατες κινήσεις Ticket';
  @Input() emptyMessage = 'Δεν υπάρχουν πρόσφατες κινήσεις.';
  @Input() detailsRoute = '/helpdesk/ticket/details';

  getStatusLabel(status: SupportTicketStatus): string {
    switch (status) {
      case 'OPEN':
        return 'Ανοιχτό';
      case 'IN_PROGRESS':
        return 'Σε εξέλιξη';
      case 'WAITING_FOR_RESIDENT':
        return 'Αναμονή από κάτοικο';
      case 'RESOLVED':
        return 'Επιλύθηκε';
      case 'CLOSED':
        return 'Κλειστό';
      case 'REJECTED':
        return 'Απορρίφθηκε';
      default:
        return status;
    }
  }

  getCategoryLabel(category: SupportTicketCategory): string {
    switch (category) {
      case 'MAINTENANCE':
        return 'Συντήρηση';
      case 'PAYMENTS':
        return 'Πληρωμές';
      case 'DOCUMENTS':
        return 'Έγγραφα';
      case 'COMPLAINT':
        return 'Παράπονο';
      case 'CLEANING':
        return 'Καθαριότητα';
      case 'HEATING':
        return 'Θέρμανση';
      case 'ELEVATOR':
        return 'Ασανσέρ';
      case 'PLUMBING':
        return 'Υδραυλικά';
      case 'ELECTRICAL':
        return 'Ηλεκτρολογικά';
      case 'OTHER':
        return 'Λοιπά';
      default:
        return category;
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

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) {
      return '-';
    }

    return new Date(dateString).toLocaleString('el-GR');
  }

  trackByTicketId(_: number, ticket: SupportTicketResponse): number {
    return ticket.id;
  }
}