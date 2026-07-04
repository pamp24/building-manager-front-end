import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProfessionalBusinessRequest, ProfessionalCategory } from 'src/app/theme/shared/models/professional.model';
import { ProfessionalService } from 'src/app/theme/shared/service/professional.service';
import { COUNTRIES } from 'src/app/theme/shared/data/countries.data';
import { CYPRUS_LOCATIONS, CyprusRegion } from 'src/app/theme/shared/data/cyprus-locations.data';
import { GREECE_LOCATIONS, GreeceRegion } from 'src/app/theme/shared/data/greece-locations.data';

@Component({
  selector: 'app-professional-register-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './professional-register-modal.component.html'
})
export class ProfessionalRegisterModalComponent {
  private readonly phonePattern = /^\+?[0-9()\-\s]{8,20}$/;
  private readonly websitePattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;
  private readonly taxNumberPattern = /^[A-Za-z0-9-]{8,15}$/;
  private readonly countryLocations: Record<string, GreeceRegion[] | CyprusRegion[]> = {
    GR: GREECE_LOCATIONS,
    CY: CYPRUS_LOCATIONS
  };

  @Output() created = new EventEmitter<void>();

  loading = false;
  submitted = false;
  error = '';
  countries = COUNTRIES;

  availableRegions: Array<GreeceRegion | CyprusRegion> = [];
  availableCities: { city: string; areas: string[] }[] = [];
  availableAreas: string[] = [];

  categories: { value: ProfessionalCategory; label: string }[] = [
    { value: 'ELECTRICIAN', label: 'Ηλεκτρολόγος' },
    { value: 'PLUMBER', label: 'Υδραυλικός' },
    { value: 'ELEVATOR_TECHNICIAN', label: 'Τεχνικός Ασανσέρ' },
    { value: 'CLEANING_SERVICE', label: 'Καθαρισμός' },
    { value: 'HEATING_TECHNICIAN', label: 'Θέρμανση' },
    { value: 'LOCKSMITH', label: 'Κλειδαράς' },
    { value: 'AIR_CONDITION_TECHNICIAN', label: 'Κλιματισμός' },
    { value: 'PAINTER', label: 'Ελαιοχρωματιστής' },
    { value: 'PEST_CONTROL', label: 'Απεντομώσεις' },
    { value: 'GENERAL_REPAIRS', label: 'Γενικές Επισκευές' },
    { value: 'OTHER', label: 'Άλλο' }
  ];

  form = this.fb.group({
    businessName: ['', [Validators.required, Validators.minLength(2)]],
    ownerFullName: ['', [Validators.required, Validators.minLength(2)]],
    category: [null as ProfessionalCategory | null, Validators.required],
    description: [''],
    phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
    email: ['', Validators.email],
    website: ['', Validators.pattern(this.websitePattern)],
    country: ['', Validators.required],
    region: ['', Validators.required],
    city: ['', Validators.required],
    area: [''],
    address: [''],
    taxNumber: ['', Validators.pattern(this.taxNumberPattern)],
    workingHours: ['']
  });

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private professionalService: ProfessionalService
  ) {}

  get f() {
    return this.form.controls;
  }

  onCountryChange(): void {
    const selectedCountry = this.form.get('country')?.value ?? '';

    this.availableRegions = this.countryLocations[selectedCountry] ?? [];
    this.availableCities = [];
    this.availableAreas = [];

    this.form.patchValue({
      region: '',
      city: '',
      area: ''
    });
  }

  onRegionChange(): void {
    const selectedRegion = this.form.get('region')?.value;
    const match = this.availableRegions.find((region) => region.region === selectedRegion);

    this.availableCities = match?.cities ?? [];
    this.availableAreas = [];

    this.form.patchValue({
      city: '',
      area: ''
    });
  }

  onCityChange(): void {
    const selectedCity = this.form.get('city')?.value;
    const match = this.availableCities.find((city) => city.city === selectedCity);

    this.availableAreas = match?.areas ?? [];

    this.form.patchValue({
      area: ''
    });
  }

  submit(): void {
    this.submitted = true;
    this.error = '';

    if (this.form.invalid) {
      this.error = 'Παρακαλώ συμπληρώστε σωστά τα υποχρεωτικά πεδία.';
      return;
    }

    const payload = this.form.getRawValue() as ProfessionalBusinessRequest;

    this.loading = true;

    this.professionalService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.created.emit();
        this.activeModal.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.businessErrorDescription ||
          (typeof err?.error === 'string' ? err.error : '') ||
          err?.businessErrorDescription ||
          err?.message ||
          'Αποτυχία καταχώρισης επιχείρησης.';
      }
    });
  }
}
