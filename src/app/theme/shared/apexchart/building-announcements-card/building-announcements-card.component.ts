import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IconService } from '@ant-design/icons-angular';
import { CalendarOutline, NotificationOutline, PushpinFill } from '@ant-design/icons-angular/icons';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CalendarService } from 'src/app/theme/shared/service/calendarService.service';
import { CalendarDTO } from '../../models/calendarDTO';

@Component({
  selector: 'app-building-announcements-card',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './building-announcements-card.component.html',
  styleUrls: ['./building-announcements-card.component.scss']
})
export class BuildingAnnouncementsCardComponent implements OnInit, OnChanges, OnDestroy {
  private calendarService = inject(CalendarService);
  private router = inject(Router);
  private iconService = inject(IconService);
  private request?: Subscription;

  @Input() buildingId!: number;
  @Input() isManager = false;

  loading = false;
  loadError = false;
  announcements: CalendarDTO[] = [];
  index = 0;

  ngOnInit(): void {
    this.iconService.addIcon(CalendarOutline, NotificationOutline, PushpinFill);
    if (!this.buildingId) {
      this.buildingId = Number(localStorage.getItem('buildingId'));
    }
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buildingId'] && !changes['buildingId'].firstChange) {
      this.load();
    }
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
  }

  load(): void {
    this.request?.unsubscribe();
    this.announcements = [];
    this.index = 0;
    this.loadError = false;
    this.loading = false;
    if (!this.buildingId) return;

    this.loading = true;
    this.request = this.calendarService.getByBuilding(this.buildingId).subscribe({
      next: (list) => {
        this.announcements = [...(list ?? [])].sort((a, b) => {
          const pinOrder = Number(!!b.pinned) - Number(!!a.pinned);
          const dateA = Date.parse(a.createdDate || a.startDate) || 0;
          const dateB = Date.parse(b.createdDate || b.startDate) || 0;
          return pinOrder || dateB - dateA || b.id - a.id;
        });
        this.loading = false;
      },
      error: () => {
        this.loadError = true;
        this.loading = false;
      }
    });
  }

  get current(): CalendarDTO | null {
    return this.announcements[this.index] ?? null;
  }

  selectAnnouncement(index: number): void {
    if (Number.isInteger(index) && index >= 0 && index < this.announcements.length) {
      this.index = index;
    }
  }

  prev(): void {
    const count = this.announcements.length;
    if (count) this.selectAnnouncement((this.index - 1 + count) % count);
  }

  next(): void {
    const count = this.announcements.length;
    if (count) this.selectAnnouncement((this.index + 1) % count);
  }

  goToCalendar(): void {
    this.router.navigate(['/calendar']);
  }
}
