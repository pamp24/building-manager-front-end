import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, EventEmitter, OnInit, Output } from '@angular/core';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NotificationService } from 'src/app/theme/shared/service/notification.service';
import { NotificationDTO } from 'src/app/theme/shared/models/notificationDTO';
import { ScrollbarComponent } from 'src/app/theme/shared/components/scrollbar/scrollbar.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { IconService } from '@ant-design/icons-angular';
import {
  UserAddOutline,
  CheckCircleOutline,
  FileTextOutline,
  NotificationOutline,
  ClockCircleOutline,
  CalendarOutline,
  ShopOutline,
  BellOutline
} from '@ant-design/icons-angular/icons';

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
  private readonly uiLocale = inject(UiLocaleService);

  @Output() closeDropdown = new EventEmitter<void>();
  @Output() unreadCountChange = new EventEmitter<number>();

  notifications: UiNotification[] = [];
  unreadCount = 0;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private iconService: IconService
  ) {
    this.iconService.addIcon(
      ...[
        UserAddOutline,
        CheckCircleOutline,
        FileTextOutline,
        NotificationOutline,
        ClockCircleOutline,
        CalendarOutline,
        ShopOutline,
        BellOutline
      ]
    );
  }

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
        const fullName = [p?.joinerLastName, p?.joinerFirstName].filter(Boolean).join(' ') || this.uiLocale.text('Unknown user');

        const email = p?.joinerEmail ? ` (${p.joinerEmail})` : '';
        const buildingName = p?.buildingName ? ` στην <b>${p.buildingName}</b>` : '';

        return {
          id: n.id,
          type: n.type,
          avatarClass: 'user-avatar bg-light-warning',
          iconClass: 'user-add',
          time,
          message:
            this.uiLocale.text('New user <b>{{p0}}</b>{{p1}} logged in <b>{{p2}}</b>.', { p0: fullName, p1: email, p2: buildingName }) +
            this.uiLocale.text('Waiting for <b>apartment assignment</b>.'),
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
          message: this.uiLocale.text('You were assigned an <b>apartment {{p0}}</b>{{p1}}{{p2}}.', {
            p0: fullApartment,
            p1: buildingName,
            p2: role
          }),
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
          message: this.uiLocale.text('A new document <b>{{p0}}</b> ({{p1}}) has been issued.', { p0: code, p1: month }),
          date,
          payloadObj: p
        };
      }
      case 'POLL_CREATED': {
        return {
          id: n.id,
          type: n.type,
          avatarClass: 'user-avatar bg-light-info',
          iconClass: 'notification',
          time,
          message: n.message ?? this.uiLocale.text('New poll created.'),
          date,
          payloadObj: p
        };
      }
      case 'POLL_EXPIRED': {
        return {
          id: n.id,
          type: n.type,
          avatarClass: 'user-avatar bg-light-danger',
          iconClass: 'clock-circle',
          time,
          message: n.message ?? this.uiLocale.text('Voting has ended.'),
          date,
          payloadObj: p
        };
      }
      case 'CALENDAR_EVENT_CREATED': {
        return {
          id: n.id,
          type: n.type,
          avatarClass: 'user-avatar bg-light-info',
          iconClass: 'calendar',
          time,
          message: n.message ?? this.uiLocale.text('New calendar event.'),
          date,
          payloadObj: p
        };
      }
      case 'PROFESSIONAL_PENDING_APPROVAL': {
        const businessName = (p as any)?.businessName ?? this.uiLocale.text('New business');

        return {
          id: n.id,
          type: n.type,
          avatarClass: 'user-avatar bg-light-info',
          iconClass: 'shop',
          time,
          message: this.uiLocale.text('New <b>professional {{p0}}</b> awaiting approval.', { p0: businessName }),
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
          message: n.message ?? this.uiLocale.text('New notification.'),
          date,
          payloadObj: p
        };
    }
  }

  openNotification(item: UiNotification): void {
    const p: any = item.payloadObj || null;

    // Νέα ψηφοφορία
    if (item.type === 'POLL_CREATED' && p?.pollId) {
      this.router.navigate(['/polls'], {
        queryParams: {
          buildingId: p.buildingId,
          pollId: p.pollId
        }
      });

      this.close();
      return;
    }

    //παραστατικό
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

    if (item.type === 'POLL_EXPIRED' && p?.pollId) {
      this.router.navigate(['/polls'], {
        queryParams: {
          buildingId: p.buildingId,
          pollId: p.pollId
        }
      });

      this.close();
      return;
    }

    if (item.type === 'PROFESSIONAL_PENDING_APPROVAL') {
      this.router.navigate(['/professionals/approval']);
      this.close();
      return;
    }

    if (item.type === 'CALENDAR_EVENT_CREATED' && p?.calendarEventId) {
      this.router.navigate(['/calendar'], {
        queryParams: {
          buildingId: p.buildingId,
          eventId: p.calendarEventId
        }
      });

      this.close();
      return;
    }

    const tab = p?.tab ?? (item.type === 'APARTMENT_ASSIGNED' ? 'my-apartment' : item.type === 'MEMBER_JOIN_REQUEST' ? 'members' : null);

    const queryParams: any = {};

    if (tab) queryParams.tab = tab;
    if (p?.buildingId) queryParams.buildingId = p.buildingId;
    if (p?.apartmentId) queryParams.apartmentId = p.apartmentId;

    this.router.navigate(['/user/account-profile'], { queryParams });

    this.close();
  }
}
