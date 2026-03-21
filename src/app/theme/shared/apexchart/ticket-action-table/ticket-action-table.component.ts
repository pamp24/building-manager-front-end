import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  @Input() tickets: SupportTicketResponse[] = [];
  @Input() title = 'Αιτήματα που χρειάζονται ενέργεια';
  @Input() emptyMessage = 'Δεν υπάρχουν tickets που χρειάζονται άμεση ενέργεια.';
  @Input() detailsRoute = '/helpdesk/ticket/details';
  @Input() showAgentColumn = false;

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

  getPriorityLabel(priority: SupportTicketPriority): string {
    switch (priority) {
      case 'LOW':
        return 'Χαμηλή';
      case 'MEDIUM':
        return 'Μεσαία';
      case 'HIGH':
        return 'Υψηλή';
      case 'URGENT':
        return 'Επείγον';
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

    return new Date(dateString).toLocaleString('el-GR');
  }

  trackByTicketId(_: number, ticket: SupportTicketResponse): number {
    return ticket.id;
  }
}