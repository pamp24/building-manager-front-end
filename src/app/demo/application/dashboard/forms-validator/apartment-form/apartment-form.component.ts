/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/theme/shared/service';
import { BuildingMeta } from 'src/app/theme/shared/models/buildingMeta';

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

  // UI/limits από meta
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
    private router: Router,
    private auth: AuthenticationService
  ) {
    this.form = this.fb.group({
      apartments: this.fb.array([this.createApartmentForm()])
    });
  }

  ngOnInit(): void {
    // πάρ’τα όλα από meta
    this.storageLimit = this.buildingMeta?.storageNum ?? 0;
    this.managerHouseExist = this.buildingMeta?.managerHouseExist ?? false;

    this.generateFloorOptions();
    // setup validations για το 1ο group
    this.setupGroupValidation(this.apartments.at(0) as FormGroup);
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

    const greek = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'ΣΤ', 'Ζ', 'Η', 'Θ', 'Ι'];
    this.floorOptions.push(...greek.slice(0, floors));

    if (this.buildingMeta?.overTopFloorExist) {
      this.floorOptions.push('Δώμα');
    }
  }

  get apartments(): FormArray {
    return this.form.get('apartments') as FormArray;
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

      commonPercent: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      elevatorPercent: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      heatingPercent: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  addApartment(): void {
    const apartmentsLimit = this.buildingMeta?.apartmentsNum ?? 0;

    if (apartmentsLimit > 0 && this.apartments.length >= apartmentsLimit) {
      alert(`Δεν μπορείτε να προσθέσετε περισσότερα από ${apartmentsLimit} διαμερίσματα.\nΘα πρέπει να γίνει επεξεργασία της πολυκατοικίας`);
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

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // --- Extra validations από meta ---
    const apartmentsLimit = this.buildingMeta?.apartmentsNum ?? 0;
    if (apartmentsLimit > 0 && this.apartments.length > apartmentsLimit) {
      alert(`Δεν μπορείτε να δηλώσετε περισσότερα από ${apartmentsLimit} διαμερίσματα.\nΘα πρέπει να γίνει επεξεργασία της πολυκατοικίας`);
      return;
    }

    const parkingLimit = this.buildingMeta?.parkingSpacesNum ?? 0;
    const usedParking = this.apartments.value.filter((ap: any) => ap.hasParking === true).length;
    if (usedParking > parkingLimit) {
      alert(`Δεν μπορείτε να δηλώσετε περισσότερες από ${parkingLimit} θέσεις parking.\nΘα πρέπει να γίνει επεξεργασία της πολυκατοικίας`);
      return;
    }

    const storageLimit = this.buildingMeta?.storageNum ?? 0;
    const usedStorages = this.apartments.value.filter((ap: any) => ap.hasStorage === true).length;
    if (usedStorages > storageLimit) {
      alert(`Δεν μπορείτε να δηλώσετε περισσότερες από ${storageLimit} αποθήκες.\nΘα πρέπει να γίνει επεξεργασία της πολυκατοικίας`);
      return;
    }

    const currentUser = this.auth.getUser();

    const formData = this.form.value.apartments.map((apt: any) => {
      const isManager = apt.isManagerHouse === true;

      return {
        ownerFirstName: isManager ? currentUser.firstName : apt.ownerFirstName,
        ownerLastName: isManager ? currentUser.lastName : apt.ownerLastName,
        ownerId: isManager ? currentUser.id : apt.ownerId,

        isRented: apt.isRented === true,
        residentFirstName: apt.isRented ? apt.residentFirstName : null,
        residentLastName: apt.isRented ? apt.residentLastName : null,

        number: apt.apartmentNumber,
        floor: apt.floor,
        sqMetersApart: String(apt.sqMetersApart),

        parkingSpace: apt.hasParking === true,
        parkingSlot: apt.hasParking ? apt.parkingSlot : null,

        commonPercent: +apt.commonPercent,
        elevatorPercent: +apt.elevatorPercent,
        heatingPercent: +apt.heatingPercent,

        apStorageExist: apt.hasStorage === true,
        storageSlot: apt.hasStorage ? apt.storageSlot : null,

        isManagerHouse: isManager,
        active: true,
        enable: true,
        buildingId: this.buildingId
      };
    });

    this.apartmentService.saveMultiple(formData).subscribe({
      next: () => {
        alert('Τα διαμερίσματα αποθηκεύτηκαν με επιτυχία!');
        this.finished.emit(); // ✅ ο wizard θα κάνει reset
        this.router.navigate(['/user/account-profile']);
      },
      error: (err) => console.error('Σφάλμα:', err)
    });
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

  get currentUsedStorages(): number {
    return this.apartments.controls.filter((ctrl) => (ctrl as FormGroup).get('hasStorage')?.value).length;
  }

  get currentManagerHouseUsed(): boolean {
    return this.apartments.controls.some((ctrl) => (ctrl as FormGroup).get('isManagerHouse')?.value);
  }
}