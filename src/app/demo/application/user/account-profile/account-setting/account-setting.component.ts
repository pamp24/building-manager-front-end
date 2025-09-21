// angular import
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account-setting',
  imports: [CommonModule, SharedModule,FormsModule],
  templateUrl: './account-setting.component.html',
  styleUrl: './account-setting.component.scss'
})
export class AccountSettingComponent {
  apartments = [1];

  // public props
  email_setting = [
    {
      title: 'Ειδοποιήση για την έκδοση κοινοχρήστων',
      check: true
    },
    {
      title: 'Ειδοποιήση για νέα ψηφοφορία στην πολυκατοικία',
      check: false
    },
    {
      title: 'Ειδοποιήση για νέα ανακοίνωση στην πολυκατοικία',
      check: false
    }
  ];

  notification = [
    {
      title: 'Ειδοποιήση αιτήματος για είσοδο νέου μέλους στην πολυκατοικία',
      check: true
    },
    {
      title: 'Ειδοποιήση για έξοδο μέλους από την πολυκατοικία',
      check: true
    },
    {
      title: 'Ειδοποιήση για πλρωμή κοινωχρήστων από μέλος της πολυκατοικίας',
      check: false
    },
    {
      title: 'Ειδοποιήση για νέα ψηφοφορία στην πολυκατοικία',
      check: false
    },
    {
      title: 'Ειδοποιήση για νέα ανακοίνωση στην πολυκατοικία',
      check: false
    }
  ];

  active_email = [
    {
      title: 'Όταν κάποιος κάνει αλλαγές στο διαμέρισμά του',
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
