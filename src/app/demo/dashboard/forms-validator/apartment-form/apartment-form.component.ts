import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';
import { Router } from '@angular/router';
import { BuildingService } from '../../../../theme/shared/service/building.service';
import { AuthenticationService } from 'src/app/theme/shared/service';

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
  managerHouseExist = false;
  floorOptions: string[] = [];

  managerUserId: number | null = null;

  @Input() buildingId!: number;
  @Input() buildingForm!: FormGroup;
  @Output() backClicked = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private apartmentService: ApartmentService,
    private router: Router,
    private buildingService: BuildingService,
    private auth: AuthenticationService
  ) {
    this.form = this.fb.group({
      apartments: this.fb.array([this.createApartmentForm()])
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['buildingForm'] && this.buildingForm) {
      this.generateFloorOptions();

      this.buildingForm.get('undergroundFloorExist')?.valueChanges.subscribe(() => this.generateFloorOptions());
      this.buildingForm.get('halfFloorExist')?.valueChanges.subscribe(() => this.generateFloorOptions());
      this.buildingForm.get('overTopFloorExist')?.valueChanges.subscribe(() => this.generateFloorOptions());
      this.buildingForm.get('floors')?.valueChanges.subscribe(() => this.generateFloorOptions());
    }
  }
  ngOnInit(): void {
    const storageStr = localStorage.getItem('storageNum');
    this.storageLimit = storageStr ? +storageStr : 0;

    const managerHouseExistStr = localStorage.getItem('managerHouseExist');
    this.managerHouseExist = managerHouseExistStr === 'true';

    const storedId = localStorage.getItem('buildingId');

    if (storedId) {
      this.buildingId = +storedId;
      console.log('Building ID loaded:', this.buildingId);
    } else {
      console.warn('No building ID found in localStorage');
    }

    this.setupDynamicValidation();

    // αρχική τιμή από parent, αλλιώς fallback σε localStorage
    if (this.buildingId) {
      this.buildingService.getBuildingManager(this.buildingId).subscribe({
        next: (m) => {
          this.managerUserId = m?.id ?? null;

          // Αν κάποιο διαμέρισμα είναι ήδη τσεκαρισμένο ως διαχειριστή,
          // γράψε ownerId τώρα που έχουμε managerUserId
          this.apartments.controls.forEach((ctrl) => {
            const g = ctrl as FormGroup;
            if (g.get('isManagerHouse')?.value && this.managerUserId) {
              g.get('ownerId')?.setValue(this.managerUserId);
            }
          });
        },
        error: () => (this.managerUserId = null)
      });
    }
  }

  generateFloorOptions(): void {
    this.floorOptions = [];

    const underground = this.buildingForm.get('undergroundFloorExist')?.value;
    const half = this.buildingForm.get('halfFloorExist')?.value;
    const overTop = this.buildingForm.get('overTopFloorExist')?.value;
    const floors = Number(this.buildingForm.get('floors')?.value) || 0;

    if (underground) this.floorOptions.push('Υπόγειο');
    this.floorOptions.push('Ισόγειο');
    if (half) this.floorOptions.push('Ημιόροφος');

    const greekLetters = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'ΣΤ', 'Ζ', 'Η', 'Θ', 'Ι', 'ΙΑ', 'ΙΒ', 'ΙΓ', 'ΙΔ', 'ΙΕ'];
    for (let i = 0; i < floors && i < greekLetters.length; i++) {
      this.floorOptions.push(greekLetters[i]);
    }

    if (overTop) this.floorOptions.push('Δώμα');

    console.log('Όροφοι:', this.floorOptions);
  }

  get apartments(): FormArray {
    return this.form.get('apartments') as FormArray;
  }

  createApartmentForm(): FormGroup {
    return this.fb.group({
      ownerFirstName: ['', [Validators.required, Validators.minLength(3)]],
      ownerLastName: ['', [Validators.required, Validators.minLength(3)]],
      isRented: ['', Validators.required],
      residentFirstName: [''],
      residentLastName: [''],
      apartmentNumber: ['', Validators.required],
      floor: ['', [Validators.required]],
      sqMetersApart: ['', [Validators.required, Validators.min(1)]],
      hasParking: ['', Validators.required],
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
    this.backClicked.emit(); // ο γονιός θα κάνει delete + cleanup
  }

  onFinish(): void {
  this.isSubmitted = true;

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const currentUser = this.auth.getUser(); // 👈 τρέχων χρήστης

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formData = this.form.value.apartments.map((apt: any) => {
    // Αν είναι το διαμέρισμα διαχειριστή -> γεμίζουμε με τα στοιχεία του currentUser
    const isManager = apt.isManagerHouse;

    return {
      ownerFirstName: isManager ? currentUser.firstName : apt.ownerFirstName,
      ownerLastName:  isManager ? currentUser.lastName  : apt.ownerLastName,
      ownerId:        isManager ? currentUser.id        : apt.ownerId,

      isRented: apt.isRented === 'Ναι',
      residentFirstName: apt.isRented === 'Ναι' ? apt.residentFirstName : null,
      residentLastName:  apt.isRented === 'Ναι' ? apt.residentLastName  : null,

      number: apt.apartmentNumber,
      floor: apt.floor,
      sqMetersApart: String(apt.sqMetersApart),
      parkingSpace: apt.hasParking === 'Ναι',
      parkingSlot: apt.hasParking === 'Ναι' ? apt.parkingSlot : null,

      commonPercent: +apt.commonPercent,
      elevatorPercent: +apt.elevatorPercent,
      heatingPercent: +apt.heatingPercent,

      apStorageExist: apt.hasStorage,
      storageSlot: apt.hasStorage ? apt.storageSlot : null,

      isManagerHouse: isManager,
      apDescription: apt.apDescription ?? null,

      active: true,
      enable: true,
      buildingId: this.buildingId
    };
  });

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
    // σωστό validation για ένοικο
    group.get('isRented')?.valueChanges.subscribe((value) => {
      const first = group.get('residentFirstName');
      const last = group.get('residentLastName');
      if (value === 'Ναι') {
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

    group.get('isManagerHouse')?.valueChanges.subscribe((checked: boolean) => {
      const ownerIdCtrl = group.get('ownerId');
      const first = group.get('ownerFirstName');
      const last = group.get('ownerLastName');

      if (checked) {
        const user = this.auth.getUser();
        if (user) {
          ownerIdCtrl?.setValue(user.id);
          first?.setValue(user.firstName);
          last?.setValue(user.lastName);

          // disable editing
          first?.disable({ emitEvent: false });
          last?.disable({ emitEvent: false });
        }
      } else {
        ownerIdCtrl?.setValue(null);
        first?.reset();
        last?.reset();

        // enable editing again
        first?.enable({ emitEvent: false });
        last?.enable({ emitEvent: false });
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
