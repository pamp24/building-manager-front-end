import { Component, Input, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApartmentDTO } from 'src/app/theme/shared/models/apartmentDTO';

import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';

import { BuildingService } from 'src/app/theme/shared/service/building.service';

import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';

@Component({
  selector: 'app-edit-apartment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-apartment.component.html',
  styleUrls: ['./edit-apartment.component.scss']
})
export class EditApartmentComponent implements OnInit {
  @Input() apartment!: ApartmentDTO;

  form!: FormGroup;

  floorOptions: string[] = [];

  parkingLimit = 0;
  storageLimit = 0;

  currentUsedParking = 0;
  currentUsedStorages = 0;

  isSaving = false;
  isSubmitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apartmentService: ApartmentService,
    private buildingService: BuildingService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    if (!this.apartment?.id) {
      this.errorMessage = 'Δεν βρέθηκαν στοιχεία διαμερίσματος.';
      return;
    }

    this.createForm();
    this.loadBuildingData();
    this.configureResidentValidation();
  }

  private createForm(): void {
    this.form = this.fb.group({
      ownerFirstName: [this.apartment.ownerFirstName ?? '', [Validators.required, Validators.minLength(3)]],

      ownerLastName: [this.apartment.ownerLastName ?? '', [Validators.required, Validators.minLength(3)]],

      isRented: [this.apartment.isRented ? 'Ναι' : 'Όχι', Validators.required],

      residentFirstName: [this.apartment.residentFirstName ?? ''],

      residentLastName: [this.apartment.residentLastName ?? ''],

      apartmentNumber: [this.apartment.number ?? '', Validators.required],

      floor: [this.apartment.floor ?? '', Validators.required],

      sqMetersApart: [this.apartment.sqMetersApart ?? '', [Validators.required, Validators.min(1)]],

      hasParking: [this.apartment.parkingSpace ? 'Ναι' : 'Όχι', Validators.required],

      parkingSlot: [this.apartment.parkingSlot ?? ''],

      commonPercent: [this.apartment.commonPercent ?? 0, [Validators.required, Validators.min(0), Validators.max(100)]],

      elevatorPercent: [this.apartment.elevatorPercent ?? 0, [Validators.required, Validators.min(0), Validators.max(100)]],

      heatingPercent: [this.apartment.heatingPercent ?? 0, [Validators.required, Validators.min(0), Validators.max(100)]],

      hasStorage: [this.apartment.apStorageExist ?? false],

      storageSlot: [this.apartment.storageSlot ?? ''],

      apDescription: [this.apartment.apDescription ?? '']
    });
  }

  private loadBuildingData(): void {
    const buildingId = this.apartment.buildingId;

    this.buildingService.getBuilding(buildingId).subscribe({
      next: (building: BuildingDTO) => {
        this.floorOptions = this.generateFloors(building);

        this.parkingLimit = building.parkingSpacesNum ?? 0;

        this.storageLimit = building.storageNum ?? 0;

        this.loadExistingApartments(buildingId);
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης πολυκατοικίας:', err);

        this.errorMessage = 'Δεν ήταν δυνατή η φόρτωση της πολυκατοικίας.';
      }
    });
  }

  private loadExistingApartments(buildingId: number): void {
    this.apartmentService.getApartmentsByBuilding(buildingId).subscribe({
      next: (apartments) => {
        /*
         * Δεν μετράμε το apartment που επεξεργαζόμαστε,
         * επειδή μπορεί ήδη να έχει parking/storage.
         */
        const otherApartments = apartments.filter((item) => item.id !== this.apartment.id);

        this.currentUsedParking = otherApartments.filter((item) => item.parkingSpace).length;

        this.currentUsedStorages = otherApartments.filter((item) => item.apStorageExist).length;

        this.updateAvailability();
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης διαμερισμάτων:', err);
      }
    });
  }

  private updateAvailability(): void {
    const parkingControl = this.form.get('hasParking');

    const storageControl = this.form.get('hasStorage');

    const parkingUnavailable = this.currentUsedParking >= this.parkingLimit;

    const storageUnavailable = this.currentUsedStorages >= this.storageLimit;

    /*
     * Αν το συγκεκριμένο apartment έχει ήδη parking,
     * πρέπει να μπορεί να το κρατήσει.
     */
    if (parkingUnavailable && !this.apartment.parkingSpace) {
      parkingControl?.setValue('Όχι', { emitEvent: false });

      parkingControl?.disable({
        emitEvent: false
      });
    } else {
      parkingControl?.enable({
        emitEvent: false
      });
    }

    /*
     * Το ίδιο για την αποθήκη.
     */
    if (storageUnavailable && !this.apartment.apStorageExist) {
      storageControl?.setValue(false, { emitEvent: false });

      storageControl?.disable({
        emitEvent: false
      });
    } else {
      storageControl?.enable({
        emitEvent: false
      });
    }
  }

  private configureResidentValidation(): void {
    const isRentedControl = this.form.get('isRented');

    this.updateResidentValidators(isRentedControl?.value);

    isRentedControl?.valueChanges.subscribe((value) => {
      this.updateResidentValidators(value);
    });
  }

  private updateResidentValidators(value: string): void {
    const firstName = this.form.get('residentFirstName');

    const lastName = this.form.get('residentLastName');

    if (value === 'Ναι') {
      firstName?.setValidators([Validators.required, Validators.minLength(3)]);

      lastName?.setValidators([Validators.required, Validators.minLength(3)]);
    } else {
      firstName?.clearValidators();
      lastName?.clearValidators();

      firstName?.setValue('', {
        emitEvent: false
      });

      lastName?.setValue('', {
        emitEvent: false
      });
    }

    firstName?.updateValueAndValidity({
      emitEvent: false
    });

    lastName?.updateValueAndValidity({
      emitEvent: false
    });
  }

  save(): void {
    this.isSubmitted = true;
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isSaving) {
      return;
    }

    this.isSaving = true;

    const value = this.form.getRawValue();

    const updatedApartment: ApartmentDTO = {
      ...this.apartment,

      ownerFirstName: value.ownerFirstName.trim(),

      ownerLastName: value.ownerLastName.trim(),

      number: value.apartmentNumber.trim(),

      floor: value.floor,

      sqMetersApart: String(value.sqMetersApart),

      isRented: value.isRented === 'Ναι',

      residentFirstName: value.isRented === 'Ναι' ? value.residentFirstName.trim() : null,

      residentLastName: value.isRented === 'Ναι' ? value.residentLastName.trim() : null,

      parkingSpace: value.hasParking === 'Ναι',

      parkingSlot: value.hasParking === 'Ναι' ? value.parkingSlot?.trim() || null : null,

      commonPercent: Number(value.commonPercent),

      elevatorPercent: Number(value.elevatorPercent),

      heatingPercent: Number(value.heatingPercent),

      apStorageExist: Boolean(value.hasStorage),

      storageSlot: value.hasStorage ? value.storageSlot?.trim() || null : null,

      apDescription: value.apDescription?.trim() || ''
    };

    this.apartmentService.updateApartment(this.apartment.id, updatedApartment).subscribe({
      next: (updated) => {
        this.activeModal.close({
          updated: true,
          apartment: updated
        });
      },
      error: (err) => {
        console.error('Σφάλμα ενημέρωσης διαμερίσματος:', err);

        this.errorMessage = err?.error?.message || 'Η ενημέρωση του διαμερίσματος απέτυχε.';

        this.isSaving = false;
      }
    });
  }

  cancel(): void {
    this.activeModal.dismiss('cancel');
  }

  private generateFloors(building: BuildingDTO): string[] {
    const result: string[] = [];

    if (building.undergroundFloorExist) {
      result.push('Υπόγειο');
    }

    result.push('Ισόγειο');

    if (building.halfFloorExist) {
      result.push('Ημιώροφος');
    }

    const greekFloors = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'ΣΤ', 'Ζ', 'Η', 'Θ', 'Ι', 'ΙΑ', 'ΙΒ', 'ΙΓ', 'ΙΔ', 'ΙΕ'];

    const floors = building.floors ?? 0;

    result.push(...greekFloors.slice(0, floors));

    if (building.overTopFloorExist) {
      result.push('Δώμα');
    }

    return result;
  }
}
