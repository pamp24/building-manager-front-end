// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { InfoCircleOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-price',
  imports: [CommonModule, SharedModule],
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent {
  private iconService = inject(IconService);
  selectedType: 'individual' | 'company' = 'individual';
  // public props
  isChecked = true;

  // constructor
  constructor() {
    this.iconService.addIcon(...[InfoCircleOutline]);
  }

  // public methods
  individualPlans = [
  {
    price_type: 'Free',
    yearly: 0,
    monthly: 0,
    btn_type: 'btn-outline-primary',
    includeItems: [
      { available: true, title: '1 πολυκατοικία' },
      { available: true, title: 'Έως 5 διαμερίσματα' },
      { available: true, title: 'Βασική έκδοση κοινοχρήστων' },
      { available: true, title: 'Ανακοινώσεις' },
      { available: true, title: 'Βασικές ψηφοφορίες' },
      { available: false, title: 'Reports' },
      { available: false, title: 'Helpdesk' }
    ]
  },
  {
    price_type: 'Professional',
    yearly: 49,
    monthly: 5,
    btn_type: 'btn-outline-primary',
    includeItems: [
      { available: true, title: 'Έως 3 πολυκατοικίες' },
      { available: true, title: 'Έως 50 διαμερίσματα' },
      { available: true, title: 'Πλήρης έκδοση κοινοχρήστων' },
      { available: true, title: 'Ανακοινώσεις & ψηφοφορίες' },
      { available: true, title: 'Προσκλήσεις ενοίκων / ιδιοκτητών' },
      { available: true, title: 'Reports' },
      { available: true, title: 'Βασικό Helpdesk' }
    ]
  },
  {
    price_type: 'Premium',
    yearly: 99,
    monthly: 10,
    btn_type: 'btn-outline-primary',
    includeItems: [
      { available: true, title: 'Έως 10 πολυκατοικίες' },
      { available: true, title: 'Έως 150 διαμερίσματα' },
      { available: true, title: 'Priority Helpdesk' },
      { available: true, title: 'Chat ενοίκων' },
      { available: true, title: 'Advanced reports' },
      { available: true, title: 'Υποστήριξη setup' }
    ]
  }
];

  companyPlans = [
  {
    price_type: 'Basic',
    yearly: 149,
    monthly: 15,
    btn_type: 'btn-outline-primary',
    includeItems: [
      { available: true, title: 'Έως 5 πολυκατοικίες' },
      { available: true, title: 'Έως 100 διαμερίσματα' },
      { available: true, title: 'Dashboard εταιρίας' },
      { available: true, title: 'Κοινόχρηστα' },
      { available: true, title: 'Ανακοινώσεις & ψηφοφορίες' },
      { available: true, title: 'Βασικά reports' },
      { available: false, title: 'Support agents' },
      { available: false, title: 'Advanced Helpdesk' }
    ]
  },
  {
    price_type: 'Professional',
    yearly: 399,
    monthly: 39,
    btn_type: 'btn-primary',
    includeItems: [
      { available: true, title: 'Έως 20 πολυκατοικίες' },
      { available: true, title: 'Έως 500 διαμερίσματα' },
      { available: true, title: 'Dashboard εταιρίας' },
      { available: true, title: 'Agents / υπάλληλοι' },
      { available: true, title: 'Ανάθεση πολυκατοικιών σε agents' },
      { available: true, title: 'Helpdesk tickets' },
      { available: true, title: 'Advanced reports' }
    ]
  },
  {
    price_type: 'Premium',
    yearly: 999,
    monthly: 99,
    btn_type: 'btn-outline-primary',
    includeItems: [
      { available: true, title: 'Απεριόριστες πολυκατοικίες' },
      { available: true, title: 'Απεριόριστα διαμερίσματα' },
      { available: true, title: 'Advanced Helpdesk system' },
      { available: true, title: 'Support agents' },
      { available: true, title: 'Custom onboarding' },
      { available: true, title: 'Priority support' },
      { available: true, title: 'Premium analytics' }
    ]
  }
];
}
