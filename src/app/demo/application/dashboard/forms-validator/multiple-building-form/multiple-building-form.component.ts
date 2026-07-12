/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CompanyDTO } from 'src/app/theme/shared/models/companyDTO';
import { AuthenticationService } from 'src/app/theme/shared/service';
import { CompanyService } from 'src/app/theme/shared/service/company.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

import { LOCATION_COUNTRIES, SupportedLocationRegion, resolveCountryLocations } from '../location-form.utils';

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

  countries = LOCATION_COUNTRIES;
  availableStates: SupportedLocationRegion[] = [];
  availableCities: { city: string; areas: string[] }[] = [];
  availableAreas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private companyService: CompanyService
  ) {
    this.form = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      afm: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      responsiblePerson: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\s()-]{8,20}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(2)]],
      addressNumber: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      region: ['', [Validators.required]]
    });
  }

  get f() {
    return this.form.controls;
  }

  onCountryChange(): void {
    this.availableStates = resolveCountryLocations(this.f['country'].value);
    this.availableCities = [];
    this.availableAreas = [];

    this.form.patchValue(
      {
        state: '',
        city: '',
        region: ''
      },
      { emitEvent: false }
    );
  }

  onStateChange(): void {
    const selectedState = this.f['state'].value;
    const match = this.availableStates.find((state) => state.region === selectedState);

    this.availableCities = match?.cities ?? [];
    this.availableAreas = [];

    this.form.patchValue(
      {
        city: '',
        region: ''
      },
      { emitEvent: false }
    );
  }

  onCityChange(): void {
    const selectedCity = this.f['city'].value;
    const match = this.availableCities.find((city) => city.city === selectedCity);

    this.availableAreas = match?.areas ?? [];
    this.form.patchValue({ region: '' }, { emitEvent: false });
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
      managerName: String(this.f['responsiblePerson'].value).trim(),
      phone: String(this.f['phoneNumber'].value).trim(),
      email: String(this.f['email'].value).trim(),
      address: String(this.f['address'].value).trim(),
      addressNumber: String(this.f['addressNumber'].value).trim(),
      postalCode: String(this.f['postalCode'].value).trim(),
      city: String(this.f['city'].value).trim(),
      // Backend only exposes a single region field for companies for now.
      region: [this.f['state'].value, this.f['region'].value].filter(Boolean).join(' / ')
    };

    this.loading = true;

    this.companyService.createCompany(payload).subscribe({
      next: (company: any) => {
        const id = company?.companyId ?? company?.id;

        if (!id) {
          this.loading = false;
          this.apiError = 'Η εταιρεία δημιουργήθηκε αλλά δεν επιστράφηκε id.';
          return;
        }

        this.authService.refreshCurrentUser().subscribe({
          next: () => {
            this.loading = false;
            this.companyCreated.emit(Number(id));
          },
          error: () => {
            this.loading = false;
            this.companyCreated.emit(Number(id));
          }
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Σφάλμα δημιουργίας εταιρείας:', err);
        this.apiError = err?.error?.message || 'Αποτυχία δημιουργίας εταιρείας. Δοκιμάστε ξανά.';
      }
    });
  }

  back(): void {
    this.backClicked.emit();
  }
}
