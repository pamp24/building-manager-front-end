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

@Component({
  selector: 'app-card-preview',
  imports: [CommonModule, SharedModule, ScrollbarComponent],
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.scss']
})
export class CardPreviewComponent implements OnChanges {
  @Input() apartment!: ApartmentDTO;
  @Input() building!: BuildingDTO;
  private readonly apiBase = 'http://localhost:8080/api/v1';

  private iconService = inject(IconService);

  private readonly modalService = inject(NgbModal);

  public readonly activeModal = inject(NgbActiveModal, {
    optional: true
  });

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

  education = [
    {
      title: 'Χιλιοστά Κοινόχρηστων',
      detail: '2014-2017',
      sub_detail: '-',
      style: 'pt-0'
    },
    {
      title: 'Χιλιοστά Ανελκυστήρα',
      detail: '2011-2013',
      sub_detail: 'Imperial College London'
    },
    {
      title: 'Χιλιοστά Θέρμανσης',
      detail: '2009-2011',
      sub_detail: 'School of London, England',
      style: 'pb-0'
    }
  ];

  private buildHeatingItems(b: BuildingDTO) {
    const typeText = this.translateHeatingType(b.heatingType);

    return [
      {
        title: 'Κεντρική Θέρμανση',
        name: b.hasCentralHeating ? 'Ναι' : 'Όχι',
        sub_title: 'Τύπος Θέρμανσης',
        f_name: typeText,
        style: 'pt-0'
      },
      {
        title: 'Χωρητικότητα Δεξαμενής',
        name: b.heatingCapacityLitres ? `${b.heatingCapacityLitres} λίτρα` : '—',
        sub_title: 'Καύσιμο',
        f_name: typeText
      }
    ];
  }

  heating: { title: string; name: string; sub_title: string; f_name: string; style?: string }[] = [];

  private translateHeatingType(type?: string): string {
    switch (type) {
      case 'OIL':
        return 'Πετρέλαιο';
      case 'NATURAL_GAS':
        return 'Φυσικό Αέριο';
      case 'ELECTRIC':
        return 'Ηλεκτρικό';
      case 'HEAT_PUMP':
        return 'Αντλία Θερμότητας';
      case 'NONE':
        return 'Καθόλου';
      default:
        return 'Δεν έχει οριστεί';
    }
  }

  get ownerInformation() {
    return [
      { label: 'Όνομα', value: this.apartment.ownerFirstName || 'Άγνωστο Όνομα' },
      { label: 'Επίθετο', value: this.apartment.ownerLastName || 'Άγνωστο Επίθετο' },
      { label: 'Email', value: this.apartment.ownerEmail || 'Δεν είναι διαθέσιμο' },
      { label: 'Τηλέφωνο', value: this.apartment.ownerPhone || 'Δεν είναι διαθέσιμο' }
    ];
  }
  get residentInformation() {
    return [
      { label: 'Όνομα', value: this.apartment.residentFirstName || 'Άγνωστο Όνομα' },
      { label: 'Επίθετο', value: this.apartment.residentLastName || 'Άγνωστο Επίθετο' },
      { label: 'Email', value: this.apartment.residentEmail || 'Δεν είναι διαθέσιμο' },
      { label: 'Τηλέφωνο', value: this.apartment.residentPhone || 'Δεν είναι διαθέσιμο' }
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
        leftLabel: 'Αριθμός',
        leftValue: this.apartment?.number || 'Δεν είναι διαθέσιμο',

        rightLabel: 'Όροφος',
        rightValue: this.apartment?.floor || 'Δεν είναι διαθέσιμο'
      },
      {
        leftLabel: 'Τετραγωνικά',
        leftValue: this.apartment?.sqMetersApart ?? 'Δεν είναι διαθέσιμο',

        rightLabel: 'Ενοικιασμένο',
        rightValue: this.apartment?.isRented ? 'Ναι' : 'Όχι'
      },
      {
        leftLabel: 'Parking',
        leftValue: this.apartment?.parkingSpace ? 'Ναι' : 'Όχι',

        rightLabel: 'Θέση Parking',
        rightValue: this.apartment?.parkingSlot || 'Δεν έχει'
      },
      {
        leftLabel: 'Αποθήκη',
        leftValue: this.apartment?.apStorageExist ? 'Ναι' : 'Δεν έχει',

        rightLabel: 'Αριθμός Αποθήκης',
        rightValue: this.apartment?.storageSlot || 'Δεν έχει'
      }
    ];

    this.apartmentTripleFeatures = [
      {
        label1: 'Χιλιοστά Κοινοχρήστων',
        value1: this.apartment?.commonPercent ?? '—',

        label2: 'Χιλιοστά Ανελκυστήρα',
        value2: this.apartment?.elevatorPercent ?? '—',

        label3: 'Χιλιοστά Θέρμανσης',
        value3: this.apartment?.heatingPercent ?? '—'
      }
    ];
  }

  
}
