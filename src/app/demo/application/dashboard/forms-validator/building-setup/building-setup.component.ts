import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BuildingMeta } from 'src/app/theme/shared/models/buildingMeta';
import { BuildingSetupResult } from 'src/app/theme/shared/models/building-setup-result';

import { BuildingFormComponent } from '../building-form/building-form.component';
import { ExistingBuildingFormComponent } from '../existing-building-form/existing-building-form.component';
import { MultipleBuildingFormComponent } from '../multiple-building-form/multiple-building-form.component';

@Component({
  selector: 'app-building-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BuildingFormComponent, ExistingBuildingFormComponent, MultipleBuildingFormComponent],
  templateUrl: './building-setup.component.html',
  styleUrls: ['./building-setup.component.scss']
})
export class BuildingSetupComponent implements OnInit {
  @Input() action!: 'many' | 'new' | 'existing';
  @Output() completed = new EventEmitter<BuildingSetupResult>();
  @Output() back = new EventEmitter<void>();

  companyCompleted = false;
  buildingForm: FormGroup;
  companyId: number | null = null;

  constructor(private fb: FormBuilder) {
    this.buildingForm = this.fb.group({
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

  ngOnInit(): void {}

  onBuildingCreated(event: { buildingId: number; buildingForm: FormGroup }): void {
    this.completed.emit({
      buildingId: event.buildingId,
      buildingMeta: this.toMeta(event.buildingForm)
    });
  }

  onBack(): void {
    this.back.emit();
  }

  onCompanyCreated(companyId: number): void {
    this.companyId = companyId;
    this.companyCompleted = true;

    this.buildingForm.reset({
      name: '',
      street1: '',
      stNumber1: '',
      street2: '',
      stNumber2: '',
      country: '',
      state: '',
      city: '',
      region: '',
      postalCode: '',
      floors: 0,
      apartmentsNum: 1,
      sqMetersTotal: 0,
      sqMetersCommonSpaces: 0,
      description: '',
      parkingExist: false,
      parkingSpacesNum: 0,
      undergroundFloorExist: false,
      halfFloorExist: false,
      overTopFloorExist: false,
      managerHouseExist: false,
      storageExist: false,
      storageNum: 0,
      hasCentralHeating: false,
      heatingType: 'NONE',
      heatingCapacityLitres: 0
    });
  }

  changeCompany(): void {
    this.companyCompleted = false;
    this.companyId = null;
  }

  onManyBuildingCreated(event: { buildingId: number; buildingForm: FormGroup }): void {
    this.completed.emit({
      buildingId: event.buildingId,
      buildingMeta: this.toMeta(event.buildingForm)
    });
  }

  private toMeta(form: FormGroup): BuildingMeta {
    const v = form.value;

    return {
      apartmentsNum: Number(v.apartmentsNum || 0),
      floors: Number(v.floors || 0),
      undergroundFloorExist: !!v.undergroundFloorExist,
      halfFloorExist: !!v.halfFloorExist,
      overTopFloorExist: !!v.overTopFloorExist,
      parkingSpacesNum: Number(v.parkingSpacesNum || 0),
      storageNum: Number(v.storageNum || 0),
      managerHouseExist: !!v.managerHouseExist
    };
  }
}
