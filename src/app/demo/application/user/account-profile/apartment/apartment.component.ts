import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  private readonly uiLocale = inject(UiLocaleService);

  private iconService = inject(IconService);

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
  currentIndex: number | null = 1;

  buildings: any[] = [];
  selectedBuildingIndex = 0;

  filteredApartments: any[] = [];
  currentApartmentIndex = 0;

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
        this.userEmail = this.uiLocale.text('Not available');
        this.userPhone = this.uiLocale.text('Not available');
      }
    });

    // Φόρτωση όλων των διαμερισμάτων
    this.apartmentService.getMyApartments().subscribe({
      next: (apartments) => {
        this.apartments = apartments;

        if (apartments.length === 0) {
          this.message = this.uiLocale.text('There are no apartments listed.');
          return;
        }

        this.buildings = Array.from(
          new Map(
            apartments.map((ap) => [
              ap.buildingId,
              {
                buildingId: ap.buildingId,
                buildingName: ap.buildingName,
                buildingStreet: ap.buildingStreet,
                buildingStreetNumber: ap.buildingStreetNumber,
                buildingCity: ap.buildingCity
              }
            ])
          ).values()
        );

        this.selectedBuildingIndex = 0;
        this.applyBuilding();
      },
      error: () => {
        this.message = this.uiLocale.text('Loading error.');
      }
    });
  }

  // Φόρτωση φόρμας για το τρέχον διαμέρισμα
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
      apDescription: [apartment.apDescription]
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
      this.enableEditableFields();
    } else {
      this.form.disable();
    }
  }

  // Πεδία που επιτρέπεται να αλλάζει το μέλος μόνο του (προσωπικά στοιχεία)
  private editableFields = ['ownerFirstName', 'ownerLastName', 'residentFirstName', 'residentLastName', 'apDescription'];

  private enableEditableFields() {
    this.editableFields.forEach((field) => this.form.get(field)?.enable());
  }

  //Update στοιχείων
  onUpdate() {
    if (this.form.invalid) return;

    const values = this.form.getRawValue();

    const payload = {
      id: this.filteredApartments[this.currentApartmentIndex].id,
      ownerFirstName: values.ownerFirstName,
      ownerLastName: values.ownerLastName,
      residentFirstName: values.residentFirstName,
      residentLastName: values.residentLastName,
      description: values.apDescription
    };

    this.apartmentService.updateMyApartment(payload).subscribe({
      next: () => {
        this.form.disable();
        this.isEditing = false;
        alert(this.uiLocale.text('Details updated successfully.'));
      },
      error: (err) => {
        console.error('Σφάλμα ενημέρωσης:', err);
        alert(this.uiLocale.text('An error occurred while updating.'));
      }
    });
  }

  onApartmentSelect(index: string) {
    const i = Number(index);
    this.currentIndex = i;

    const apartment = this.apartments[i];
    this.loadForm(apartment);
  }

  onBuildingChange(index: number) {
    this.selectedBuildingIndex = index;
    this.applyBuilding();
  }

  applyBuilding() {
    const buildingId = this.buildings[this.selectedBuildingIndex].buildingId;

    this.filteredApartments = this.apartments.filter((a) => a.buildingId === buildingId);

    this.currentApartmentIndex = 0;
    this.loadForm(this.filteredApartments[0]);
  }
}
