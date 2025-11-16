/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PollService } from 'src/app/theme/shared/service/poll.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.scss']
})
export class CreatePollComponent {
  @Output() pollCreated = new EventEmitter<void>();

  buildingId!: number; 

  newPoll: any = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    multipleChoice: false,
    options: [{ text: '' }]
  };

  constructor(
    private pollService: PollService,
    public activeModal: NgbActiveModal
  ) {}

  addOption() {
    this.newPoll.options.push({ text: '' });
  }

  removeOption(i: number) {
    this.newPoll.options.splice(i, 1);
  }

  createPoll() {
    // === ΠΕΡΝΑΜΕ ΤΟ buildingId ΣΤΟ BACKEND ===
    this.newPoll.buildingId = this.buildingId;

    this.pollService.create(this.newPoll).subscribe({
      next: () => {
        this.pollCreated.emit();
        this.activeModal.close();  // κλείνει το modal
        this.resetForm();
      },
      error: (err) => console.error(err)
    });
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
  }
}
