import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-join-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join-success-modal.component.html'
})
export class JoinSuccessModalComponent {
  @Input() buildingName?: string;

  constructor(public activeModal: NgbActiveModal) {}

  goDashboard() {
    this.activeModal.close({ action: 'dashboard' });
  }

  goMembers() {
    this.activeModal.close({ action: 'members' });
  }

  close() {
    this.activeModal.dismiss();
  }
}
