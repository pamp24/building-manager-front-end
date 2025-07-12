// Angular import
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party
import { NarikCustomValidatorsModule } from '@narik/custom-validators';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../theme/shared/service/user.service';
import { BuildingService } from '../../../theme/shared/service/building.service';
import { UserUpdateDTO } from '../../../theme/shared/models/UserUpdateDTO';
import { BuildingDTO } from '../../../theme/shared/models/buildingDTO';
import { AuthenticationService } from '../../../theme/shared/service/authentication.service';

interface FormData {
  roles: string | null;
  basicInfo: Record<string, unknown>;
  roleSpecific: Record<string, unknown>;
}

@Component({
  selector: 'app-forms-validator',
  imports: [CommonModule, SharedModule, NarikCustomValidatorsModule, FormsModule],
  templateUrl: './forms-validator.component.html',
  styleUrls: ['./forms-validator.component.scss']
})
export class FormsValidatorComponent implements OnInit {
  isSubmitted = false;
  userForm: FormGroup;
  currentStep = 1;
  buildingForm: FormGroup;
  selectedAction: 'many' | 'new' | 'existing' | null = null;

  ngOnInit() {
    this.userService.getCurrentUser().subscribe((user) => {
      this.userForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
    });
  }

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private buildingService: BuildingService,
    private authenticationService: AuthenticationService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['  ', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]],
      address1: ['', Validators.required],
      addressNumber1: ['', Validators.required],
      address2: [''],
      addressNumber2: [''],
      country: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      region: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
    });
    
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
      parkingSpacesNum: ['']
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
  }

  countries: string[] = ['Ελλάδα'];
  states: string[] = [
    'Νομός Αιτωλοακαρνανίας',
    'Νομός Λάρισας',
    'Νομός Ιωαννίνων',
    'Νομός Φθιώτιδας',
    'Νομός Αρκαδίας',
    'Νομός Έβρου',
    'Νομός Εύβοιας',
    'Νομός Σερρών',
    'Αττική',
    'Νομός Θεσσαλονίκης',
    'Νομός Λακωνίας',
    'Νομός Κοζάνης',
    'Νομός Δράμας',
    'Νομός Τρικάλων',
    'Νομός Αχαΐας',
    'Νομός Μεσσηνίας',
    'Νομός Βοιωτίας',
    'Νομός Χαλκιδικής',
    'Νομός Δωδεκανήσου',
    'Νομός Ηρακλείου',
    'Νομός Καρδίτσας',
    'Νομός Μαγνησίας',
    'Νομός Ηλείας',
    'Νομός Κυκλάδων',
    'Νομός Ροδόπης',
    'Νομός Κιλκίς',
    'Νομός Πέλλας',
    'Νομός Χανίων',
    'Νομός Γρεβενών',
    'Νομός Κορινθίας',
    'Νομός Αργολίδας',
    'Νομός Λέσβου',
    'Νομός Φωκίδας',
    'Νομός Καβάλας',
    'Νομός Φλώρινας',
    'Νομός Ευρυτανίας',
    'Νομός Λασιθίου',
    'Νομός Ξάνθης',
    'Νομός Καστοριάς',
    'Νομός Ημαθίας',
    'Νομός Άρτας',
    'Νομός Πιερίας',
    'Νομός Θεσπρωτίας',
    'Νομός Ρεθύμνου',
    'Νομός Πρέβεζας',
    'Νομός Χίου',
    'Νομός Κεφαλληνίας',
    'Νομός Σάμου',
    'Νομός Κέρκυρας',
    'Νομός Ζακύνθου',
    'Νομός Λευκάδας'
  ];

  fields = [
    { name: 'firstName', label: 'Όνομα' },
    { name: 'lastName', label: 'Επώνυμο' },
    { name: 'dateOfBirth', label: 'Ημερομηνία Γέννησης', type: 'date' },
    { name: 'phoneNumber', label: 'Τηλέφωνο' },
    { name: 'address1', label: 'Διεύθυνση Κατοικίας 1' },
    { name: 'addressNumber1', label: 'Αριθμός Διεύθυνσης Κατοικίας 1' },
    { name: 'address2', label: 'Διεύθυνση Κατοικίας 2' },
    { name: 'addressNumber2', label: 'Αριθμός Διεύθυνσης Κατοικίας 2' },
    { name: 'country', label: 'Χώρα' },
    { name: 'state', label: 'Νομός' },
    { name: 'city', label: 'Πόλη' },
    { name: 'region', label: 'Περιοχή' },
    { name: 'postalCode', label: 'ΤΚ' }
  ];

  steps = [
    { label: 'Basic Info', value: 1 },
    { label: 'Role', value: 2 },
    { label: 'Role Specific', value: 3 }
  ];

  formData: FormData = {
    roles: null,
    basicInfo: {},
    roleSpecific: {}
  };

  nextStep(): void {
    if (this.currentStep === 2 && this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    if (this.currentStep === 2) {
      this.formData.basicInfo = this.userForm.value;
    }
    this.currentStep++;
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  setAction(action: 'many' | 'new' | 'existing') {
    this.selectedAction = action;
    this.currentStep = 3;
  }

  submitUserForm(): void {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const userUpdateDto = this.userForm.value as UserUpdateDTO;
    this.userService.updateUser(userUpdateDto).subscribe({
      next: () => {
        console.log('Τα στοιχεία ενημερώθηκαν με επιτυχία!');
        this.nextStep();
      },
      error: (error) => {
        console.error('Σφάλμα κατά την ενημέρωση χρήστη:', error);
      }
    });
  }
  
  submitBuildingForm(): void {
  this.isSubmitted = true;

  if (this.buildingForm.invalid) {
    this.buildingForm.markAllAsTouched();
    return;
  }
  const building: BuildingDTO = this.buildingForm.value;
  this.buildingService.createBuilding(building).subscribe({
    next: () => {
      console.log('Building created successfully');

      const currentUserId = this.authenticationService.currentUserValue?.id;
      if (currentUserId) {
        this.userService.assignRole(currentUserId, 'BuildingManager').subscribe({
          next: () => {
            console.log('Ο ρόλος BUILDING_MANAGER προστέθηκε στον χρήστη');
            // Προαιρετικά redirect ή μήνυμα
          },
          error: (err) => {
            console.error('Σφάλμα κατά την ανάθεση ρόλου', err);
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
