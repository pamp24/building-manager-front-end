// angular import
import { Component, effect, inject } from '@angular/core';

// bootstrap import
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';

@Component({
  selector: 'app-address-modal',
  imports: [SharedModule],
  templateUrl: './address-modal.component.html',
  styleUrl: './address-modal.component.scss'
})
export class AddressModalComponent {
  activeModal = inject(NgbActiveModal);
  themeService = inject(ThemeService);

  // public props
  isCollapsed = false;
  multiCollapsed = true;
  isRtlMode!: boolean;

  constructor() {
    effect(() => {
      this.isRtlTheme(this.themeService.isRTLMode());
    });
  }

  // public method
  close() {
    this.activeModal.close('Send data');
  }

  private isRtlTheme(isRtl: boolean) {
    this.isRtlMode = isRtl;
  }

  addressList = [
    {
      checked: true,
      name: 'Ian Carpenter',
      address: '1754 Ureate Path, 695 Newga View, Seporcus, Rhode Island, Belgium - SA5 5BO',
      phone: '+91 1234567890'
    },
    {
      checked: false,
      name: 'Ian Carpenter',
      address: '1754 Ureate Path, 695 Newga View, Seporcus, Rhode Island, Belgium - SA5 5BO',
      phone: '+91 1234567890'
    },
    {
      checked: false,
      name: 'Ian Carpenter',
      address: '1754 Ureate Path, 695 Newga View, Seporcus, Rhode Island, Belgium - SA5 5BO',
      phone: '+91 1234567890'
    }
  ];

  inputList = [
    {
      label: 'Όνομα :',
      subTitle: 'Εισάγετε το όνομά σας',
      type: 'text'
    },
    {
      label: 'Επίθετο :',
      subTitle: 'Εισάγετε το επίθετό σας',
      type: 'text'
    },
    {
      label: 'Email :',
      subTitle: 'Εισάγετε το email σας',
      type: 'email'
    },
    {
      label: 'Τηλέφωνο :',
      subTitle: 'Εισάγετε τον αριθμό τηλεφώνου σας',
      type: 'number'
    },
  ];
}
