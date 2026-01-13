import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

type ApartmentLite = {
  id: number;
  floor: string | null;
  number: string | null;
  // αν έχεις έξτρα πεδία δεν μας νοιάζει
};

@Component({
  selector: 'app-member-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './member-edit-modal.component.html'
})
export class MemberEditModalComponent {
  @Input() member!: { fullName?: string; email?: string; firstName?: string; lastName?: string };

  @Input() filteredApartments: ApartmentLite[] = [];
  @Output() roleChanged = new EventEmitter<'Owner' | 'Resident' | ''>();

  // state (όπως στο parent)
  roleToInvite: 'Owner' | 'Resident' | '' = '';
  apartmentToInvite: number | null = null;

  isSending = false;
  errorMsg: string | null = null;

  constructor(public activeModal: NgbActiveModal) {}

  get displayFullName(): string {
    if (this.member?.fullName) return this.member.fullName;
    const ln = this.member?.lastName ?? '';
    const fn = this.member?.firstName ?? '';
    const combined = `${ln} ${fn}`.trim();
    return combined || '—';
  }

  onRoleChange(): void {
    this.apartmentToInvite = null; // reset
    this.roleChanged.emit(this.roleToInvite);
  }

  save(): void {
    this.errorMsg = null;

    if (!this.roleToInvite) {
      this.errorMsg = 'Επέλεξε ρόλο.';
      return;
    }
    if (!this.apartmentToInvite) {
      this.errorMsg = 'Επέλεξε διαμέρισμα.';
      return;
    }

    // εδώ θα γίνει backend call αργότερα, τώρα κλείνουμε με αποτέλεσμα:
    this.activeModal.close({
      saved: true,
      role: this.roleToInvite,
      apartmentId: this.apartmentToInvite
    });
  }
}
