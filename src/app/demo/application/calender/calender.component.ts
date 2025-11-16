/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, TemplateRef, viewChild, inject, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
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
import { EditOutline, DeleteOutline } from '@ant-design/icons-angular/icons';
import { SharedModule } from 'src/app/theme/shared/shared.module';


@Component({
  selector: 'app-calender',
  standalone: true,
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss'],
  imports: [
    CardComponent,
    CalendarCommonModule,
    CalendarMonthModule,
    CalendarWeekModule,
    CalendarDayModule,
    FormsModule,
    DatePipe,
    NgbTooltipModule,
    NgbTooltipModule,
    SharedModule 
  ]
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

  events: CalendarEvent[] = [];

  readonly modalContent = viewChild.required<TemplateRef<string>>('modalContent');

  modalData!: { action: string; event: CalendarEvent };

  selectedBuildingId!: number;
  myBuildings: any[] = [];

  constructor(
    private calendarService: CalendarService,
    private buildingService: BuildingService
  ) {
    this.iconService.addIcon(...[EditOutline, DeleteOutline]);
  }

  ngOnInit() {
    this.buildingService.getMyBuildings().subscribe({
      next: (buildings) => {
        if (buildings.length > 0) {
          this.buildingId = buildings[0].id; // παίρνουμε το πρώτο id
          console.log('selectedBuildingId:', this.buildingId);
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
      console.log('Building ID changed:', this.buildingId);
      this.loadEvents();
    }
  }

  loadEvents(): void {
    console.log('Loading events for building:', this.buildingId);
    if (!this.buildingId) return;

    this.calendarService.getByBuilding(this.buildingId).subscribe({
      next: (data) => {
        console.log('Events loaded:', data);
        this.events = data.map((e) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          start: new Date(e.startDate),
          end: e.endDate ? new Date(e.endDate) : undefined,
          color: { primary: e.colorPrimary, secondary: e.colorSecondary }
        }));
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

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  openAddModal() {
    const modalRef = this.modal.open(CalendarEventModalComponent, { size: 'lg' });
    modalRef.componentInstance.buildingId = this.buildingId;

    modalRef.componentInstance.save.subscribe((newEvent: any) => {
      this.calendarService.create(newEvent).subscribe({
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
    description: (event as any).description, // αν δεν το έχεις, πρόσθεσέ το
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

}
