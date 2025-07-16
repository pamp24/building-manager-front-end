import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserUpdateDTO } from '../../../../theme/shared/models/UserUpdateDTO';
import { UserService } from 'src/app/theme/shared/service';
import { User } from 'src/app/theme/shared/components/_helpers/user';

interface FormData {
  roles: string | null;
  basicInfo: Record<string, unknown>;
  roleSpecific: Record<string, unknown>;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'] 
})

export class UserFormComponent implements OnInit {
  @Output() formCompleted = new EventEmitter<void>();
  isSubmitted = false;
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['  ', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', [Validators.required]],
      address1: ['', Validators.required],
      addressNumber1: ['', Validators.required],
      address2: [''],
      addressNumber2: [''],
      country: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      region: ['', Validators.required],
      postalCode: ['', [Validators.required]]
    });
  }
  private mapUserToUpdateDTO(user: User): UserUpdateDTO {
    return {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      dateOfBirth: user.dateOfBirth || '',
      phoneNumber: user.phoneNumber || '',
      address1: user.address1 || '',
      addressNumber1: user.addressNumber1 || '',
      address2: user.address2 || '',
      addressNumber2: user.addressNumber2 || '',
      country: user.country || '',
      city: user.city || '',
      state: user.state || '',
      region: user.region || '',
      postalCode: user.postalCode || ''
    };
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      this.userForm.patchValue({
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
    });

    this.userService.getCurrentUser().subscribe((user) => {
      const userDto = this.mapUserToUpdateDTO(user);
      if (this.isUserProfileComplete(userDto)) {
        this.formCompleted.emit();
      } else {
        this.fillFormWithUserData(userDto);
      }
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

  formData: FormData = {
    roles: null,
    basicInfo: {},
    roleSpecific: {}
  };

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
        this.formCompleted.emit();
      },
      error: (error) => {
        console.error('Σφάλμα κατά την ενημέρωση χρήστη:', error);
      }
    });
  }

  private isUserProfileComplete(user: UserUpdateDTO): boolean {
    return (
      !!user.firstName &&
      !!user.lastName &&
      !!user.dateOfBirth &&
      !!user.address1 &&
      !!user.addressNumber1 &&
      !!user.country &&
      !!user.city &&
      !!user.state &&
      !!user.postalCode
    );
  }

  private fillFormWithUserData(user: UserUpdateDTO): void {
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      country: user.country,
      address1: user.address1
    });
  }


}
