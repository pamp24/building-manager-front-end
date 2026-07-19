import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApartmentRequest } from 'src/app/theme/shared/models/apartmentRequest';

@Component({
  selector: 'app-new-apartment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-apartment.component.html',
  styleUrls: ['./new-apartment.component.scss']
})
export class NewApartmentComponent implements OnInit {
  form!: FormGroup;
  isSubmitted = false;

  // Options
  floorOptions: string[] = [];
  parkingLimit = 0;
  storageLimit = 0;

  currentUsedParking = 0;
  currentUsedStorages = 0;

  constructor(
    private fb: FormBuilder,
    private apartmentService: ApartmentService,
    private buildingService: BuildingService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    // Αρχικοποίηση φόρμας
    this.form = this.fb.group({
      apartments: this.fb.array([this.createApartmentGroup()])
    });

    const buildingId = Number(localStorage.getItem('buildingId'));
    if (!buildingId) {
      alert('Δεν βρέθηκε κωδικός πολυκατοικίας');
      return;
    }
    // Φόρτωμα στοιχείων πολυκατοικίας
    this.buildingService.getBuilding(buildingId).subscribe((building: BuildingDTO) => {
      this.apartmentService.getApartmentsByBuilding(buildingId).subscribe({
        next: (apartments) => {
          this.currentUsedParking = apartments.filter((apartment) => apartment.parkingSpace).length;

          this.currentUsedStorages = apartments.filter((apartment) => apartment.apStorageExist).length;

          this.updateFormControlsState();
        },
        error: (err) => {
          console.error('Σφάλμα φόρτωσης διαμερισμάτων:', err);
        }
      });
      this.floorOptions = this.generateFloors(building);
      this.parkingLimit = building.parkingSpacesNum || 0;
      this.storageLimit = building.storageNum || 0;
    });
  }
  private updateFormControlsState(): void {
    this.apartments.controls.forEach((group) => {
      // Parking
      if (this.currentUsedParking >= this.parkingLimit) {
        group.get('hasParking')?.disable({ emitEvent: false });
      } else {
        group.get('hasParking')?.enable({ emitEvent: false });
      }

      // Storage
      if (this.currentUsedStorages >= this.storageLimit) {
        group.get('hasStorage')?.disable({ emitEvent: false });
      } else {
        group.get('hasStorage')?.enable({ emitEvent: false });
      }
    });
  }

  // === Helpers ===
  get apartments(): FormArray {
    return this.form.get('apartments') as FormArray;
  }

  createApartmentGroup(): FormGroup {
    const hasParkingDisabled = this.currentUsedParking >= this.parkingLimit;
    const hasStorageDisabled = this.currentUsedStorages >= this.storageLimit;
    const group = this.fb.group({
      ownerFirstName: ['', [Validators.required, Validators.minLength(3)]],
      ownerLastName: ['', [Validators.required, Validators.minLength(3)]],
      isRented: ['', Validators.required],
      residentFirstName: [''],
      residentLastName: [''],
      apartmentNumber: ['', Validators.required],
      floor: ['', Validators.required],
      sqMetersApart: ['', [Validators.required, Validators.min(1)]],
      hasParking: [
        {
          value: '',
          disabled: hasParkingDisabled
        },
        Validators.required
      ],
      parkingSlot: [''],
      commonPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      elevatorPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      heatingPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      hasStorage: [
        {
          value: false,
          disabled: hasStorageDisabled
        }
      ],
      storageSlot: ['']
    });

    group.get('isRented')?.valueChanges.subscribe((value) => {
      const residentFirstName = group.get('residentFirstName');
      const residentLastName = group.get('residentLastName');
      if (value === 'Ναι') {
        residentFirstName?.setValidators([Validators.required, Validators.minLength(3)]);
        residentLastName?.setValidators([Validators.required, Validators.minLength(3)]);
      } else {
        residentFirstName?.clearValidators();
        residentLastName?.clearValidators();
        residentFirstName?.setValue('', {
          emitEvent: false
        });

        residentLastName?.setValue('', {
          emitEvent: false
        });
      }

      residentFirstName?.updateValueAndValidity({
        emitEvent: false
      });

      residentLastName?.updateValueAndValidity({
        emitEvent: false
      });
    });

    return group;
  }

  // === Actions ===
  addApartment(): void {
    this.apartments.push(this.createApartmentGroup());
  }

  removeApartment(index: number): void {
    this.apartments.removeAt(index);
  }

  onCancel(): void {
    if (confirm('Είστε σίγουρος ότι θέλετε να ακυρώσετε;')) {
      this.form.reset();
      this.apartments.clear();
      this.apartments.push(this.createApartmentGroup());
      this.activeModal.dismiss();
    }
  }

  onFinish(): void {
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const buildingId = Number(localStorage.getItem('buildingId'));
    if (!buildingId) {
      alert('Δεν βρέθηκε κωδικός πολυκατοικίας.');
      return;
    }

    const apartmentsToSave: ApartmentRequest[] = this.apartments.getRawValue().map((ap) => ({
      ownerFirstName: ap.ownerFirstName,
      ownerLastName: ap.ownerLastName,
      number: ap.apartmentNumber,
      floor: ap.floor,
      sqMetersApart: String(ap.sqMetersApart),
      isRented: ap.isRented === 'Ναι',
      residentFirstName: ap.isRented === 'Ναι' ? ap.residentFirstName : null,
      residentLastName: ap.isRented === 'Ναι' ? ap.residentLastName : null,
      parkingSpace: ap.hasParking === 'Ναι',
      parkingSlot: ap.hasParking === 'Ναι' ? ap.parkingSlot : null,
      commonPercent: Number(ap.commonPercent),
      elevatorPercent: Number(ap.elevatorPercent),
      heatingPercent: Number(ap.heatingPercent),
      apStorageExist: Boolean(ap.hasStorage),
      storageSlot: ap.hasStorage ? ap.storageSlot : null,
      isManagerHouse: false,
      active: true,
      enable: true,
      buildingId
    }));

    this.apartmentService.saveMultiple(apartmentsToSave).subscribe({
      next: () => {
        alert('Τα διαμερίσματα αποθηκεύτηκαν!');
        this.activeModal.close({
          saved: true
        });
      },
      error: (err) => {
        console.error('Σφάλμα κατά την αποθήκευση', err);
      }
    });
  }

  // === Utils ===
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
