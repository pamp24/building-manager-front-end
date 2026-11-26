import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
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
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [CommonModule, SharedModule, FormsModule],
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.scss'
})
export class TicketDetailsComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

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

  constructor(private authenticationService: AuthenticationService) {
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
      this.errorMessage = this.uiLocale.text('Ticket id not found.');
      return;
    }

    const ticketId = Number(ticketIdParam);

    if (Number.isNaN(ticketId)) {
      this.errorMessage = this.uiLocale.text('Invalid ticket id.');
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
          this.errorMessage = error?.error?.message || this.uiLocale.text('Failed to load ticket.');
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
        this.errorMessage = error?.error?.message || this.uiLocale.text('Failed to update status.');
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
          this.errorMessage = error?.error?.message || this.uiLocale.text('Failed to assign agent.');
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
          this.errorMessage = error?.error?.message || this.uiLocale.text('Failed to send comment.');
        }
      });
  }

  onDeleteTicket(): void {
    if (!this.ticket) {
      return;
    }

    const confirmed = confirm(this.uiLocale.text('Are you sure you want to delete this ticket?'));
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
          this.errorMessage = error?.error?.message || this.uiLocale.text('Failed to delete ticket.');
        }
      });
  }

  getStatusLabel(status: string | undefined): string {
    switch (status) {
      case 'OPEN':
        return this.uiLocale.text('Open');
      case 'IN_PROGRESS':
        return this.uiLocale.text('In Evolution');
      case 'WAITING_FOR_RESIDENT':
        return this.uiLocale.text('Waiting by a resident');
      case 'RESOLVED':
        return this.uiLocale.text('It has been resolved');
      case 'CLOSED':
        return this.uiLocale.text('Closed');
      case 'REJECTED':
        return this.uiLocale.text('It was rejected');
      default:
        return status ?? '-';
    }
  }

  getPriorityLabel(priority: string | undefined): string {
    switch (priority) {
      case 'LOW':
        return this.uiLocale.text('Low');
      case 'MEDIUM':
        return this.uiLocale.text('Medium');
      case 'HIGH':
        return this.uiLocale.text('High');
      case 'URGENT':
        return this.uiLocale.text('Urgent');
      default:
        return priority ?? '-';
    }
  }

  getCategoryLabel(category: string | undefined): string {
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
        return this.uiLocale.text('Cleaning');
      case 'HEATING':
        return this.uiLocale.text('Heating');
      case 'ELEVATOR':
        return this.uiLocale.text('Elevator');
      case 'PLUMBING':
        return this.uiLocale.text('Plumbing');
      case 'ELECTRICAL':
        return this.uiLocale.text('Electrically');
      case 'OTHER':
        return this.uiLocale.text('Other');
      default:
        return category ?? '-';
    }
  }

  getTargetRoleLabel(targetRole: string | undefined): string {
    switch (targetRole) {
      case 'ADMIN':
        return this.uiLocale.text('Admin');
      case 'PROPERTY_MANAGER':
        return this.uiLocale.text('Property Manager');
      case 'BUILDING_MANAGER':
        return this.uiLocale.text('Building Manager');
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

    return new Date(dateString).toLocaleString(this.uiLocale.locale);
  }

  isInternalComment(type: string): boolean {
    return type === 'INTERNAL_NOTE';
  }

  isCurrentUserCreator(): boolean {
    if (!this.ticket) {
      return false;
    }

    const currentUserId = this.getCurrentUserId();
    return currentUserId != null && this.ticket.createdByUserId === currentUserId;
  }

  isManagedByPropertyManager(): boolean {
    return this.ticket?.targetRole === 'PROPERTY_MANAGER';
  }

  canChangeStatus(): boolean {
    if (!this.ticket) {
      return false;
    }

    if (this.isCurrentUserCreator()) {
      return false;
    }

    const role = this.getCurrentUserRole();
    const userId = this.getCurrentUserId();

    return (
      ((role === 'BUILDINGMANAGER' || role === 'BUILDING_MANAGER') && this.ticket.targetRole === 'BUILDING_MANAGER') ||
      ((role === 'PROPERTYMANAGER' || role === 'PROPERTY_MANAGER') && this.ticket.targetRole === 'PROPERTY_MANAGER') ||
      ((role === 'PROPERTYAGENT' || role === 'PROPERTY_AGENT') && this.ticket.targetRole === 'PROPERTY_MANAGER') ||
      (role === 'ADMIN' && this.ticket.targetRole === 'ADMIN') ||
      ((role === 'PROPERTYAGENT' || role === 'PROPERTY_AGENT') && this.ticket.assignedAgentId === userId)
    );
  }

  canAssignAgent(): boolean {
    if (!this.ticket) {
      return false;
    }

    if (this.isCurrentUserCreator()) {
      return false;
    }

    const role = this.getCurrentUserRole();

    return (role === 'PROPERTYMANAGER' || role === 'PROPERTY_MANAGER') && this.ticket.targetRole === 'PROPERTY_MANAGER';
  }

  canSeeInternalNote(): boolean {
    if (!this.ticket) {
      return false;
    }

    if (this.isCurrentUserCreator()) {
      return false;
    }

    const role = this.getCurrentUserRole();

    return (role === 'PROPERTYMANAGER' || role === 'PROPERTY_MANAGER') && this.ticket.targetRole === 'PROPERTY_MANAGER';
  }

  getCurrentUserId(): number | null {
    const currentUser = this.authenticationService.currentUserValue;
    return currentUser?.id ?? null;
  }

  getCurrentUserRole(): string | null {
    const currentUser = this.authenticationService.currentUserValue;
    const role = currentUser?.role ?? null;

    return role ? role.trim().toUpperCase().replace(/\s+/g, '_') : null;
  }
}
