import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BuildingMemberDTO } from 'src/app/theme/shared/models/BuildingMemberDTO';

type ApartmentLite = {
  id: number;
  floor: string | null;
  number: string | null;
};

@Component({
  selector: 'app-member-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './member-edit-modal.component.html'
})
export class MemberEditModalComponent {
  @Input({ required: true })
  member!: BuildingMemberDTO;

  @Input()
  filteredApartments: ApartmentLite[] = [];

  @Output()
  roleChanged =
    new EventEmitter<'Owner' | 'Resident' | ''>();

  roleToInvite: 'Owner' | 'Resident' | '' = '';
  apartmentToInvite: number | null = null;

  isSending = false;
  errorMsg: string | null = null;

  constructor(public activeModal: NgbActiveModal) {}

  get displayFullName(): string {
    return this.member?.fullName?.trim() || '—';
  }

  onRoleChange(): void {
    this.apartmentToInvite = null;
    this.errorMsg = null;
    this.roleChanged.emit(this.roleToInvite);
  }

  save(): void {
    this.errorMsg = null;

    if (!this.roleToInvite) {
      this.errorMsg = 'Επέλεξε ρόλο.';
      return;
    }

    if (this.apartmentToInvite == null) {
      this.errorMsg = 'Επέλεξε διαμέρισμα.';
      return;
    }

    this.activeModal.close({
      saved: true,
      role: this.roleToInvite,
      apartmentId: this.apartmentToInvite
    });
  }
}