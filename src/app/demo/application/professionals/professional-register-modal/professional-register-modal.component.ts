import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ProfessionalBusinessRequest, ProfessionalCategory } from 'src/app/theme/shared/models/professional.model';
import { ProfessionalService } from 'src/app/theme/shared/service/professional.service';

@Component({
  selector: 'app-professional-register-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './professional-register-modal.component.html'
})
export class ProfessionalRegisterModalComponent {
  @Output() created = new EventEmitter<void>();

  loading = false;
  submitted = false;
  error = '';
  countries = ['Ελλάδα'];
  availableCities: string[] = [];

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

  greekRegions = [
    { region: 'Αττική', cities: ['Αθήνα'] },
    { region: 'Θεσσαλονίκη', cities: ['Θεσσαλονίκη'] },
    { region: 'Αχαΐα', cities: ['Πάτρα'] },
    { region: 'Ηράκλειο', cities: ['Ηράκλειο'] },
    { region: 'Λάρισα', cities: ['Λάρισα'] },
    { region: 'Μαγνησία', cities: ['Βόλος'] },
    { region: 'Ιωάννινα', cities: ['Ιωάννινα'] },
    { region: 'Έβρος', cities: ['Αλεξανδρούπολη'] },
    { region: 'Καβάλα', cities: ['Καβάλα'] },
    { region: 'Σέρρες', cities: ['Σέρρες'] },
    { region: 'Κοζάνη', cities: ['Κοζάνη'] },
    { region: 'Τρίκαλα', cities: ['Τρίκαλα'] },
    { region: 'Καρδίτσα', cities: ['Καρδίτσα'] },
    { region: 'Φθιώτιδα', cities: ['Λαμία'] },
    { region: 'Εύβοια', cities: ['Χαλκίδα'] },
    { region: 'Βοιωτία', cities: ['Λιβαδειά'] },
    { region: 'Κορινθία', cities: ['Κόρινθος'] },
    { region: 'Αργολίδα', cities: ['Ναύπλιο'] },
    { region: 'Αρκαδία', cities: ['Τρίπολη'] },
    { region: 'Μεσσηνία', cities: ['Καλαμάτα'] },
    { region: 'Λακωνία', cities: ['Σπάρτη'] },
    { region: 'Χανιά', cities: ['Χανιά'] },
    { region: 'Ρέθυμνο', cities: ['Ρέθυμνο'] },
    { region: 'Λασίθι', cities: ['Άγιος Νικόλαος'] },
    { region: 'Δωδεκάνησα', cities: ['Ρόδος'] },
    { region: 'Κυκλάδες', cities: ['Ερμούπολη'] },
    { region: 'Λέσβος', cities: ['Μυτιλήνη'] },
    { region: 'Χίος', cities: ['Χίος'] },
    { region: 'Σάμος', cities: ['Σάμος'] },
    { region: 'Κέρκυρα', cities: ['Κέρκυρα'] },
    { region: 'Ζάκυνθος', cities: ['Ζάκυνθος'] },
    { region: 'Κεφαλονιά', cities: ['Αργοστόλι'] }
  ];

  form = this.fb.group({
    businessName: ['', [Validators.required, Validators.minLength(2)]],
    ownerFullName: ['', [Validators.required, Validators.minLength(2)]],
    category: [null as ProfessionalCategory | null, Validators.required],
    description: [''],
    phone: ['', Validators.required],
    email: ['', Validators.email],
    website: [''],
    country: ['Ελλάδα', Validators.required],
    region: ['', Validators.required],
    city: ['', Validators.required],
    address: [''],
    taxNumber: ['']
  });

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private professionalService: ProfessionalService
  ) {}

  get f() {
    return this.form.controls;
  }

  onRegionChange(): void {
    const selectedRegion = this.form.get('region')?.value;

    const match = this.greekRegions.find((r) => r.region === selectedRegion);

    this.availableCities = match?.cities ?? [];

    this.form.patchValue({
      city: ''
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
        this.error = err?.businessErrorDescription || err?.error || err?.message || 'Αποτυχία καταχώρισης επιχείρησης.';
      }
    });
  }
}
