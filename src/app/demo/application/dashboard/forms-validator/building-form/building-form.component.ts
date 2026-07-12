import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { BuildingRequest } from 'src/app/theme/shared/models/buildingRequest';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { BuildingService } from 'src/app/theme/shared/service/building.service';

import {
  LOCATION_COUNTRIES,
  SupportedLocationRegion,
  resolveCountryLocations,
  resolveCountryName
} from '../location-form.utils';

@Component({
  selector: 'app-building-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './building-form.component.html',
  styleUrls: ['./building-form.component.scss']
})
export class BuildingFormComponent implements OnInit {
  @Input() selectedAction!: 'many' | 'new' | 'existing';
  @Input() form!: FormGroup;
  @Output() backClicked = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<{ buildingId: number; buildingForm: FormGroup }>();

  selectedRegulationFile: File | null = null;
  isSubmitted = false;

  countries = LOCATION_COUNTRIES;
  availableStates: SupportedLocationRegion[] = [];
  availableCities: { city: string; areas: string[] }[] = [];
  availableAreas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private buildingService: BuildingService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    if (!this.form) {
      this.form = this.createForm();
    }

    this.syncLocationSelections();
  }

  onBack(): void {
    this.backClicked.emit();
  }

  onCountryChange(): void {
    this.availableStates = resolveCountryLocations(this.form.get('country')?.value);
    this.availableCities = [];
    this.availableAreas = [];

    this.form.patchValue(
      {
        state: '',
        city: '',
        region: ''
      },
      { emitEvent: false }
    );
  }

  onStateChange(): void {
    const selectedState = this.form.get('state')?.value;
    const match = this.availableStates.find((state) => state.region === selectedState);

    this.availableCities = match?.cities ?? [];
    this.availableAreas = [];

    this.form.patchValue(
      {
        city: '',
        region: ''
      },
      { emitEvent: false }
    );
  }

  onCityChange(): void {
    const selectedCity = this.form.get('city')?.value;
    const match = this.availableCities.find((city) => city.city === selectedCity);

    this.availableAreas = match?.areas ?? [];
    this.form.patchValue({ region: '' }, { emitEvent: false });
  }

  submitBuildingForm(): void {
    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const user = this.authenticationService.currentUserValue;

    if (!user?.id) {
      console.error('Δεν βρέθηκε ID χρήστη.');
      return;
    }

    const isPropertyManager = user.role === 'PropertyManager';

    const building: BuildingRequest = {
      name: formValue.name,
      street1: formValue.street1,
      stNumber1: formValue.stNumber1,
      street2: formValue.street2,
      stNumber2: formValue.stNumber2,
      country: resolveCountryName(formValue.country),
      state: formValue.state,
      city: formValue.city,
      region: formValue.region,
      postalCode: formValue.postalCode,
      floors: Number(formValue.floors),
      apartmentsNum: Number(formValue.apartmentsNum),
      sqMetersTotal: String(formValue.sqMetersTotal),
      sqMetersCommonSpaces: String(formValue.sqMetersCommonSpaces),
      parkingExist: formValue.parkingExist,
      parkingSpacesNum: formValue.parkingExist ? Number(formValue.parkingSpacesNum) : 0,
      buildingDescription: formValue.description,
      undergroundFloorExist: formValue.undergroundFloorExist,
      halfFloorExist: formValue.halfFloorExist,
      overTopFloorExist: formValue.overTopFloorExist,
      managerHouseExist: formValue.managerHouseExist,
      storageExist: formValue.storageExist,
      storageNum: formValue.storageExist ? Number(formValue.storageNum) : 0,
      hasCentralHeating: formValue.hasCentralHeating,
      heatingType: formValue.hasCentralHeating ? formValue.heatingType : 'NONE',
      heatingCapacityLitres: formValue.hasCentralHeating ? Number(formValue.heatingCapacityLitres) : 0,
      active: true,
      enable: true,
      ...(isPropertyManager ? {} : { managerId: user.id })
    };

    const request$ = isPropertyManager
      ? this.buildingService.createCompanyBuilding(building)
      : this.buildingService.createSelfBuilding(building);

    request$.subscribe({
      next: (buildingId: number) => {
        this.formSubmitted.emit({ buildingId, buildingForm: this.form });
      },
      error: (err) => {
        console.error('Σφάλμα δημιουργίας κτιρίου', err);
      }
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

    const maxSizeMb = 10;

    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`Το αρχείο είναι μεγάλο. Μέγιστο επιτρεπτό: ${maxSizeMb}MB.`);
      input.value = '';
      this.selectedRegulationFile = null;
      return;
    }

    this.selectedRegulationFile = file;
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      street1: ['', Validators.required],
      stNumber1: ['', Validators.required],
      street2: [''],
      stNumber2: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      region: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      floors: [0, [Validators.required, Validators.min(0)]],
      apartmentsNum: [1, [Validators.required, Validators.min(1)]],
      sqMetersTotal: [0, [Validators.required, Validators.min(1)]],
      sqMetersCommonSpaces: [0],
      description: [''],
      parkingExist: [false],
      parkingSpacesNum: [0],
      undergroundFloorExist: [false],
      halfFloorExist: [false],
      overTopFloorExist: [false],
      managerHouseExist: [false],
      storageExist: [false],
      storageNum: [0],
      hasCentralHeating: [false],
      heatingType: ['NONE'],
      heatingCapacityLitres: [0]
    });
  }

  private syncLocationSelections(): void {
    this.availableStates = resolveCountryLocations(this.form.get('country')?.value);

    const selectedState = this.form.get('state')?.value;
    const selectedCity = this.form.get('city')?.value;
    const matchingState = this.availableStates.find((state) => state.region === selectedState);

    this.availableCities = matchingState?.cities ?? [];
    this.availableAreas = this.availableCities.find((city) => city.city === selectedCity)?.areas ?? [];
  }
}
