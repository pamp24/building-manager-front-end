import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
// angular import
import { AsyncPipe, DecimalPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

// rxjs library
import { Observable } from 'rxjs';

// bootstrap import
import { NgbModal, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

// project import
import { customer } from './customer-data.config/customer';
import { CustomerDataService } from './customer-data.config/customer-data.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import {
  CloseOutline,
  DeleteOutline,
  DownloadOutline,
  EditOutline,
  EnvironmentOutline,
  EyeOutline,
  LinkOutline,
  MailOutline,
  PhoneOutline,
  PlusOutline
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-customer-list',
  imports: [FormsModule, AsyncPipe, NgbTypeaheadModule, NgbPaginationModule, CommonModule, NgbTooltipModule, SharedModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  providers: [CustomerDataService, DecimalPipe]
})
export class CustomerListComponent {
  private readonly uiLocale = inject(UiLocaleService);

  service = inject(CustomerDataService);
  private modalService = inject(NgbModal);
  private iconService = inject(IconService);

  // public props
  customer$: Observable<customer[]>;
  total$: Observable<number>;

  closeResult!: string;

  // constructor
  constructor() {
    const service = this.service;

    this.customer$ = service.customer$;
    this.total$ = service.total$;
    this.iconService.addIcon(
      ...[
        EyeOutline,
        EditOutline,
        DeleteOutline,
        CloseOutline,
        LinkOutline,
        MailOutline,
        PhoneOutline,
        EnvironmentOutline,
        PlusOutline,
        DownloadOutline
      ]
    );
  }

  // public method
  openLg(content: ElementRef) {
    this.modalService.open(content, { size: 'lg', scrollable: true });
  }

  openCustomer(details: ElementRef) {
    this.modalService.open(details, { size: 'lg', scrollable: true });
  }

  user = {
    name: this.uiLocale.text('Aaron Poole'),
    avatar: 'assets/images/user/avatar-5.jpg',
    jobTitle: 'Manufacturing Director',
    info: [
      { label: this.uiLocale.text('Age'), value: '45' },
      { label: this.uiLocale.text('Progress'), value: '86%', style: 'border border-top-0 border-bottom-0' },
      { label: this.uiLocale.text('Visits'), value: '7634' }
    ],
    contacts: [
      { iconClass: 'mail', value: 'bo@gmail.com' },
      { iconClass: 'phone', value: '+1 (247) 849-6968' },
      { iconClass: 'environment', value: 'Lesotho' }
    ],
    website: 'https://anshan.dh.url'
  };

  userInformation = [
    {
      fields: [
        { label: this.uiLocale.text('Full Name'), value: 'Aaron Poole' },
        { label: this.uiLocale.text('Father Name'), value: 'Mr. Ralph Sabatini' }
      ]
    },
    {
      fields: [
        { label: this.uiLocale.text('Country'), value: 'Lesotho' },
        { label: this.uiLocale.text('Zip Code'), value: '247 849' }
      ]
    }
  ];
}
