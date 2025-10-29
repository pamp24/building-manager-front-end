import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../../../theme/shared/service/user.service';
import { BuildingService } from '../../../../theme/shared/service/building.service';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { BuildingRequest } from '../../../../theme/shared/models/buildingRequest';
import { Input } from '@angular/core';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';

@Component({
  selector: 'app-building-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './building-form.component.html',
  styleUrl: './building-form.component.scss'
})
export class BuildingFormComponent implements OnInit {
  @Input() selectedAction!: 'many' | 'new' | 'existing';
  @Output() backClicked = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<{ id: number; form: FormGroup }>();

  buildings: BuildingDTO[] = [];
  buildingData?: BuildingDTO;

  currentPage = 1;
  pageSize = 1;
  total = 0;

  buildingForm: FormGroup;
  isSubmitted = false;
  countries = ['Ελλάδα'];
  states = [
    'Νομός Αττικής',
    'Νομός Αιτωλοακαρνανίας',
    'Νομός Αργολίδας',
    'Νομός Αρκαδίας',
    'Νομός Άρτας',
    'Νομός Αχαΐας',
    'Νομός Βοιωτίας',
    'Νομός Γρεβενών',
    'Νομός Δράμας',
    'Νομός Δωδεκανήσου',
    'Νομός Έβρου',
    'Νομός Ευρυτανίας',
    'Νομός Εύβοιας',
    'Νομός Ζακύνθου',
    'Νομός Ηλείας',
    'Νομός Ημαθίας',
    'Νομός Ηρακλείου',
    'Νομός Θεσπρωτίας',
    'Νομός Θεσσαλονίκης',
    'Νομός Ιωαννίνων',
    'Νομός Καβάλας',
    'Νομός Καρδίτσας',
    'Νομός Καστοριάς',
    'Νομός Κέρκυρας',
    'Νομός Κεφαλληνίας',
    'Νομός Κιλκίς',
    'Νομός Κοζάνης',
    'Νομός Κορινθίας',
    'Νομός Κυκλάδων',
    'Νομός Λακωνίας',
    'Νομός Λάρισας',
    'Νομός Λασιθίου',
    'Νομός Λέσβου',
    'Νομός Λευκάδας',
    'Νομός Μαγνησίας',
    'Νομός Μεσσηνίας',
    'Νομός Ξάνθης',
    'Νομός Πέλλας',
    'Νομός Πιερίας',
    'Νομός Πρέβεζας',
    'Νομός Ρεθύμνης',
    'Νομός Ροδόπης',
    'Νομός Σάμου',
    'Νομός Σερρών',
    'Νομός Τρικάλων',
    'Νομός Φθιώτιδας',
    'Νομός Φλώρινας',
    'Νομός Φωκίδας',
    'Νομός Χαλκιδικής',
    'Νομός Χανίων',
    'Νομός Χίου'
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private buildingService: BuildingService,
    private authenticationService: AuthenticationService
  ) {
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
      floors: ['', Validators.required],
      apartmentsNum: ['', [Validators.required, Validators.min(1)]],
      sqMetersTotal: ['', Validators.required],
      sqMetersCommonSpaces: ['', Validators.required],
      parkingExist: [false],
      parkingSpacesNum: [''],
      description: [''],
      undergroundFloorExist: [false],
      halfFloorExist: [false],
      overTopFloorExist: [false],
      managerHouseExist: [false],
      storageExist: [false],
      storageNum: [''],
      hasCentralHeating: [false],
      heatingType: [''],
      heatingCapacityLitres: ['']
    });
    this.buildingForm.get('parkingExist')?.valueChanges.subscribe((checked: boolean) => {
      const parkingSpacesNumCtrl = this.buildingForm.get('parkingSpacesNum');
      if (checked) {
        parkingSpacesNumCtrl?.setValidators([Validators.required, Validators.min(1)]);
        parkingSpacesNumCtrl?.enable();
      } else {
        parkingSpacesNumCtrl?.clearValidators();
        parkingSpacesNumCtrl?.setValue('');
        parkingSpacesNumCtrl?.disable();
      }
      parkingSpacesNumCtrl?.updateValueAndValidity();
    });

    this.buildingForm.get('storageExist')?.valueChanges.subscribe((checked: boolean) => {
      const storageNumCtrl = this.buildingForm.get('storageNum');
      if (checked) {
        storageNumCtrl?.setValidators([Validators.required, Validators.min(1)]);
        storageNumCtrl?.enable();
      } else {
        storageNumCtrl?.clearValidators();
        storageNumCtrl?.setValue('');
        storageNumCtrl?.disable();
      }
      storageNumCtrl?.updateValueAndValidity();
    });

    this.buildingForm.get('hasCentralHeating')?.valueChanges.subscribe((checked: boolean) => {
      const heatingTypeCtrl = this.buildingForm.get('heatingType');
      const heatingLitresCtrl = this.buildingForm.get('heatingCapacityLitres');
      if (checked) {
        heatingTypeCtrl?.setValidators([Validators.required]);
        heatingLitresCtrl?.setValidators([Validators.required, Validators.min(1)]);
        heatingTypeCtrl?.enable();
        heatingLitresCtrl?.enable();
      } else {
        heatingTypeCtrl?.clearValidators();
        heatingLitresCtrl?.clearValidators();
        heatingTypeCtrl?.setValue('');
        heatingLitresCtrl?.setValue('');
        heatingTypeCtrl?.disable();
        heatingLitresCtrl?.disable();
      }
      heatingTypeCtrl?.updateValueAndValidity();
      heatingLitresCtrl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.buildingForm = this.fb.group({
      name: [''],
      street1: [''],
      stNumber1: [''],
      street2: [''],
      stNumber2: [''],
      city: [''],
      region: [''],
      postalCode: [''],
      country: [''],
      state: [''],
      floors: [''],
      apartmentsNum: [''],
      sqMetersTotal: [''],
      sqMetersCommonSpaces: [''],
      parkingExist: [''],
      parkingSpacesNum: [''],
      buildingDescription: [''],
      managerHouseExist: [''],
      undergroundFloorExist: [''],
      halfFloorExist: [''],
      overTopFloorExist: [''],
      storageExist: [''],
      storageNum: [''],
      hasCentralHeating: [''],
      heatingType: [''],
      heatingCapacityLitres: ['']
    });

    this.buildingService.getMyBuildings().subscribe({
      next: (buildings) => {
        this.buildings = buildings;
        this.total = buildings.length;
        if (buildings.length > 0) {
          this.loadBuilding(buildings[0]);
        }
      }
    });
  }

  onBack(): void {
    this.backClicked.emit();
  }

  submitBuildingForm(): void {
    this.isSubmitted = true;
    if (this.buildingForm.invalid) {
      this.buildingForm.markAllAsTouched();
      return;
    }
    const formValue = this.buildingForm.value;
    const currentUserId = this.authenticationService.currentUserValue?.id;

    if (!currentUserId) {
      console.error('Δεν βρέθηκε ID χρήστη.');
      return;
    }
    const building: BuildingRequest = {
      name: formValue.name,
      street1: formValue.street1,
      stNumber1: formValue.stNumber1,
      street2: formValue.street2,
      stNumber2: formValue.stNumber2,
      country: formValue.country,
      state: formValue.state,
      city: formValue.city,
      region: formValue.region,
      postalCode: formValue.postalCode,
      floors: formValue.floors.toString(),
      apartmentsNum: Number(formValue.apartmentsNum),
      sqMetersTotal: formValue.sqMetersTotal,
      sqMetersCommonSpaces: formValue.sqMetersCommonSpaces,
      parkingExist: formValue.parkingExist,
      parkingSpacesNum: formValue.parkingExist ? Number(formValue.parkingSpacesNum) : 0,
      buildingDescription: formValue.description,
      managerId: currentUserId,
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
      enable: true
    };
    this.buildingService.createBuilding(building).subscribe({
      next: (buildingId: number) => {
        console.log('Η πολυκατοικία δημιουργήθηκε με επιτυχία', buildingId);
        localStorage.setItem('buildingId', buildingId.toString());
        localStorage.setItem('storageNum', building.storageNum.toString());
        localStorage.setItem('managerHouseExist', building.managerHouseExist ? 'true' : 'false');
        const currentUserId = this.authenticationService.currentUserValue?.id;
        if (currentUserId) {
          this.userService.assignRole(currentUserId, 'BuildingManager').subscribe({
            next: () => {
              console.log('Ο ρόλος BuildingManager δόθηκε');
              this.formSubmitted.emit({ id: buildingId, form: this.buildingForm });
            },
            error: (err) => {
              console.warn('Ο χρήστης έχει ήδη τον ρόλο BuildingManager ή υπήρξε άλλο σφάλμα:', err);
              this.formSubmitted.emit({ id: buildingId, form: this.buildingForm });
            }
          });
        }
      },
      error: (err) => {
        console.error('Σφάλμα δημιουργίας κτιρίου', err);
      }
    });
  }
  get managerHouseExistSelected(): boolean {
    return this.buildingForm?.get('managerHouseExist')?.value;
  }

  loadBuilding(building: BuildingDTO) {
    this.buildingData = building;
    this.buildingForm.patchValue(building);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const building = this.buildings[page - 1];
    this.loadBuilding(building);
  }
}
