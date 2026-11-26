import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component } from '@angular/core';
// angular import

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-membership-price',
  imports: [SharedModule],
  templateUrl: './membership-price.component.html',
  styleUrl: './membership-price.component.scss'
})
export class MembershipPriceComponent {
  private readonly uiLocale = inject(UiLocaleService);

  // public method
  priceList = [
    {
      border: 'border-success',
      background: 'bg-success',
      name: this.uiLocale.text('Casual'),
      price: '$50/',
      color: 'text-success',
      includeItem: [
        {
          title: this.uiLocale.text('Full Facility Access')
        },
        {
          title: this.uiLocale.text('Meals plans')
        },
        {
          title: this.uiLocale.text('10% Discounts')
        },
        {
          title: this.uiLocale.text('Cancel anytime')
        }
      ]
    },
    {
      border: 'border-primary',
      background: 'bg-primary',
      name: this.uiLocale.text('Addicted'),
      price: '$150/',
      color: 'text-primary',
      includeItem: [
        {
          title: this.uiLocale.text('Full Facility Access')
        },
        {
          title: this.uiLocale.text('Meals plans')
        },
        {
          title: this.uiLocale.text('50% Discounts')
        },
        {
          title: this.uiLocale.text('Cancel anytime')
        },
        {
          title: this.uiLocale.text('Basic feature')
        }
      ]
    },
    {
      border: 'border-warning',
      background: 'bg-warning',
      name: this.uiLocale.text('Addicted'),
      price: '$200/',
      color: 'text-warning',
      includeItem: [
        {
          title: this.uiLocale.text('Full Facility Access')
        },
        {
          title: this.uiLocale.text('Meals plans')
        },
        {
          title: this.uiLocale.text('Primmum feature')
        },
        {
          title: this.uiLocale.text('75% Discounts')
        },
        {
          title: this.uiLocale.text('Cancel anytime')
        },
        {
          title: this.uiLocale.text('Online booking')
        }
      ]
    }
  ];
}
