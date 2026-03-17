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

@Component({
  selector: 'app-card-preview',
  imports: [CommonModule, SharedModule, ScrollbarComponent],
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.scss']
})
export class CardPreviewComponent implements OnChanges {
  @Input() apartment!: ApartmentDTO;
  @Input() building!: BuildingDTO;
  private iconService = inject(IconService);

  apartmentFeatures: any[] = [];

  apartmentTripleFeatures: any[] = [];

  constructor() {
    this.iconService.addIcon(...[MoreOutline]);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['apartment'] && this.apartment) {
      setTimeout(() => {
        this.apartmentFeatures = [
          {
            leftLabel: 'Αριθμός',
            leftValue: this.apartment?.number || 'Δεν είναι διαθέσιμο',
            rightLabel: 'Όροφος',
            rightValue: this.apartment?.floor || 'Δεν είναι διαθέσιμο'
          },
          {
            leftLabel: 'Τετραγωνικά',
            leftValue: this.apartment?.sqMetersApart || 'Δεν είναι διαθέσιμο',
            rightLabel: 'Eνοικιασμένο',
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
        ].filter((f) => f.leftValue || f.rightValue);
        this.apartmentTripleFeatures = [
          {
            label1: 'Χιλιοστά Κοινοχρήστων',
            value1: this.apartment?.commonPercent || '—',
            label2: 'Χιλιοστά Ανελκυστήρα',
            value2: this.apartment?.elevatorPercent || '—',
            label3: 'Χιλιοστά Θέρμανσης',
            value3: this.apartment?.heatingPercent || '—'
          }
        ];
      });
    }

    if (changes['building'] && this.building) {
      this.heating = this.buildHeatingItems(this.building);
    }

    if (changes['apartment'] && this.apartment) {
      setTimeout(() => {
        // ... το δικό σου apartmentFeatures / apartmentTripleFeatures
      });
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
}
