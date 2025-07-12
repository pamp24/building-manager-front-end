// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { LineOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-account-password',
  imports: [CommonModule, SharedModule],
  templateUrl: './account-password.component.html',
  styleUrl: './account-password.component.scss'
})
export class AccountPasswordComponent {
  private iconService = inject(IconService);

  // constructor
  constructor() {
    this.iconService.addIcon(...[LineOutline]);
  }
  // public method
  passwords = [
    {
      label: 'Παλίος Κωδικός',
    },
    {
      label: 'Νέος Κωδικός'
    },
    {
      label: 'Επιβεβαίωση Νέου Κωδικού'
    }
  ];

  condition = [
    {
      text: 'Πρέπει να περιέχει τουλάχιστον 8 χαρακτήρες'
    },
    {
      text: 'Τουλάχιστον 1 πεζό γράμμα (a-z)'
    },
    {
      text: 'Τουλάχιστον 1 κεφαλαίο γράμμα (A-Z)'
    },
    {
      text: 'Τουλάχιστον 1 αριθμό (0-9)'
    },
    {
      text: 'Τουλάχιστον 1 ειδικό χαρακτήρα (!@#$%^&*)'
    }
  ];
}
