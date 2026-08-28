/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollService } from 'src/app/theme/shared/service/poll.service';
import { NgbActiveModal, NgbDate, NgbDatepickerModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { IconService } from '@ant-design/icons-angular';
import { CalendarOutline } from '@ant-design/icons-angular/icons';
import { GreekDatepickerI18n } from 'src/app/theme/shared/service/greek-datepicker-i18n';

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDatepickerModule],
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss'],
  providers: [{ provide: NgbDatepickerI18n, useClass: GreekDatepickerI18n }]
})
export class CreatePollComponent {
  @Output() pollCreated = new EventEmitter<void>();

  buildingId!: number;

  constructor(
    private pollService: PollService,
    public activeModal: NgbActiveModal,
    private iconService: IconService
  ) {
    this.iconService.addIcon(...[CalendarOutline]);
  }

  newPoll: any = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    multipleChoice: false,
    options: [{ text: '' }]
  };

  startDateModel: NgbDate | null = null;
  endDateModel: NgbDate | null = null;

  addOption() {
    this.newPoll.options.push({ text: '' });
  }

  removeOption(i: number) {
    this.newPoll.options.splice(i, 1);
  }

  createPoll() {
    // === ΠΕΡΝΑΜΕ ΤΟ buildingId ΣΤΟ BACKEND ===
    this.newPoll.buildingId = this.buildingId;
    this.newPoll.startDate = this.toDateString(this.startDateModel);
    this.newPoll.endDate = this.toDateString(this.endDateModel);

    // Αν οι ημερομηνίες είναι κενές, μην τις στέλνεις στο backend
    // (το Jackson δεν δέχεται κενό string για LocalDateTime → 400)
    const payload = { ...this.newPoll };
    if (!payload.startDate) payload.startDate = null;
    if (!payload.endDate) payload.endDate = null;

    this.pollService.create(payload).subscribe({
      next: () => {
        this.pollCreated.emit();
        this.activeModal.close();  // κλείνει το modal
        this.resetForm();
      },
      error: (err) => console.error(err)
    });
  }

  private toDateString(model: NgbDate | null): string | null {
    if (!model) return null;
    const yyyy = String(model.year).padStart(4, '0');
    const mm = String(model.month).padStart(2, '0');
    const dd = String(model.day).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  resetForm() {
    this.newPoll = {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      multipleChoice: false,
      options: [{ text: '' }]
    };
    this.startDateModel = null;
    this.endDateModel = null;
  }
}

