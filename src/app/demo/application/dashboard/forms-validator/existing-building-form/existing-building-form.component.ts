import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { JoinSuccessModalComponent } from './join-success/join-success-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-existing-building-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './existing-building-form.component.html',
  styleUrls: ['./existing-building-form.component.scss']
})
export class ExistingBuildingFormComponent {
  @Output() backClicked = new EventEmitter<void>();
  @Output() completed = new EventEmitter<{ buildingId: number }>();

  isSubmitting = false;
  errorMsg: string | null = null;
  form: FormGroup;
  showSuccessModal = false;
  joinedBuildingId?: number;

  constructor(
    private fb: FormBuilder,
    private buildingService: BuildingService,
    private modal: NgbModal,
    private router: Router
  ) {
    this.form = this.fb.group({
      buildingCode: ['', Validators.required]
    });
  }

  onBack(): void {
    this.backClicked.emit();
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMsg = null;

    const code = String(this.form.value.buildingCode).trim();

    this.buildingService.joinByCode(code).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.joinedBuildingId = res.buildingId;

        const ref = this.modal.open(JoinSuccessModalComponent, {
          centered: true,
          backdrop: true,
          keyboard: true
        });
        ref.result.finally(() => {
          this.router.navigateByUrl('/dashboard/default');
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMsg = err?.error?.message || 'Μη έγκυρος κωδικός πολυκατοικίας ή δεν ήταν δυνατή η σύνδεση.';
        console.error(err);
      }
    });
  }
}
