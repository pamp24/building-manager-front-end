import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
export class BuildingAnnouncementsCardComponent implements OnInit, OnChanges {
  private calendarService = inject(CalendarService);
  private router = inject(Router);

  @Input() buildingId!: number;
  @Input() isManager = false;

  loading = false;
  announcements: CalendarDTO[] = [];
  index = 0;

  ngOnInit(): void {
    // ✅ fallback αν δεν έχει γίνει bind από parent ακόμα
    if (!this.buildingId) {
      const fromLs = Number(localStorage.getItem('buildingId'));
      if (fromLs) this.buildingId = fromLs;
    }

    if (this.buildingId) {
      this.load();
    } else {
      console.warn('[AnnouncementsCard] buildingId is missing on init');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buildingId']) {
      console.log('[AnnouncementsCard] buildingId changed:', this.buildingId);
      if (this.buildingId) this.load();
    }
  }

  load(): void {
    console.log('[AnnouncementsCard] calling API for building:', this.buildingId);
    this.loading = true;

    this.calendarService.getByBuilding(this.buildingId).subscribe({
      next: (list) => {
        console.log('[AnnouncementsCard] API result:', list);
        this.announcements = list ?? [];
        this.index = 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('[AnnouncementsCard] Announcements load error', err);
        this.loading = false;
      }
    });
  }

  get current(): CalendarDTO | null {
    return this.announcements.length ? this.announcements[this.index] : null;
  }

  prev(): void {
    if (!this.announcements.length) return;
    this.index = (this.index - 1 + this.announcements.length) % this.announcements.length;
  }

  next(): void {
    if (!this.announcements.length) return;
    this.index = (this.index + 1) % this.announcements.length;
  }

  goToCalendar(): void {
    this.router.navigate(['/calendar']);
  }

  togglePin(): void {
    const cur = this.current;
    if (!cur) return;

    this.calendarService.pinEvent(cur.id!, !cur.pinned).subscribe({
      next: () => this.load(),
      error: (err) => console.error('Pin failed', err)
    });
  }
}
