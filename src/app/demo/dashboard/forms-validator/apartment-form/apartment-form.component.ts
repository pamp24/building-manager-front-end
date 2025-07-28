import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';
import { Router } from '@angular/router';
import { BuildingService } from '../../../../theme/shared/service/building.service';

@Component({
  selector: 'app-apartment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './apartment-form.component.html',
  styleUrls: ['./apartment-form.component.scss']
})
export class ApartmentFormComponent implements OnInit, OnChanges {
  form: FormGroup;
  isSubmitted = false;
  storageLimit = 0;
  managerHouseExists = false;
  floorOptions: string[] = [];

  @Input() buildingId!: number;
  @Input() buildingForm!: FormGroup;
  @Output() backClicked = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private apartmentService: ApartmentService,
    private router: Router,
    private buildingService: BuildingService
  ) {
    this.form = this.fb.group({
      apartments: this.fb.array([this.createApartmentForm()])
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buildingForm'] && this.buildingForm) {
      this.generateFloorOptions();

      this.buildingForm.get('undergroundFloorExists')?.valueChanges.subscribe(() => this.generateFloorOptions());
      this.buildingForm.get('halfFloorExists')?.valueChanges.subscribe(() => this.generateFloorOptions());
      this.buildingForm.get('overTopFloorExists')?.valueChanges.subscribe(() => this.generateFloorOptions());
      this.buildingForm.get('floors')?.valueChanges.subscribe(() => this.generateFloorOptions());
    }
  }
ngOnInit(): void {
  const storageStr = localStorage.getItem('storageNum');
  this.storageLimit = storageStr ? +storageStr : 0;

  const managerHouseExistsStr = localStorage.getItem('managerHouseExists');
  this.managerHouseExists = managerHouseExistsStr === 'true';

  const storedId = localStorage.getItem('buildingId');
  if (storedId) {
    this.buildingId = +storedId;
    console.log('Building ID loaded:', this.buildingId);
  } else {
    console.warn('No building ID found in localStorage');
  }

  this.setupDynamicValidation();
}

generateFloorOptions(): void {
  this.floorOptions = [];

  const underground = this.buildingForm.get('undergroundFloorExists')?.value;
  const half = this.buildingForm.get('halfFloorExists')?.value;
  const overTop = this.buildingForm.get('overTopFloorExists')?.value;
  const floors = Number(this.buildingForm.get('floors')?.value) || 0;

  if (underground) this.floorOptions.push('Υπόγειο');
  this.floorOptions.push('Ισόγειο');
  if (half) this.floorOptions.push('Ημιόροφος');

  const greekLetters = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'ΣΤ', 'Ζ', 'Η', 'Θ', 'Ι', 'ΙΑ', 'ΙΒ', 'ΙΓ', 'ΙΔ', 'ΙΕ'];
  for (let i = 0; i < floors && i < greekLetters.length; i++) {
    this.floorOptions.push(greekLetters[i]);
  }

  if (overTop) this.floorOptions.push('Δώμα');

  console.log('📌 Όροφοι:', this.floorOptions);
}

  get apartments(): FormArray {
    return this.form.get('apartments') as FormArray;
  }

  createApartmentForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      isRented: ['', Validators.required],
      tenantFullName: [''],
      apartmentNumber: ['', Validators.required],
      floor: ['', [Validators.required]],
      sqMetersApart: ['', [Validators.required, Validators.min(1)]],
      hasParking: ['', Validators.required],
      parkingSlot: [''],
      hasStorage: [false],
      storageSlot: [''],
      isManagerHouse: [false],
      commonPercent: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      elevatorPercent: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      heatingPercent: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  addApartment(): void {
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
    if (confirm('Θέλετε να ακυρώσετε την καταχώρηση διαμερισμάτων; Η πολυκατοικία θα διαγραφεί από τη μνήμη.')) {
      localStorage.removeItem('buildingId');
      this.backClicked.emit();
    }
  }

  onFinish(): void {
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formData = this.form.value.apartments.map((apt: any) => ({
      fullName: apt.fullName,
      isRented: apt.isRented === 'Ναι',
      tenantFullName: apt.isRented === 'Ναι' ? apt.tenantFullName : null,
      number: apt.apartmentNumber,
      floor: apt.floor,
      sqMetersApart: +apt.sqMetersApart,
      parkingSpace: apt.hasParking === 'Ναι',
      parkingSlot: apt.hasParking === 'Ναι' ? apt.parkingSlot : null,
      commonPercent: +apt.commonPercent,
      elevatorPercent: +apt.elevatorPercent,
      heatingPercent: +apt.heatingPercent,
      apStorageExists: apt.hasStorage,
      storageSlot: apt.hasStorage ? apt.storageSlot : null,
      isManagerHouse: apt.isManagerHouse,
      active: true,
      enable: true,
      buildingId: this.buildingId
    }));
    this.apartmentService.saveMultiple(formData).subscribe({
      next: () => {
        alert('Τα διαμερίσματα αποθηκεύτηκαν με επιτυχία!');
        localStorage.removeItem('buildingId');
        this.router.navigate(['/user/account-profile']);
      },
      error: (err) => {
        console.error('Σφάλμα:', err);
      }
    });
  }

  private setupDynamicValidation(): void {
    this.apartments.controls.forEach((group) => this.setupGroupValidation(group as FormGroup));
  }

  private setupGroupValidation(group: FormGroup): void {
    group.get('isRented')?.valueChanges.subscribe((value) => {
      const tenantCtrl = group.get('tenantFullName');
      if (value === 'Ναι') {
        tenantCtrl?.setValidators([Validators.required, Validators.minLength(3)]);
      } else {
        tenantCtrl?.clearValidators();
        tenantCtrl?.setValue('');
      }
      tenantCtrl?.updateValueAndValidity();
    });

    group.get('hasParking')?.valueChanges.subscribe((value) => {
      const parkingCtrl = group.get('parkingSlot');
      if (value === 'Ναι') {
        parkingCtrl?.setValidators([Validators.required]);
      } else {
        parkingCtrl?.clearValidators();
        parkingCtrl?.setValue('');
      }
      parkingCtrl?.updateValueAndValidity();
    });

    group.get('hasStorage')?.valueChanges.subscribe((value) => {
      const storageCtrl = group.get('storageSlot');
      if (value === true) {
        storageCtrl?.setValidators([Validators.required]);
      } else {
        storageCtrl?.clearValidators();
        storageCtrl?.setValue('');
      }
      storageCtrl?.updateValueAndValidity();
    });
  }

  get currentUsedStorages(): number {
    return this.apartments.controls.filter((ctrl) => (ctrl as FormGroup).get('hasStorage')?.value).length;
  }
  get currentManagerHouseUsed(): boolean {
    return this.apartments.controls.some((ctrl) => (ctrl as FormGroup).get('isManagerHouse')?.value);
  }
}
