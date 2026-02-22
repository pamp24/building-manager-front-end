/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buildings-add',
  imports: [SharedModule],
  templateUrl: './buildings-add.component.html',
  styleUrl: './buildings-add.component.scss'
})
export class BuildingsAddComponent implements OnInit {
  private fb = inject(FormBuilder);
  private buildingService = inject(BuildingService);
  private router = inject(Router);

  form!: FormGroup;
  isSubmitted = false;
  loading = false;
  error?: string;

  countries = ['Ελλάδα'];
  states = [
    'Νομός Αττικής',
    'Νομός Αιτωλοακαρνανίας',
    'Νομός Αργολίδας',
    'Νομός Αρκαδίας',
    'Νομός Άρτας',
    'Νομός Αχαΐας',
    'Νομός Βοιωτίας',
    'Νομός Γρεβενών',
    'Νομός Δράμας',
    'Νομός Δωδεκανήσου',
    'Νομός Έβρου',
    'Νομός Ευρυτανίας',
    'Νομός Εύβοιας',
    'Νομός Ζακύνθου',
    'Νομός Ηλείας',
    'Νομός Ημαθίας',
    'Νομός Ηρακλείου',
    'Νομός Θεσπρωτίας',
    'Νομός Θεσσαλονίκης',
    'Νομός Ιωαννίνων',
    'Νομός Καβάλας',
    'Νομός Καρδίτσας',
    'Νομός Καστοριάς',
    'Νομός Κέρκυρας',
    'Νομός Κεφαλληνίας',
    'Νομός Κιλκίς',
    'Νομός Κοζάνης',
    'Νομός Κορινθίας',
    'Νομός Κυκλάδων',
    'Νομός Λακωνίας',
    'Νομός Λάρισας',
    'Νομός Λασιθίου',
    'Νομός Λέσβου',
    'Νομός Λευκάδας',
    'Νομός Μαγνησίας',
    'Νομός Μεσσηνίας',
    'Νομός Ξάνθης',
    'Νομός Πέλλας',
    'Νομός Πιερίας',
    'Νομός Πρέβεζας',
    'Νομός Ρεθύμνης',
    'Νομός Ροδόπης',
    'Νομός Σάμου',
    'Νομός Σερρών',
    'Νομός Τρικάλων',
    'Νομός Φθιώτιδας',
    'Νομός Φλώρινας',
    'Νομός Φωκίδας',
    'Νομός Χαλκιδικής',
    'Νομός Χανίων',
    'Νομός Χίου'
  ];

  selectedRegulationFile: File | null = null;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      street1: ['', [Validators.required]],
      stNumber1: ['', [Validators.required]],
      street2: [''],
      stNumber2: [''],
      country: ['Ελλάδα', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      region: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],

      floors: [1, [Validators.required, Validators.min(0)]],
      apartmentsNum: [1, [Validators.required, Validators.min(1)]],
      sqMetersTotal: [1, [Validators.required, Validators.min(1)]],
      sqMetersCommonSpaces: [0, [Validators.min(0)]],

      buildingDescription: [''],

      parkingExist: [false],
      parkingSpacesNum: [0],

      undergroundFloorExist: [false],
      halfFloorExist: [false],
      overTopFloorExist: [false],

      storageExist: [false],
      storageNum: [0],

      hasCentralHeating: [false],
      heatingType: ['NONE'],
      heatingCapacityLitres: [0]
    });

    // dynamic validators
    this.form.get('parkingExist')?.valueChanges.subscribe((v: boolean) => {
      const ctrl = this.form.get('parkingSpacesNum');
      if (!ctrl) return;
      if (v) {
        ctrl.setValidators([Validators.required, Validators.min(1)]);
      } else {
        ctrl.clearValidators();
        ctrl.setValue(0);
      }
      ctrl.updateValueAndValidity();
    });

    this.form.get('storageExist')?.valueChanges.subscribe((v: boolean) => {
      const ctrl = this.form.get('storageNum');
      if (!ctrl) return;
      if (v) {
        ctrl.setValidators([Validators.required, Validators.min(1)]);
      } else {
        ctrl.clearValidators();
        ctrl.setValue(0);
      }
      ctrl.updateValueAndValidity();
    });

    this.form.get('hasCentralHeating')?.valueChanges.subscribe((v: boolean) => {
      const type = this.form.get('heatingType');
      const litres = this.form.get('heatingCapacityLitres');
      if (!type || !litres) return;

      if (v) {
        type.setValidators([Validators.required]);
        litres.setValidators([Validators.required, Validators.min(0)]);
      } else {
        type.clearValidators();
        litres.clearValidators();
        type.setValue('NONE');
        litres.setValue(0);
      }
      type.updateValueAndValidity();
      litres.updateValueAndValidity();
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      this.selectedRegulationFile = null;
      return;
    }
    const file = input.files[0];

    if (file.type !== 'application/pdf') {
      alert('Παρακαλώ επιλέξτε αρχείο PDF.');
      input.value = '';
      this.selectedRegulationFile = null;
      return;
    }

    this.selectedRegulationFile = file;
  }

  submit(): void {
    this.isSubmitted = true;
    this.error = undefined;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    const payload = {
      name: v.name,
      street1: v.street1,
      stNumber1: v.stNumber1,
      street2: v.street2 || null,
      stNumber2: v.stNumber2 || null,
      city: v.city,
      region: v.region,
      postalCode: v.postalCode,
      country: v.country,
      state: v.state,

      floors: Number(v.floors), // στο backend έχεις floors ως String στο BuildingRequest, αλλά mapper κάνει Integer.valueOf
      apartmentsNum: Number(v.apartmentsNum),
      sqMetersTotal: Number(v.sqMetersTotal),
      sqMetersCommonSpaces: Number(v.sqMetersCommonSpaces),

      parkingExist: !!v.parkingExist,
      parkingSpacesNum: v.parkingExist ? Number(v.parkingSpacesNum) : 0,

      active: true,
      enable: true,

      buildingDescription: v.buildingDescription || null,

      undergroundFloorExist: !!v.undergroundFloorExist,
      halfFloorExist: !!v.halfFloorExist,
      overTopFloorExist: !!v.overTopFloorExist,

      storageExist: !!v.storageExist,
      storageNum: v.storageExist ? Number(v.storageNum) : 0,

      hasCentralHeating: !!v.hasCentralHeating,
      heatingType: v.hasCentralHeating ? v.heatingType || 'NONE' : 'NONE',
      heatingCapacityLitres: v.hasCentralHeating ? Number(v.heatingCapacityLitres) : 0
    };

    this.loading = true;

    // PM flow: δημιουργεί company-managed building
    this.buildingService.createCompanyBuilding(payload as any).subscribe({
      next: (buildingId) => {
        this.loading = false;
        // εδώ μετά μπορείς να κάνεις upload PDF αν θες (σε ξεχωριστό endpoint)
        alert('Η πολυκατοικία δημιουργήθηκε!');
        this.router.navigate(['/pm/view']); // ή όπου θες
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = err?.error?.message || 'Αποτυχία δημιουργίας πολυκατοικίας.';
      }
    });
  }
  back(): void {
    if (this.form.dirty) {
      const ok = confirm('Θέλεις να φύγεις; Θα χαθούν τα μη αποθηκευμένα δεδομένα.');
      if (!ok) return;
    }
    this.router.navigate(['/pm/buildings']);
  }
}
