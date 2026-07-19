import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApartmentDTO } from 'src/app/theme/shared/models/apartmentDTO';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';

@Component({
  selector: 'app-delete-apartment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-apartment.component.html',
  styleUrls: ['./delete-apartment.component.scss']
})
export class DeleteApartmentComponent {
  @Input() apartment!: ApartmentDTO;

  isDeleting = false;
  errorMessage = '';

  constructor(
    public activeModal: NgbActiveModal,
    private apartmentService: ApartmentService
  ) {}

  confirmDelete(): void {
    if (!this.apartment?.id || this.isDeleting) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';

    this.apartmentService.deleteApartment(this.apartment.id).subscribe({
      next: () => {
        this.activeModal.close({
          deleted: true,
          apartmentId: this.apartment.id
        });
      },
      error: (err) => {
        console.error('Σφάλμα διαγραφής διαμερίσματος:', err);

        this.errorMessage = err?.error?.message || 'Η διαγραφή του διαμερίσματος απέτυχε.';

        this.isDeleting = false;
      }
    });
  }

  cancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
