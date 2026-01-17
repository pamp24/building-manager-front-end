/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotificationService } from 'src/app/theme/shared/service/notification.service';
import { NotificationDTO } from 'src/app/theme/shared/models/notificationDTO';
import { ScrollbarComponent } from 'src/app/theme/shared/components/scrollbar/scrollbar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

type UiNotification = {
  id: number;
  type: string;
  avatarClass: string;
  iconClass: string;
  time: string;
  message: string;
  date: string;
  payloadObj?: any;
};

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, SharedModule, ScrollbarComponent, NgbDropdownModule],
  templateUrl: './notification-dropdown.component.html'
})
export class NotificationDropdownComponent implements OnInit {
  @Output() closeDropdown = new EventEmitter<void>();
  @Output() unreadCountChange = new EventEmitter<number>();

  notifications: UiNotification[] = [];
  unreadCount = 0;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.notificationService.getMyNotifications().subscribe({
      next: (list) => {
        console.log('NOTIFICATIONS FROM API:', list);
        this.notifications = list.map((n) => this.mapToUi(n));
        this.unreadCount = list.filter((n) => !n.read).length;
        this.unreadCountChange.emit(this.unreadCount);
      },
      error: (err) => console.error('NOTIF ERROR', err)
    });
  }

  markAllRead(): void {
    this.notificationService.markAllRead().subscribe({
      next: () => {
        this.unreadCount = 0;
        this.unreadCountChange.emit(0);
        // αν θες να αδειάζει το badge αλλά να μένουν items:
        // κράτα τα ίδια notifications απλά χωρίς "unread" state
      },
      error: (err) => console.error('Mark all read failed', err)
    });
  }

  close(): void {
    this.closeDropdown.emit();
  }

  private mapToUi(n: NotificationDTO): UiNotification {
    const d = new Date(n.createdAt);
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = d.toLocaleDateString();

    // ασφαλές parse payload
    let p: {
      joinerFirstName?: string;
      joinerLastName?: string;
      joinerEmail?: string;
      buildingName?: string;
      apartmentFloor?: string;
      apartmentNumber?: string;
      assignedRole?: string;
    } | null = null;

    if (n.payload) {
      try {
        p = JSON.parse(n.payload);
      } catch {
        p = null;
      }
    }

    switch (n.type) {
      case 'PENDING_APARTMENT': {
        const fullName = [p?.joinerLastName, p?.joinerFirstName].filter(Boolean).join(' ') || 'Άγνωστος χρήστης';

        const email = p?.joinerEmail ? ` (${p.joinerEmail})` : '';
        const buildingName = p?.buildingName ? ` στην <b>${p.buildingName}</b>` : '';

        return {
          id: n.id,
          type: n.type,
          avatarClass: 'user-avatar bg-light-warning',
          iconClass: 'user-add',
          time,
          message:
            `Νέος χρήστης <b>${fullName}</b>${email} συνδέθηκε <b>${buildingName}</b>. ` + `Αναμονή για <b>ανάθεση διαμερίσματος</b>.`,
          date,
          payloadObj: p
        };
      }
      case 'APARTMENT_ASSIGNED': {
        const fullApartment = [p?.apartmentFloor, p?.apartmentNumber].filter(Boolean).join(' ') || '—';

        const buildingName = p?.buildingName ? ` στην <b>${p.buildingName}</b>` : '';
        const role = p?.assignedRole ? ` ως <b>${p.assignedRole}</b>` : '';

        return {
          id: n.id,
          type: n.type,
          avatarClass: 'user-avatar bg-light-success',
          iconClass: 'check-circle',
          time,
          message: `Σου ανατέθηκε διαμέρισμα <b>${fullApartment}</b>${buildingName}${role}.`,
          date,
          payloadObj: p
        };
      }
      case 'NEW_STATEMENT': {
        const code = (p as any)?.code ?? '';
        const month = (p as any)?.month ?? '';
        return {
          id: n.id,
          type: n.type,
          avatarClass: 'user-avatar bg-light-primary',
          iconClass: 'file-text',
          time,
          message: `Εκδόθηκε νέο παραστατικό <b>${code}</b> (${month}).`,
          date,
          payloadObj: p
        };
      }

      default:
        return {
          id: n.id,
          type: n.type,
          avatarClass: 'user-avatar bg-light-primary',
          iconClass: 'bell',
          time,
          message: n.message ?? 'Νέα ειδοποίηση.',
          date,
          payloadObj: p
        };
    }
  }

  openNotification(item: UiNotification): void {
    const p: any = item.payloadObj || null;

    //Αν είναι νέο παραστατικό → πήγαινε στα invoices
    if (item.type === 'NEW_STATEMENT' && p?.statementId) {
      this.router.navigate(['/dashboard/default'], {
        queryParams: {
          buildingId: p.buildingId,
          statementId: p.statementId
        }
      });
      this.close();
      return;
    }

    //Αν είναι ανάθεση διαμερίσματος → πήγαινε στο προφίλ με το σωστό tab
    const tab = p?.tab ?? (item.type === 'APARTMENT_ASSIGNED' ? 'my-apartment' : item.type === 'MEMBER_JOIN_REQUEST' ? 'members' : null);

    const queryParams: any = {};
    if (tab) queryParams.tab = tab;
    if (p?.buildingId) queryParams.buildingId = p.buildingId;
    if (p?.apartmentId) queryParams.apartmentId = p.apartmentId;

    this.router.navigate(['/user/account-profile'], { queryParams });

    this.close();
  }
}
