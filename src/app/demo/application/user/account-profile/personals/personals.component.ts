import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IconService } from '@ant-design/icons-angular';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';
import { TwitterSquareFill, FacebookFill, LinkedinFill } from '@ant-design/icons-angular/icons';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../theme/shared/shared.module';

@Component({
  selector: 'app-personals',
  templateUrl: './personals.component.html',
  styleUrls: ['./personals.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule]
})
export class PersonalsComponent implements OnInit {
  private iconService = inject(IconService);
  form: FormGroup;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private apartmentService: ApartmentService
  ) {
    this.iconService.addIcon(...[TwitterSquareFill, FacebookFill, LinkedinFill]);

    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      isRented: ['', Validators.required],
      tenantFullName: [''],
      apartmentNumber: ['', Validators.required],
      floor: ['', Validators.required],
      sqMetersApart: ['', [Validators.required, Validators.min(1)]],
      hasParking: ['', Validators.required],
      parkingSlot: [''],
      hasStorage: ['', Validators.required],
      storageSlot: [''],
      isManagerHouse: [false],
      commonPercent: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      elevatorPercent: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      heatingPercent: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    this.apartmentService.getMyApartment().subscribe({
      next: (apartment) => {
        this.form.patchValue({
          fullName: apartment.fullName,
          isRented: apartment.isRented ? 'true' : 'false',
          tenantFullName: apartment.tenantFullName,
          apartmentNumber: apartment.number,
          floor: apartment.floor,
          sqMetersApart: apartment.sqMetersApart,
          parkingSlot: apartment.parkingSlot,
          hasParking: apartment.parkingSpace ? 'true' : 'false',
          storageSlot: apartment.storageSlot,
          hasStorage: apartment.apStorageExist ? 'true' : 'false',
          isManagerHouse: apartment.isManagerHouse,
          commonPercent: apartment.commonPercent,
          elevatorPercent: apartment.elevatorPercent,
          heatingPercent: apartment.heatingPercent
        });
        this.form.disable(); // Προεπιλεγμένα μόνο προβολή
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης διαμερίσματος:', err);
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  onUpdate() {
    if (this.form.invalid) return;

    const payload = {
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

   social_media = [
    {
      icon: 'twitter-square',
      background: 'text-twitter',
      style: 'mb-2',
      name: 'Twitter'
    },
    {
      icon: 'facebook',
      background: 'text-facebook',
      style: 'mb-2',
      name: 'Facebook'
    },
    {
      icon: 'linkedin',
      background: 'text-linkedin',
      name: 'Linkedin',
      style: 'mb-2'
    }
  ];
}
