import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class ApartmentFormComponent implements OnInit {
  form: FormGroup;
  isSubmitted = false;

  @Input() buildingId!: number;
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

  ngOnInit(): void {
    const storedId = localStorage.getItem('buildingId');
    if (storedId) {
      this.buildingId = +storedId;
      console.log('Building ID loaded:', this.buildingId);
    } else {
      console.warn('No building ID found in localStorage');
    }

    this.setupDynamicValidation();
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
      floor: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      sqMetersApart: ['', [Validators.required, Validators.min(1)]],
      hasParking: ['', Validators.required],
      parkingSlot: [''],
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
      floor: +apt.floor,
      sqMetersApart: +apt.sqMetersApart,
      parkingSpace: apt.hasParking === 'Ναι',
      parkingSlot: apt.hasParking === 'Ναι' ? apt.parkingSlot : null,
      commonPercent: +apt.commonPercent,
      elevatorPercent: +apt.elevatorPercent,
      heatingPercent: +apt.heatingPercent,
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
  }
}
