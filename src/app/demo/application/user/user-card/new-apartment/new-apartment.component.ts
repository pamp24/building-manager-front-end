import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApartmentService, ApartmentRequest } from 'src/app/theme/shared/service/apartment.service';
import { BuildingService } from 'src/app/theme/shared/service/building.service';

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
  currentManagerHouseUsed = false;
  managerHouseExist = false;

  constructor(
    private fb: FormBuilder,
    private apartmentService: ApartmentService,
    private buildingService: BuildingService
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
    this.buildingService.getBuilding(buildingId).subscribe(building => {
      this.floorOptions = this.generateFloors(Number(building.floors));
      this.parkingLimit = building.parkingSpacesNum || 0;
      this.storageLimit = building.storageNum || 0;
      this.managerHouseExist = building.managerHouseExist || false;
    });
  }

  // === Helpers ===
  get apartments(): FormArray {
    return this.form.get('apartments') as FormArray;
  }

  createApartmentGroup(): FormGroup {
    return this.fb.group({
      ownerFirstName: ['', [Validators.required, Validators.minLength(3)]],
      ownerLastName: ['', [Validators.required, Validators.minLength(3)]],
      isRented: ['', Validators.required],
      residentFirstName: [''],
      residentLastName: [''],
      apartmentNumber: ['', Validators.required],
      floor: ['', Validators.required],
      sqMetersApart: ['', [Validators.required, Validators.min(1)]],
      hasParking: ['', Validators.required],
      parkingSlot: [''],
      commonPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      elevatorPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      heatingPercent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      hasStorage: [false],
      storageSlot: [''],
      isManagerHouse: [false]
    });
  }

  // === Actions ===
  addApartment(): void {
    this.apartments.push(this.createApartmentGroup());
  }

  removeApartment(index: number): void {
    this.apartments.removeAt(index);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCancel(modal?: any): void {
    if (confirm('Είστε σίγουρος ότι θέλετε να ακυρώσετε;')) {
      this.form.reset();
      this.apartments.clear();
      this.apartments.push(this.createApartmentGroup());
      if (modal) modal.dismiss();
    }
  }

  onFinish(): void {
    this.isSubmitted = true;
    if (this.form.invalid) return;

    const buildingId = Number(localStorage.getItem('buildingId'));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apartmentsToSave: ApartmentRequest[] = this.apartments.value.map((ap: any) => ({
      ownerFirstName: ap.ownerFirstName,
      ownerLastName: ap.ownerLastName,
      isRented: ap.isRented === 'Ναι',
      residentFirstName: ap.isRented === 'Ναι' ? ap.residentFirstName : null,
      residentLastName: ap.isRented === 'Ναι' ? ap.residentLastName : null,
      number: ap.apartmentNumber,
      floor: ap.floor,
      sqMetersApart: ap.sqMetersApart,
      parkingSpace: ap.hasParking === 'Ναι',
      parkingSlot: ap.hasParking === 'Ναι' ? ap.parkingSlot : null,
      commonPercent: ap.commonPercent,
      elevatorPercent: ap.elevatorPercent,
      heatingPercent: ap.heatingPercent,
      apStorageExist: ap.hasStorage,
      storageSlot: ap.hasStorage ? ap.storageSlot : null,
      isManagerHouse: ap.isManagerHouse,
      active: true,
      enable: true,
      buildingId
    }));

    this.apartmentService.saveMultiple(apartmentsToSave).subscribe({
      next: () => alert('Τα διαμερίσματα αποθηκεύτηκαν!'),
      error: err => console.error('Σφάλμα κατά την αποθήκευση', err)
    });
  }

  // === Utils ===
  private generateFloors(totalFloors: number): string[] {
    const result: string[] = ['Υπόγειο', 'Ισόγειο'];
    for (let i = 1; i <= totalFloors; i++) {
      result.push(`${i}ος`);
    }
    return result;
  }
}
