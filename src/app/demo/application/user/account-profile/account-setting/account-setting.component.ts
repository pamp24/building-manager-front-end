// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-account-setting',
  imports: [CommonModule, SharedModule],
  templateUrl: './account-setting.component.html',
  styleUrl: './account-setting.component.scss'
})
export class AccountSettingComponent {
  // public props
email_setting = [
    {
      title: 'Ειδοποιήσεις μέσω Email για την έκδοση κοινοχρήστων',
      check: true
    },
    {
      title: 'Ειδοποιήσεις μέσω SMS για την έκδοση κοινοχρήστων',
      check: false
    }
  ];

  notification = [
    {
      title: 'Νέα για προϊόντα και ενημερώσεις του PCT-themes',
      check: true
    },
    {
      title: 'Συμβουλές για καλύτερη χρήση του PCT-themes',
      check: true
    },
    {
      title: 'Όσα χάσατε από την τελευταία σας είσοδο στο PCT-themes',
      check: false
    },
    {
      title: 'Νέα για προϊόντα και άλλες υπηρεσίες',
      check: false
    },
    {
      title: 'Συμβουλές και τεκμηρίωση για επιχειρηματικά προϊόντα',
      check: false
    }
  ];

  active_email = [
    {
      title: 'Νέες ειδοποιήσεις',
      check: true
    },
    {
      title: 'Λάβατε άμεσο μήνυμα',
      check: false
    },
    {
      title: 'Κάποιος σας προσέθεσε σε μια νέα πολυκατοικία',
      check: true
    }
  ];
}
