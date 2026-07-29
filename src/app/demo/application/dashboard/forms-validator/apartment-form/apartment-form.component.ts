/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { BuildingMeta } from 'src/app/theme/shared/models/buildingMeta';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';
import { AuthenticationService } from 'src/app/theme/shared/service';

@Component({
  selector: 'app-apartment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './apartment-form.component.html',
  styleUrls: ['./apartment-form.component.scss']
})
export class ApartmentFormComponent implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  errorMessage = '';

  storageLimit = 0;
  managerHouseExist = false;
  floorOptions: string[] = [];

  @Input() buildingId!: number;
  @Input() buildingMeta!: BuildingMeta;

  @Output() backClicked = new EventEmitter<void>();
  @Output() finished = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private apartmentService: ApartmentService,
    private auth: AuthenticationService
  ) {
    this.form = this.fb.group({
      apartments: this.fb.array([this.createApartmentForm()])
    });
  }

  ngOnInit(): void {
    this.storageLimit = this.buildingMeta?.storageNum ?? 0;
    this.managerHouseExist = this.buildingMeta?.managerHouseExist ?? false;

    this.generateFloorOptions();
    this.setupGroupValidation(this.apartments.at(0) as FormGroup);
  }

  get apartments(): FormArray {
    return this.form.get('apartments') as FormArray;
  }

  trackByFloor(_index: number, item: string): string {
    return item;
  }

  generateFloorOptions(): void {
    const floors = this.buildingMeta?.floors ?? 0;

    this.floorOptions = [];

    if (this.buildingMeta?.undergroundFloorExist) {
      this.floorOptions.push('Υπόγειο');
    }

    this.floorOptions.push('Ισόγειο');

    if (this.buildingMeta?.halfFloorExist) {
      this.floorOptions.push('Ημιόροφος');
    }

    const greekFloors = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'ΣΤ', 'Ζ', 'Η', 'Θ', 'Ι'];
    this.floorOptions.push(...greekFloors.slice(0, floors));

    if (this.buildingMeta?.overTopFloorExist) {
      this.floorOptions.push('Δώμα');
    }
  }

  createApartmentForm(): FormGroup {
    return this.fb.group({
      ownerFirstName: ['', [Validators.required, Validators.minLength(3)]],
      ownerLastName: ['', [Validators.required, Validators.minLength(3)]],
      isRented: [null as boolean | null, Validators.required],
      residentFirstName: [''],
      residentLastName: [''],
      apartmentNumber: ['', Validators.required],
      floor: ['', Validators.required],
      sqMetersApart: ['', [Validators.required, Validators.min(1)]],
      hasParking: [null as boolean | null, Validators.required],
      parkingSlot: [''],
      hasStorage: [false],
      storageSlot: [''],
      isManagerHouse: [false],
      ownerId: [null],
      commonPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      elevatorPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      heatingPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  addApartment(): void {
    const apartmentsLimit = this.buildingMeta?.apartmentsNum ?? 0;

    if (apartmentsLimit > 0 && this.apartments.length >= apartmentsLimit) {
      alert(`Δεν μπορείτε να προσθέσετε περισσότερα από ${apartmentsLimit} διαμερίσματα.\nΘα πρέπει να γίνει επεξεργασία της πολυκατοικίας.`);
      return;
    }

    const group = this.createApartmentForm();
    this.apartments.push(group);
    this.setupGroupValidation(group);
  }

  removeApartment(index: number): void {
    if (this.apartments.length > 1) {
      this.apartments.removeAt(index);
    }
  }

  onBack(): void {
    this.backClicked.emit();
  }

  onFinish(): void {
    this.isSubmitted = true;
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const invalidFields = this.getInvalidFieldLabels();
      this.errorMessage = invalidFields.length > 0
        ? `Υπάρχουν μη έγκυρα πεδία: ${invalidFields.join(', ')}.`
        : 'Συμπληρώστε όλα τα υποχρεωτικά πεδία πριν την ολοκλήρωση.';
      return;
    }

    const apartmentsLimit = this.buildingMeta?.apartmentsNum ?? 0;
    if (apartmentsLimit > 0 && this.apartments.length > apartmentsLimit) {
      this.errorMessage = `Δεν μπορείτε να δηλώσετε περισσότερα από ${apartmentsLimit} διαμερίσματα.`;
      return;
    }

    const parkingLimit = this.buildingMeta?.parkingSpacesNum ?? 0;
    const usedParking = this.apartments.value.filter((apartment: any) => apartment.hasParking === true).length;
    if (usedParking > parkingLimit) {
      this.errorMessage = `Δεν μπορείτε να δηλώσετε περισσότερες από ${parkingLimit} θέσεις parking.`;
      return;
    }

    const storageLimit = this.buildingMeta?.storageNum ?? 0;
    const usedStorages = this.apartments.value.filter((apartment: any) => apartment.hasStorage === true).length;
    if (usedStorages > storageLimit) {
      this.errorMessage = `Δεν μπορείτε να δηλώσετε περισσότερες από ${storageLimit} αποθήκες.`;
      return;
    }

    const currentUser = this.auth.getUser();

    const formData = this.form.value.apartments.map((apartment: any) => {
      const isManager = apartment.isManagerHouse === true;

      return {
        ownerFirstName: isManager ? currentUser.firstName : apartment.ownerFirstName,
        ownerLastName: isManager ? currentUser.lastName : apartment.ownerLastName,
        ownerId: isManager ? currentUser.id : apartment.ownerId,
        isRented: apartment.isRented === true,
        residentFirstName: apartment.isRented ? apartment.residentFirstName : null,
        residentLastName: apartment.isRented ? apartment.residentLastName : null,
        number: apartment.apartmentNumber,
        floor: apartment.floor,
        sqMetersApart: String(apartment.sqMetersApart),
        parkingSpace: apartment.hasParking === true,
        parkingSlot: apartment.hasParking ? apartment.parkingSlot : null,
        commonPercent: Number(apartment.commonPercent),
        elevatorPercent: Number(apartment.elevatorPercent),
        heatingPercent: Number(apartment.heatingPercent),
        apStorageExist: apartment.hasStorage === true,
        storageSlot: apartment.hasStorage ? apartment.storageSlot : null,
        isManagerHouse: isManager,
        active: true,
        enable: true,
        buildingId: this.buildingId
      };
    });

    this.apartmentService.saveMultiple(formData).subscribe({
      next: () => {
        alert('Τα διαμερίσματα αποθηκεύτηκαν με επιτυχία!');
        this.finished.emit();
      },
      error: (err) => {
        console.error('Σφάλμα:', err);
        this.errorMessage = err?.error?.message || 'Η αποθήκευση των διαμερισμάτων απέτυχε. Ελέγξτε τα στοιχεία και δοκιμάστε ξανά.';
      }
    });
  }

  get currentUsedStorages(): number {
    return this.apartments.controls.filter((ctrl) => (ctrl as FormGroup).get('hasStorage')?.value).length;
  }

  get currentManagerHouseUsed(): boolean {
    return this.apartments.controls.some((ctrl) => (ctrl as FormGroup).get('isManagerHouse')?.value);
  }

  private setupGroupValidation(group: FormGroup): void {
    group.get('isRented')?.valueChanges.subscribe((value: boolean | null) => {
      const first = group.get('residentFirstName');
      const last = group.get('residentLastName');

      if (value === true) {
        first?.setValidators([Validators.required, Validators.minLength(3)]);
        last?.setValidators([Validators.required, Validators.minLength(3)]);
      } else {
        first?.clearValidators();
        first?.setValue('');
        last?.clearValidators();
        last?.setValue('');
      }

      first?.updateValueAndValidity();
      last?.updateValueAndValidity();
    });

    group.get('hasParking')?.valueChanges.subscribe((value: boolean | null) => {
      const parkingCtrl = group.get('parkingSlot');

      if (value === true) {
        parkingCtrl?.setValidators([Validators.required]);
      } else {
        parkingCtrl?.clearValidators();
        parkingCtrl?.setValue('');
      }

      parkingCtrl?.updateValueAndValidity();
    });

    group.get('hasStorage')?.valueChanges.subscribe((value: boolean) => {
      const storageCtrl = group.get('storageSlot');

      if (value === true) {
        storageCtrl?.setValidators([Validators.required]);
      } else {
        storageCtrl?.clearValidators();
        storageCtrl?.setValue('');
      }

      storageCtrl?.updateValueAndValidity();
    });

    group.get('isManagerHouse')?.valueChanges.subscribe((checked: boolean) => {
      if (checked === true) {
        const user = this.auth.getUser();
        group.patchValue({
          ownerFirstName: user.firstName,
          ownerLastName: user.lastName,
          ownerId: user.id
        });
      }
    });
  }

  private getInvalidFieldLabels(): string[] {
    const fieldLabels: Record<string, string> = {
      ownerFirstName: 'Όνομα ιδιοκτήτη',
      ownerLastName: 'Επώνυμο ιδιοκτήτη',
      isRented: 'Ενοικιάζεται',
      residentFirstName: 'Όνομα ενοικιαστή',
      residentLastName: 'Επώνυμο ενοικιαστή',
      apartmentNumber: 'Αριθμός διαμερίσματος',
      floor: 'Όροφος',
      sqMetersApart: 'Τετραγωνικά μέτρα',
      hasParking: 'Parking',
      parkingSlot: 'Θέση parking',
      hasStorage: 'Αποθήκη',
      storageSlot: 'Αριθμός αποθήκης',
      commonPercent: 'Χιλιοστά κοινοχρήστων',
      elevatorPercent: 'Χιλιοστά ασανσέρ',
      heatingPercent: 'Χιλιοστά θέρμανσης'
    };

    const invalid: string[] = [];

    this.apartments.controls.forEach((control, index) => {
      const group = control as FormGroup;
      Object.entries(group.controls).forEach(([name, fieldControl]) => {
        if (fieldControl.invalid) {
          invalid.push(`Διαμέρισμα ${index + 1}: ${fieldLabels[name] ?? name}`);
        }
      });
    });

    return invalid;
  }
}
