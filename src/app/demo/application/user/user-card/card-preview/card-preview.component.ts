import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
/* eslint-disable @typescript-eslint/no-explicit-any */
// angular import
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ScrollbarComponent } from 'src/app/theme/shared/components/scrollbar/scrollbar.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import { MoreOutline } from '@ant-design/icons-angular/icons';
import { ApartmentDTO } from 'src/app/theme/shared/models/apartmentDTO';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EditApartmentComponent } from '../edit-apartment/edit-apartment.component';

import { DeleteApartmentComponent } from '../delete-apartment/delete-apartment.component';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';

@Component({
  selector: 'app-card-preview',
  imports: [CommonModule, SharedModule, ScrollbarComponent],
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.scss']
})
export class CardPreviewComponent implements OnChanges {
  private readonly uiLocale = inject(UiLocaleService);

  @Input() apartment!: ApartmentDTO;
  @Input() building!: BuildingDTO;
  private readonly apiBase = `${environment.apiUrl}/api/v1`;

  private iconService = inject(IconService);

  private readonly modalService = inject(NgbModal);

  public readonly activeModal = inject(NgbActiveModal, {
    optional: true
  });

  private readonly authenticationService = inject(AuthenticationService);

  apartmentFeatures: any[] = [];
  apartmentTripleFeatures: any[] = [];

  constructor() {
    this.iconService.addIcon(...[MoreOutline]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['apartment'] && this.apartment) {
      this.refreshApartmentView();
    }

    if (changes['building'] && this.building) {
      this.heating = this.buildHeatingItems(this.building);
    }
  }

  private buildHeatingItems(b: BuildingDTO) {
    const typeText = this.translateHeatingType(b.heatingType);

    return [
      {
        title: this.uiLocale.text('Central Heating'),
        name: b.hasCentralHeating ? this.uiLocale.text('Yes') : this.uiLocale.text('Nope'),
        sub_title: this.uiLocale.text('Heating Type'),
        f_name: typeText,
        style: 'pt-0'
      },
      {
        title: this.uiLocale.text('Tank Capacity'),
        name: b.heatingCapacityLitres ? this.uiLocale.text('{{p0}} liters', { p0: b.heatingCapacityLitres }) : '—',
        sub_title: this.uiLocale.text('Fuel'),
        f_name: typeText
      }
    ];
  }

  heating: { title: string; name: string; sub_title: string; f_name: string; style?: string }[] = [];

  private translateHeatingType(type?: string): string {
    switch (type) {
      case 'OIL':
        return this.uiLocale.text('Oil');
      case 'NATURAL_GAS':
        return this.uiLocale.text('Natural Gas');
      case 'ELECTRIC':
        return this.uiLocale.text('Electric');
      case 'HEAT_PUMP':
        return this.uiLocale.text('Heat Pump');
      case 'NONE':
        return this.uiLocale.text('Not at all');
      default:
        return this.uiLocale.text('Not defined');
    }
  }

  get ownerInformation() {
    return [
      { label: this.uiLocale.text('Name'), value: this.apartment.ownerFirstName || this.uiLocale.text('Unknown Name') },
      { label: this.uiLocale.text('Adjective'), value: this.apartment.ownerLastName || this.uiLocale.text('Unknown Surname') },
      { label: this.uiLocale.text('Email'), value: this.apartment.ownerEmail || this.uiLocale.text('Not available') },
      { label: this.uiLocale.text('Telephone'), value: this.apartment.ownerPhone || this.uiLocale.text('Not available') }
    ];
  }
  get residentInformation() {
    return [
      {
        label: this.uiLocale.text('Name'),
        value: this.apartment.residentFirstName || this.uiLocale.text('Unknown Name')
      },
      {
        label: this.uiLocale.text('Adjective'),
        value: this.apartment.residentLastName || this.uiLocale.text('Unknown Surname')
      },
      { label: this.uiLocale.text('Email'), value: this.apartment.residentEmail || this.uiLocale.text('Not available') },
      { label: this.uiLocale.text('Telephone'), value: this.apartment.residentPhone || this.uiLocale.text('Not available') }
    ];
  }

  imgSrc(url?: string | null): string {
    const fallbackImage = 'assets/images/user/avatar-5.jpg';

    if (!url || url.trim() === '') {
      return fallbackImage;
    }

    const cleanUrl = url.trim().replace(/\\/g, '/');

    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) {
      return cleanUrl;
    }

    if (cleanUrl.startsWith('/uploads/')) {
      return `${this.apiBase}${cleanUrl}`;
    }

    if (cleanUrl.startsWith('uploads/')) {
      return `${this.apiBase}/${cleanUrl}`;
    }

    return cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
  }

  get canManageApartment(): boolean {
    const role = this.authenticationService.currentUserValue?.role ?? '';

    return ['Admin', 'BuildingManager', 'PropertyManager'].includes(role);
  }

  openEdit(): void {
    if (!this.apartment?.id) {
      console.error('Δεν υπάρχει έγκυρο διαμέρισμα για επεξεργασία:', this.apartment);
      return;
    }

    const modalRef = this.modalService.open(EditApartmentComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.apartment = {
      ...this.apartment
    };

    modalRef.result.then(
      (result) => {
        if (!result?.updated) {
          return;
        }

        if (result.apartment) {
          this.apartment = {
            ...this.apartment,
            ...result.apartment
          };

          this.refreshApartmentView();
        }

        this.activeModal?.close({
          updated: true,
          apartment: result.apartment
        });
      },
      () => {
        // Το edit modal έκλεισε χωρίς αποθήκευση.
      }
    );
  }

  openDelete(): void {
    if (!this.apartment?.id) {
      console.error('Δεν υπάρχει έγκυρο διαμέρισμα για διαγραφή:', this.apartment);
      return;
    }

    const modalRef = this.modalService.open(DeleteApartmentComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.apartment = this.apartment;

    modalRef.result.then(
      (result) => {
        if (!result?.deleted) {
          return;
        }

        this.activeModal?.close({
          deleted: true,
          apartmentId: this.apartment.id
        });
      },
      () => {
        // Το delete modal έκλεισε χωρίς διαγραφή.
      }
    );
  }

  private refreshApartmentView(): void {
    this.apartmentFeatures = [
      {
        leftLabel: this.uiLocale.text('Number'),
        leftValue: this.apartment?.number || this.uiLocale.text('Not available'),

        rightLabel: this.uiLocale.text('Floor'),
        rightValue: this.apartment?.floor || this.uiLocale.text('Not available')
      },
      {
        leftLabel: this.uiLocale.text('Square'),
        leftValue: this.apartment?.sqMetersApart ?? this.uiLocale.text('Not available'),

        rightLabel: this.uiLocale.text('Rented'),
        rightValue: this.apartment?.isRented ? this.uiLocale.text('Yes') : this.uiLocale.text('Nope')
      },
      {
        leftLabel: 'Parking',
        leftValue: this.apartment?.parkingSpace ? this.uiLocale.text('Yes') : this.uiLocale.text('Nope'),

        rightLabel: this.uiLocale.text('Parking Spot'),
        rightValue: this.apartment?.parkingSlot || this.uiLocale.text("It doesn't")
      },
      {
        leftLabel: this.uiLocale.text('Warehouse'),
        leftValue: this.apartment?.apStorageExist ? this.uiLocale.text('Yes') : this.uiLocale.text("It doesn't"),

        rightLabel: this.uiLocale.text('Warehouse Number'),
        rightValue: this.apartment?.storageSlot || this.uiLocale.text("It doesn't")
      }
    ];

    this.apartmentTripleFeatures = [
      {
        label1: this.uiLocale.text('Thousands of Users'),
        value1: this.apartment?.commonPercent ?? '—',

        label2: this.uiLocale.text('Elevator millimeters'),
        value2: this.apartment?.elevatorPercent ?? '—',

        label3: this.uiLocale.text('Kilometers of Heating'),
        value3: this.apartment?.heatingPercent ?? '—'
      }
    ];
  }
}
