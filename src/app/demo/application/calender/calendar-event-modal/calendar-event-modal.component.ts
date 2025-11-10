/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlatpickrDirective } from 'angularx-flatpickr';

@Component({
  selector: 'app-calendar-event-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FlatpickrDirective],
  templateUrl: './calendar-event-modal.component.html',
  styleUrls: ['./calendar-event-modal.component.scss']
})
export class CalendarEventModalComponent implements OnInit {
  @Input() buildingId!: number;
  @Input() eventData: any = null;
  @Input() isEdit = false;
  @Output() save = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal) {}

  event: any = {
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    colorPrimary: '#1677ff',
    colorSecondary: '#e6f7ff'
  };

  ngOnInit(): void {
    if (this.isEdit && this.eventData) {
      console.log('Editing event:', this.eventData);

      this.event = {
        title: this.eventData.title,
        description: this.eventData.description,
        startDate: new Date(this.eventData.startDate),
        endDate: new Date(this.eventData.endDate),
        colorPrimary: this.eventData.colorPrimary || '#1677ff',
        colorSecondary: this.eventData.colorSecondary || '#e6f7ff'
      };
    }
  }

  saveEvent(): void {
    const payload = {
      ...this.event,
      buildingId: this.buildingId,
      id: this.eventData?.id ?? null
    };

    this.save.emit(payload);
    this.activeModal.close();
  }
}
