import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { inject, Component, OnInit } from '@angular/core';
// angular import

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-setting-pricing',
  imports: [SharedModule],
  templateUrl: './setting-pricing.component.html',
  styleUrl: './setting-pricing.component.scss'
})
export class SettingPricingComponent implements OnInit {
  private readonly uiLocale = inject(UiLocaleService);

  // public props
  activeButton!: string;

  // life cycle
  ngOnInit(): void {
    this.activeButton = 'Monthly';
  }

  // public methods
  setActiveButton(button: string): void {
    this.activeButton = button;
  }

  prices = [
    {
      type: 'basic',
      title: this.uiLocale.text('Basic'),
      service: '03',
      yearly: 269,
      monthly: 69,
      includeItems: [
        {
          available: true,
          title: this.uiLocale.text('One End Product')
        },
        {
          available: true,
          title: this.uiLocale.text('No attribution required')
        },
        {
          available: true,
          title: this.uiLocale.text('TypeScript')
        },
        {
          available: false,
          title: this.uiLocale.text('Figma Design Resources')
        },
        {
          available: false,
          title: this.uiLocale.text('Create Multiple Products')
        },
        {
          available: false,
          title: this.uiLocale.text('Create a SaaS Project')
        },
        {
          available: false,
          title: this.uiLocale.text('Resale Product')
        },
        {
          available: false,
          title: this.uiLocale.text('Separate sale of our UI Elements?')
        }
      ]
    },
    {
      type: 'popular',
      title: this.uiLocale.text('Basic'),
      service: '05',
      yearly: 529,
      monthly: 129,
      includeItems: [
        {
          available: true,
          title: this.uiLocale.text('One End Product')
        },
        {
          available: true,
          title: this.uiLocale.text('No attribution required')
        },
        {
          available: true,
          title: this.uiLocale.text('TypeScript')
        },
        {
          available: true,
          title: this.uiLocale.text('Figma Design Resources')
        },
        {
          available: true,
          title: this.uiLocale.text('Create Multiple Products')
        },
        {
          available: false,
          title: this.uiLocale.text('Create a SaaS Project')
        },
        {
          available: false,
          title: this.uiLocale.text('Resale Product')
        },
        {
          available: false,
          title: this.uiLocale.text('Separate sale of our UI Elements?')
        }
      ]
    },
    {
      type: 'Basic',
      title: this.uiLocale.text('Premium'),
      service: '08',
      yearly: 1299,
      monthly: 599,
      includeItems: [
        {
          available: true,
          title: this.uiLocale.text('One End Product')
        },
        {
          available: true,
          title: this.uiLocale.text('No attribution required')
        },
        {
          available: true,
          title: this.uiLocale.text('TypeScript')
        },
        {
          available: true,
          title: this.uiLocale.text('Figma Design Resources')
        },
        {
          available: true,
          title: this.uiLocale.text('Create Multiple Products')
        },
        {
          available: true,
          title: this.uiLocale.text('Create a SaaS Project')
        },
        {
          available: true,
          title: this.uiLocale.text('Resale Product')
        },
        {
          available: true,
          title: this.uiLocale.text('Separate sale of our UI Elements?')
        }
      ]
    }
  ];
}
