/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from '../../../../theme/shared/service/company.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CompanyDTO } from 'src/app/theme/shared/models/companyDTO';
import { AuthenticationService } from 'src/app/theme/shared/service';

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
  loading = false;
  apiError?: string;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private authService: AuthenticationService
  ) {
    this.form = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2)]],

      // UI field: "afm" (9 digits) -> θα γίνει mapping σε taxNumber στο submit
      afm: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],

      responsiblePerson: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\s()-]{8,20}$/)]],
      email: ['', [Validators.required, Validators.email]],

      address: ['', [Validators.required, Validators.minLength(2)]],
      addressNumber: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      city: ['', [Validators.required]],
      region: ['']
    });
  }

  get f() {
    return this.form.controls;
  }

  submit(): void {
    this.submitted = true;
    this.apiError = undefined;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: CompanyDTO = {
      companyName: String(this.f['companyName'].value).trim(),
      taxNumber: String(this.f['afm'].value).trim(),
      responsiblePerson: String(this.f['responsiblePerson'].value).trim(),
      phoneNumber: String(this.f['phoneNumber'].value).trim(),
      email: String(this.f['email'].value).trim(),
      address: String(this.f['address'].value).trim(),
      addressNumber: String(this.f['addressNumber'].value).trim(),
      postalCode: String(this.f['postalCode'].value).trim(),
      city: String(this.f['city'].value).trim(),
      region: String(this.f['region'].value || '').trim() || undefined
    };

    this.loading = true;

    this.companyService.createCompany(payload).subscribe({
      next: (company: any) => {
        const id = company?.companyId ?? company?.id;
        if (!id) {
          this.apiError = 'Η εταιρία δημιουργήθηκε αλλά δεν επιστράφηκε id.';
          return;
        }

        this.authService.refreshCurrentUser().subscribe({
          next: () => this.companyCreated.emit(Number(id)),
          error: () => this.companyCreated.emit(Number(id))
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Σφάλμα δημιουργίας εταιρίας:', err);
        this.apiError = err?.error?.message || 'Αποτυχία δημιουργίας εταιρίας. Δοκιμάστε ξανά.';
      }
    });
  }

  back(): void {
    this.backClicked.emit();
  }
}
