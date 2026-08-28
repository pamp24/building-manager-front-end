/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, inject, Input, OnInit, OnChanges, SimpleChanges, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarCommonModule,
  CalendarMonthModule,
  CalendarWeekModule,
  CalendarDayModule
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { CalendarService } from 'src/app/theme/shared/service/calendarService.service';
import { isSameDay, isSameMonth } from 'date-fns';
import { CalendarEventModalComponent } from './calendar-event-modal/calendar-event-modal.component';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { IconService } from '@ant-design/icons-angular';
import { EditOutline, DeleteOutline, PushpinOutline, PushpinFill } from '@ant-design/icons-angular/icons';
import { SharedModule } from 'src/app/theme/shared/shared.module';

type UiCalendarEvent = CalendarEvent & { pinned?: boolean; description?: string; active?: boolean; buildingId?: number; createdDate?: string };

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [
    CardComponent,
    CalendarCommonModule,
    CalendarMonthModule,
    CalendarWeekModule,
    CalendarDayModule,
    FormsModule,
    DatePipe,
    NgbTooltipModule,
    SharedModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'el' }]
})
export class CalenderComponent implements OnInit, OnChanges {
  private iconService = inject(IconService);
  @Input() buildingId!: number;
  @Input() isEdit = false;
  private modal = inject(NgbModal);

  view: CalendarView = CalendarView.Month;
  calendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen = true;
  refresh = new Subject<void>();

  events: UiCalendarEvent[] = [];

  // Φίλτρο πίνακα ανακοινώσεων: 'all' | 'active' | 'inactive'
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  page = 1;
  pageSize = 5;

  myBuildings: any[] = [];
  canCreateAnnouncement = false;
  isManager = false;

  get filteredEvents(): UiCalendarEvent[] {
    if (this.statusFilter === 'all') return this.events;
    return this.events.filter((e) => !!e.active === (this.statusFilter === 'active'));
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredEvents.length / this.pageSize));
  }

  get pageArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get paginatedEvents(): UiCalendarEvent[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredEvents.slice(start, start + this.pageSize);
  }

  setStatusFilter(filter: 'all' | 'active' | 'inactive'): void {
    this.statusFilter = filter;
    this.page = 1;
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
  }

  constructor(
    private calendarService: CalendarService,
    private buildingService: BuildingService
  ) {
    this.iconService.addIcon(...[EditOutline, DeleteOutline, PushpinOutline, PushpinFill]);
  }

  ngOnInit() {
    this.buildingService.getMyBuildings().subscribe({
      next: (buildings) => {
        if (buildings.length > 0) {
          this.myBuildings = buildings ?? [];

          const firstBuilding = this.myBuildings[0];

          this.buildingId = Number(firstBuilding?.id ?? firstBuilding?.buildingId);

          this.loadCanCreate();
          this.loadEvents();
        } else {
          console.warn('Δεν βρέθηκαν πολυκατοικίες για τον χρήστη');
        }
      },
      error: (err) => console.error('Σφάλμα φόρτωσης πολυκατοικιών:', err)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buildingId'] && this.buildingId) {
      this.loadCanCreate();
      this.loadEvents();
    }
  }

  loadCanCreate(): void {
    if (!this.buildingId) return;

    this.buildingService.getMyPermissions(this.buildingId).subscribe({
      next: (permission) => {
        this.canCreateAnnouncement = !!permission.canCreateAnnouncement;
        this.isManager = !!permission.isManager;
      },
      error: () => {
        this.canCreateAnnouncement = false;
        this.isManager = false;
      }
    });
  }

  loadEvents(): void {
    if (!this.buildingId) return;

    this.calendarService.getByBuilding(this.buildingId, true).subscribe({
      next: (data) => {
        this.events = data
          .map((e) => ({
            id: e.id,
            title: e.title,
            description: e.description,
            start: new Date(e.startDate),
            end: e.endDate ? new Date(e.endDate) : undefined,
            color: {
              primary: e.colorPrimary ?? '#1677ff',
              secondary: '#D1E8FF'
            },
            pinned: !!e.pinned,
            active: e.active,
            buildingId: e.buildingId,
            createdDate: e.createdDate
          }))
          .sort((a, b) => {
            const ca = a.createdDate ? new Date(a.createdDate).getTime() : 0;
            const cb = b.createdDate ? new Date(b.createdDate).getTime() : 0;
            return cb - ca;
          });

        this.page = 1;
        this.refresh.next();
      },
      error: (err) => console.error('Σφάλμα φόρτωσης γεγονότων:', err)
    });
  }

  deleteEvent(eventToDelete: CalendarEvent): void {
    if (!eventToDelete.id) return;
    this.calendarService.delete(Number(eventToDelete.id)).subscribe(() => this.loadEvents());
  }

  dayClicked({ date }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !(isSameDay(this.viewDate, date) && this.activeDayIsOpen);
      this.viewDate = date;
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  openAddModal() {
    if (!this.buildingId) {
      console.error('Δεν υπάρχει buildingId για δημιουργία event');
      return;
    }

    const modalRef = this.modal.open(CalendarEventModalComponent, { size: 'lg' });
    modalRef.componentInstance.buildingId = this.buildingId;

    modalRef.componentInstance.save.subscribe((newEvent: any) => {
      const payload = {
        ...newEvent,
        buildingId: Number(this.buildingId)
      };

      this.calendarService.create(payload).subscribe({
        next: () => this.loadEvents(),
        error: (err) => console.error('Σφάλμα προσθήκης event:', err)
      });
    });
  }

  openEditModal(event: CalendarEvent) {
    const modalRef = this.modal.open(CalendarEventModalComponent, { size: 'lg' });
    modalRef.componentInstance.buildingId = this.buildingId;
    modalRef.componentInstance.eventData = {
      id: event.id,
      title: event.title,
      description: (event as any).description,
      startDate: event.start,
      endDate: event.end,
      colorPrimary: event.color?.primary,
      colorSecondary: event.color?.secondary
    };
    modalRef.componentInstance.isEdit = true;

    modalRef.componentInstance.save.subscribe((updated: any) => {
      this.calendarService.update(updated).subscribe(() => this.loadEvents());
    });
  }

  togglePin(event: CalendarEvent): void {
    const id = Number(event.id);
    const pinnedNow = !!(event as any).pinned;

    this.calendarService.pinEvent(id, !pinnedNow).subscribe({
      next: () => this.loadEvents(),
      error: (err) => console.error('Pin failed', err)
    });
  }
}
