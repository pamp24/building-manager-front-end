import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IconService } from '@ant-design/icons-angular';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';
import { TwitterSquareFill, FacebookFill, LinkedinFill } from '@ant-design/icons-angular/icons';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../theme/shared/shared.module';
import { UserService } from 'src/app/theme/shared/service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule, NgbPaginationModule]
})
export class ApartmentComponent implements OnInit {
  private iconService = inject(IconService);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apartments: any[] = []; // όλα τα διαμερίσματα του χρήστη
  currentPage = 1; // τρέχουσα σελίδα
  pageSize = 1; // 1 διαμέρισμα ανά σελίδα
  total = 0; // πόσα διαμερίσματα συνολικά

  form!: FormGroup;
  isEditing = false;

  userEmail = '';
  userPhone = '';
  tenantEmail = '';
  tenantPhone = '';
  buildingName = '';
  buildingAddress1 = '';
  message = '';
  constructor(
    private fb: FormBuilder,
    private apartmentService: ApartmentService,
    private userService: UserService
  ) {
    this.iconService.addIcon(...[TwitterSquareFill, FacebookFill, LinkedinFill]);
  }

  ngOnInit(): void {
    // Φόρτωση στοιχείων χρήστη
    this.userService.getCurrentUser().subscribe({
      next: (usr) => {
        this.userEmail = usr.email ?? '';
        this.userPhone = usr.phoneNumber ?? '';
      },
      error: () => {
        this.userEmail = 'Δεν είναι διαθέσιμο';
        this.userPhone = 'Δεν είναι διαθέσιμο';
      }
    });

    // Φόρτωση όλων των διαμερισμάτων
this.apartmentService.getMyApartments().subscribe({
  next: (apartments) => {
    this.apartments = apartments;
    this.total = apartments.length;

    if (apartments.length > 0) {
      this.loadForm(apartments[0]); // ξεκινάμε με το πρώτο
    } else {
      this.message = 'Δεν υπάρχουν καταχωρημένα διαμερίσματα.';
    }
  },
  error: (err) => {
    if (err.status === 404) {
      this.message = 'Δεν υπάρχουν καταχωρημένα διαμερίσματα.';
    } else {
      this.message = 'Παρουσιάστηκε σφάλμα κατά τη φόρτωση.';
    }
    console.error('Σφάλμα φόρτωσης διαμερισμάτων:', err);
  }
});

  }

  // Φόρτωση φόρμας για το τρέχον διαμέρισμα
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadForm(apartment: any) {
    this.form = this.fb.group({
      ownerFirstName: [apartment.ownerFirstName, [Validators.required, Validators.minLength(3)]],
      ownerLastName: [apartment.ownerLastName, [Validators.required, Validators.minLength(3)]],
      isRented: [apartment.isRented ? 'true' : 'false', Validators.required],
      residentFirstName: [apartment.residentFirstName],
      residentLastName: [apartment.residentLastName],
      apartmentNumber: [apartment.number, Validators.required],
      floor: [apartment.floor, Validators.required],
      sqMetersApart: [apartment.sqMetersApart, [Validators.required, Validators.min(1)]],
      hasParking: [apartment.parkingSpace ? 'true' : 'false', Validators.required],
      parkingSlot: [apartment.parkingSlot],
      hasStorage: [apartment.apStorageExist ? 'true' : 'false', Validators.required],
      storageSlot: [apartment.storageSlot],
      isManagerHouse: [apartment.isManagerHouse],
      commonPercent: [apartment.commonPercent, [Validators.required, Validators.min(0), Validators.max(100)]],
      elevatorPercent: [apartment.elevatorPercent, [Validators.required, Validators.min(0), Validators.max(100)]],
      heatingPercent: [apartment.heatingPercent, [Validators.required, Validators.min(0), Validators.max(100)]],
      apDescription: [apartment.apDescription],
    });
    this.buildingName = apartment.buildingName ?? '';
    this.buildingAddress1 = apartment.buildingAddress1 ?? '';

    this.tenantEmail = apartment.residentEmail ?? '';
    this.tenantPhone = apartment.residentPhone ?? '';

    this.form.disable(); // default προβολή
  }

  //Αλλαγή σελίδας (διαμερίσματος)
  onPageChange(page: number) {
    this.currentPage = page;
    const apartment = this.apartments[page - 1]; // index από 0
    this.loadForm(apartment);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  //Update στοιχείων
  onUpdate() {
    if (this.form.invalid) return;

    const payload = {
      id: this.apartments[this.currentPage - 1].id,
      ...this.form.value,
      isRented: this.form.value.isRented === 'true',
      hasParking: this.form.value.hasParking === 'true',
      hasStorage: this.form.value.hasStorage === 'true'
    };

    this.apartmentService.updateMyApartment(payload).subscribe({
      next: () => {
        this.form.disable();
        this.isEditing = false;
        alert('Τα στοιχεία ενημερώθηκαν με επιτυχία.');
      },
      error: (err) => {
        console.error('Σφάλμα ενημέρωσης:', err);
        alert('Παρουσιάστηκε σφάλμα κατά την ενημέρωση.');
      }
    });
  }
}
