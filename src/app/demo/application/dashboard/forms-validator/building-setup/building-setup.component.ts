import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ExistingBuildingFormComponent } from '../existing-building-form/existing-building-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultipleBuildingFormComponent } from '../multiple-building-form/multiple-building-form.component';
import { BuildingSetupResult } from 'src/app/theme/shared/models/building-setup-result';
import { BuildingMeta } from 'src/app/theme/shared/models/buildingMeta';

@Component({
  selector: 'app-building-setup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ExistingBuildingFormComponent,
    MultipleBuildingFormComponent
  ],
  templateUrl: './building-setup.component.html',
  styleUrls: ['./building-setup.component.scss']
})
export class BuildingSetupComponent implements OnInit {
  @Input() action!: 'many' | 'new' | 'existing';

  @Output() completed = new EventEmitter<BuildingSetupResult>();

  @Output() back = new EventEmitter<void>();

  // internal state
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
  ngOnInit() {
    console.log('BuildingSetup action:', this.action);
    console.log('BuildingSetup buildingForm instance:', this.buildingForm);
    console.log('is FormGroup?', this.buildingForm instanceof FormGroup);
  }

  onBuildingCreated(event: { buildingId: number; buildingForm: FormGroup }) {
    const meta = this.toMeta(event.buildingForm);

    this.completed.emit({
      buildingId: event.buildingId,
      buildingMeta: meta
    });
  }

  onBack(): void {
    this.back.emit();
  }

  onCompanyCreated(companyId: number) {
    this.companyId = companyId;
    this.companyCompleted = true;

    // reset building form για να ξεκινήσει “καθαρή” η πρώτη πολυκατοικία
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

  // MANY path: όταν δημιουργηθεί building, προχώρα όπως στο new
  onManyBuildingCreated(event: { buildingId: number; buildingForm: FormGroup }) {
    // εδώ (προαιρετικά) μπορείς να κρατήσεις companyId σε state/localStorage,
    // αλλά για το flow αρκεί να περάσεις στο parent το buildingId/meta:

    const meta = this.toMeta(event.buildingForm);

    this.completed.emit({
      buildingId: event.buildingId,
      buildingMeta: meta
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
