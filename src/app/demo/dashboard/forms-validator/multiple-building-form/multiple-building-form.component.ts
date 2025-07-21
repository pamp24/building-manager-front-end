import { Component, Output, EventEmitter, Input, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from '../../../../theme/shared/service/company.service';

@Component({
  selector: 'app-multiple-building-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './multiple-building-form.component.html',
  styleUrl: './multiple-building-form.component.scss'
})
export class MultipleBuildingFormComponent {
  @Input() selectedAction!: 'many' | 'new' | 'existing';
  @Output() backClicked = new EventEmitter<void>();

  companyForm: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      vatNumber: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      contactPerson: ['', Validators.required],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      addressNumber: ['', Validators.required],
      city: ['', Validators.required],
      region: [''],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      country: ['', Validators.required]
    });
  }

  onBack(): void {
    this.backClicked.emit();
  }

  submitForm(): void {
    this.isSubmitted = true;
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }
    const companyData = this.companyForm.value;
    this.companyService.createCompany(companyData).subscribe({
      next: () => {
        console.log('Η εταιρία καταχωρήθηκε με επιτυχία!');
      },
      error: (error) => {
        console.error('Σφάλμα κατά την υποβολή της εταιρίας:', error);
      }
    });
  }
}
