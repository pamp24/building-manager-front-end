import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../../../theme/shared/service/user.service';
import { BuildingService } from '../../../../theme/shared/service/building.service';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { BuildingRequest } from '../../../../theme/shared/models/buildingRequest';
import { Input } from '@angular/core';

@Component({
  selector: 'app-building-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './building-form.component.html',
  styleUrl: './building-form.component.scss'
})
export class BuildingFormComponent {
  @Input() selectedAction!: 'many' | 'new' | 'existing';
  @Output() backClicked = new EventEmitter<void>();
  @Output() formSubmitted = new EventEmitter<number>();

  buildingForm: FormGroup;
  isSubmitted = false;
  countries = ['Ελλάδα'];
  states = [
    'Αττική',
    'Θεσσαλονίκη',
    'Αχαΐα',
    'Λάρισα',
    'Ηράκλειο',
    'Μαγνησία',
    'Έβρος',
    'Ιωάννινα',
    'Καβάλα',
    'Χανιά',
    'Κοζάνη',
    'Δράμα',
    'Ροδόπη',
    'Πιερία',
    'Κέρκυρα',
    'Αιτωλοακαρνανία',
    'Βοιωτία',
    'Λέσβος',
    'Ηλεία',
    'Σέρρες',
    'Τρίκαλα',
    'Καρδίτσα',
    'Καστοριά',
    'Φθιώτιδα',
    'Φλώρινα',
    'Αργολίδα',
    'Αρκαδία',
    'Λακωνία',
    'Μεσσηνία',
    'Κορινθία',
    'Χίος',
    'Σάμος',
    'Κυκλάδες',
    'Δωδεκάνησα',
    'Λευκάδα',
    'Ζάκυνθος',
    'Κεφαλονιά',
    'Γρεβενά',
    'Πρέβεζα',
    'Άρτα',
    'Ρέθυμνο',
    'Λασίθι',
    'Βοιωτία',
    'Εύβοια',
    'Φωκίδα',
    'Ευρυτανία',
    'Θεσπρωτία',
    'Ξάνθη'
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
      parkingExists: [false],
      parkingSpacesNum: [''],
      description: [''],
      undergroundFloorExists: [false],
      halfFloorExists: [false],
      overTopFloorExists: [false],
      managerHouseExists: [false],
      storageExists: [false],
      storageNum: [''],   
    });
    this.buildingForm.get('parkingExists')?.valueChanges.subscribe((checked: boolean) => {
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
    
    this.buildingForm.get('storageExists')?.valueChanges.subscribe((checked: boolean) => {
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
      parkingExists: formValue.parkingExists,
      parkingSpacesNum: formValue.parkingExists ? Number(formValue.parkingSpacesNum) : 0,
      buildingDescription: formValue.description,
      managerId: currentUserId,
      active: true,
      enable: true
    };
    this.buildingService.createBuilding(building).subscribe({
      next: (buildingId: number) => {
        console.log('Η πολυκατοικία δημιουργήθηκε με επιτυχία', buildingId);
        localStorage.setItem('buildingId', buildingId.toString());
        const currentUserId = this.authenticationService.currentUserValue?.id;
        if (currentUserId) {
          this.userService.assignRole(currentUserId, 'BuildingManager').subscribe({
            next: () => {
              console.log('Ο ρόλος BuildingManager δόθηκε');
              this.formSubmitted.emit(buildingId);
            },
            error: (err) => {
              console.warn('Ο χρήστης έχει ήδη τον ρόλο BuildingManager ή υπήρξε άλλο σφάλμα:', err);
              this.formSubmitted.emit(buildingId);
            }
          });
        }
      },
      error: (err) => {
        console.error('Σφάλμα δημιουργίας κτιρίου', err);
      }
    });
  }
}
