import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from '../../../../theme/shared/service/company.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-multiple-building-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  templateUrl: './multiple-building-form.component.html',
  styleUrl: './multiple-building-form.component.scss'
})
export class MultipleBuildingFormComponent {
  @Output() companyCreated = new EventEmitter<number>();
  @Output() backClicked = new EventEmitter<void>();

  form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService
  ) {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      afm: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      responsiblePerson: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      addressNumber: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      city: ['', Validators.required],
      region: ['']
    });
  }

  submit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.companyService.createCompany(this.form.value).subscribe({
      next: (company) => {
        this.companyCreated.emit(company.companyId);
      },
      error: (err) => {
        console.error('Σφάλμα δημιουργίας εταιρίας:', err);
      }
    });
  }

  back(): void {
    this.backClicked.emit();
  }
}
