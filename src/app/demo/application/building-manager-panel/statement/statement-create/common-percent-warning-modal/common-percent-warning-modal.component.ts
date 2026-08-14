import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-common-percent-warning-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './common-percent-warning-modal.component.html'
})
export class CommonPercentWarningModalComponent {
  @Input() currentSum = 0;

  constructor(public activeModal: NgbActiveModal) {}
}
