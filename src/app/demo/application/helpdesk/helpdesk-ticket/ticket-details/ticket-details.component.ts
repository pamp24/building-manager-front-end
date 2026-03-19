import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import {
  SupportTicketResponse,
  SupportTicketStatus,
  TicketAgentResponse,
  TicketCommentResponse
} from 'src/app/theme/shared/models/supportTicket';
import { SupportTicketService } from 'src/app/theme/shared/service/supportTicket.service';

import { IconService } from '@ant-design/icons-angular';
import {
  ArrowLeftOutline,
  CalendarOutline,
  ClockCircleOutline,
  DeleteOutline,
  EditOutline,
  LikeOutline,
  LockOutline,
  MailOutline,
  MessageOutline,
  StarOutline,
  UserOutline
} from '@ant-design/icons-angular/icons';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule],
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.scss'
})
export class TicketDetailsComponent implements OnInit {
  private iconService = inject(IconService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private supportTicketService = inject(SupportTicketService);

  ticket: SupportTicketResponse | null = null;
  loading = false;
  errorMessage = '';

  agents: TicketAgentResponse[] = [];
  comments: TicketCommentResponse[] = [];

  commentMessage = '';
  submittingComment = false;

  readonly statuses: SupportTicketStatus[] = ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_RESIDENT', 'RESOLVED', 'CLOSED', 'REJECTED'];

  replyForm = this.fb.group({
    message: ['', [Validators.required, Validators.minLength(2)]]
  });

  noteForm = this.fb.group({
    message: ['', [Validators.required, Validators.minLength(2)]]
  });

  selectedStatus: SupportTicketStatus | null = null;
  selectedAgentId: number | null = null;

  submittingReply = false;
  submittingNote = false;
  updatingStatus = false;
  assigningAgent = false;
  deleting = false;

  constructor() {
    this.iconService.addIcon(
      ...[
        StarOutline,
        LockOutline,
        MessageOutline,
        EditOutline,
        UserOutline,
        DeleteOutline,
        LikeOutline,
        MailOutline,
        CalendarOutline,
        ClockCircleOutline,
        ArrowLeftOutline
      ]
    );
  }

  ngOnInit(): void {
    const ticketIdParam = this.route.snapshot.paramMap.get('id');

    if (!ticketIdParam) {
      this.errorMessage = 'Δεν βρέθηκε το id του ticket.';
      return;
    }

    const ticketId = Number(ticketIdParam);

    if (Number.isNaN(ticketId)) {
      this.errorMessage = 'Μη έγκυρο id ticket.';
      return;
    }

    this.loadTicket(ticketId);
    this.loadAgents();
    this.loadComments(ticketId);
  }

  goBack(): void {
    this.router.navigate(['/helpdesk/ticket/list']);
  }

  loadTicket(ticketId: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.supportTicketService
      .getTicketById(ticketId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response: SupportTicketResponse) => {
          this.ticket = response;
          this.selectedStatus = response.status;
          this.selectedAgentId = response.assignedAgentId ?? null;
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Αποτυχία φόρτωσης ticket.';
          this.ticket = null;
        }
      });
  }

  loadAgents(): void {
    this.supportTicketService.getAvailableAgents().subscribe({
      next: (response) => {
        this.agents = response ?? [];
      },
      error: () => {
        this.agents = [];
      }
    });
  }

  loadComments(ticketId: number): void {
    this.supportTicketService.getComments(ticketId).subscribe({
      next: (response) => {
        this.comments = response ?? [];
      },
      error: () => {
        this.comments = [];
      }
    });
  }

  onStatusChange(): void {
    if (!this.ticket || !this.selectedStatus || !this.canChangeStatus()) {
      return;
    }

    this.supportTicketService.updateStatus(this.ticket.id, this.selectedStatus).subscribe({
      next: (updated) => {
        this.ticket = updated;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Αποτυχία ενημέρωσης status.';
      }
    });
  }

  onAssignAgent(): void {
    if (!this.ticket || this.selectedAgentId == null || !this.canAssignAgent()) {
      return;
    }

    this.assigningAgent = true;

    this.supportTicketService
      .assignAgent(this.ticket.id, this.selectedAgentId)
      .pipe(finalize(() => (this.assigningAgent = false)))
      .subscribe({
        next: (updated) => {
          this.ticket = updated;
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Αποτυχία ανάθεσης agent.';
        }
      });
  }

  submitComment(type: 'REPLY' | 'INTERNAL_NOTE'): void {
    if (!this.ticket || !this.commentMessage?.trim()) {
      return;
    }

    this.submittingComment = true;

    this.supportTicketService
      .addComment(this.ticket.id, {
        message: this.commentMessage.trim(),
        type
      })
      .pipe(finalize(() => (this.submittingComment = false)))
      .subscribe({
        next: (res) => {
          this.comments.push(res);
          this.commentMessage = '';
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Αποτυχία αποστολής σχολίου.';
        }
      });
  }

  onDeleteTicket(): void {
    if (!this.ticket) {
      return;
    }

    const confirmed = confirm('Θέλεις σίγουρα να διαγράψεις αυτό το ticket;');
    if (!confirmed) {
      return;
    }

    this.deleting = true;

    this.supportTicketService
      .deleteTicket(this.ticket.id)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/helpdesk/ticket/list']);
        },
        error: (error) => {
          this.errorMessage = error?.error?.message || 'Αποτυχία διαγραφής ticket.';
        }
      });
  }

  getStatusLabel(status: string | undefined): string {
    switch (status) {
      case 'OPEN':
        return 'Ανοιχτό';
      case 'IN_PROGRESS':
        return 'Σε Εξέλιξη';
      case 'WAITING_FOR_RESIDENT':
        return 'Αναμονή από κάτοικο';
      case 'RESOLVED':
        return 'Επιλύθηκε';
      case 'CLOSED':
        return 'Κλειστό';
      case 'REJECTED':
        return 'Απορρίφθηκε';
      default:
        return status ?? '-';
    }
  }

  getPriorityLabel(priority: string | undefined): string {
    switch (priority) {
      case 'LOW':
        return 'Χαμηλή';
      case 'MEDIUM':
        return 'Μεσαία';
      case 'HIGH':
        return 'Υψηλή';
      case 'URGENT':
        return 'Επείγουσα';
      default:
        return priority ?? '-';
    }
  }

  getCategoryLabel(category: string | undefined): string {
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
        return 'Καθαρισμός';
      case 'HEATING':
        return 'Θέρμανση';
      case 'ELEVATOR':
        return 'Ασανσέρ';
      case 'PLUMBING':
        return 'Υδραυλικά';
      case 'ELECTRICAL':
        return 'Ηλεκτρολογικά';
      case 'OTHER':
        return 'Άλλο';
      default:
        return category ?? '-';
    }
  }

  getTargetRoleLabel(targetRole: string | undefined): string {
    switch (targetRole) {
      case 'ADMIN':
        return 'Admin';
      case 'PROPERTY_MANAGER':
        return 'Property Manager';
      case 'BUILDING_MANAGER':
        return 'Building Manager';
      default:
        return targetRole ?? '-';
    }
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'OPEN':
        return 'bg-light-primary';
      case 'IN_PROGRESS':
        return 'bg-light-warning';
      case 'WAITING_FOR_RESIDENT':
        return 'bg-light-info';
      case 'RESOLVED':
        return 'bg-light-success';
      case 'CLOSED':
        return 'bg-light-secondary';
      case 'REJECTED':
        return 'bg-light-danger';
      default:
        return 'bg-light-secondary';
    }
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) {
      return '-';
    }

    return new Date(dateString).toLocaleString('el-GR');
  }

  isInternalComment(type: string): boolean {
    return type === 'INTERNAL_NOTE';
  }

  isCurrentUserCreator(): boolean {
    if (!this.ticket) {
      return false;
    }

    const currentUserId = Number(localStorage.getItem('userId'));
    return this.ticket.createdByUserId === currentUserId;
  }

  isManagedByPropertyManager(): boolean {
    return this.ticket?.targetRole === 'PROPERTY_MANAGER';
  }

  canChangeStatus(): boolean {
    if (!this.ticket) {
      return false;
    }

    return !this.isCurrentUserCreator();
  }

  canAssignAgent(): boolean {
    if (!this.ticket) {
      return false;
    }

    return !this.isCurrentUserCreator() && this.isManagedByPropertyManager();
  }

  canSeeInternalNote(): boolean {
    if (!this.ticket) {
      return false;
    }

    return !this.isCurrentUserCreator() && this.isManagedByPropertyManager();
  }
}
