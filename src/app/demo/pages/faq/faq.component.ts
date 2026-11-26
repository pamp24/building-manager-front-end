import { TranslateModule } from '@ngx-translate/core';
import { UiLocaleService } from 'src/app/theme/shared/service/ui-locale.service';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PublicFooterComponent } from '../public-info/public-footer.component';
import { PublicHeaderComponent } from '../public-info/public-header.component';

interface PricingCatalog {
  currency: string;
  annualDiscountBasisPoints: number;
  plans: { id: string; monthlyBaseCents: number | null; extraApartmentMonthlyCents: number | null; includedApartments: number | null }[];
}

@Component({
  selector: 'app-faq',
  imports: [TranslateModule, RouterLink, PublicFooterComponent, PublicHeaderComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {
  private readonly uiLocale = inject(UiLocaleService);

  private http = inject(HttpClient);
  catalog: PricingCatalog | null = null;

  readonly categories = [
    {
      title: this.uiLocale.text('In general'),
      questions: [
        {
          q: this.uiLocale.text('What is Oikio?'),
          a: this.uiLocale.text('Oikio is a platform for organizing information, tasks, and communication for apartment buildings.')
        },
        {
          q: this.uiLocale.text('Who can use the platform?'),
          a: this.uiLocale.text(
            'It is aimed at managers, owners, tenants, and management companies. The actions each user sees depend on their role and participation in the apartment building.'
          )
        },
        {
          q: this.uiLocale.text('How do I get started?'),
          a: this.uiLocale.text(
            'Create an account or log in. Access to an apartment building depends on your role and the relevant invitation or connection to it.'
          )
        },
        {
          q: this.uiLocale.text('Do I need to log in to read the frequently asked questions?'),
          a: this.uiLocale.text('No. The page is public and available both before and after logging in.')
        }
      ]
    },
    {
      title: this.uiLocale.text('Subscriptions and Pricing'),
      questions: [
        {
          q: this.uiLocale.text('Can I purchase or activate a subscription now?'),
          a: this.uiLocale.text(
            'Not yet. Completing subscription purchases and enforcing limits or allowances per package are not available. Commercial packages and their benefits constitute a proposed description, not an operational commitment.'
          )
        },
        {
          q: this.uiLocale.text('Is there an annual discount?'),
          a: this.uiLocale.text(
            'The annual discount is a proposed commercial term, not an active charge. The rate is determined by the pricing configuration and is subject to change.'
          )
        },
        {
          q: this.uiLocale.text('What about the Plus package?'),
          a: this.uiLocale.text(
            'The suggested Plus price and charging for additional apartments come from the backend configuration. They do not constitute an active subscription or guarantee of availability.'
          )
        },
        {
          q: this.uiLocale.text('Are the package limits already applied?'),
          a: this.uiLocale.text(
            'Not as a mechanism for imposing assistance. The limits and benefits described commercially should not be considered active restrictions or guaranteed rights.'
          )
        }
      ]
    },
    {
      title: this.uiLocale.text('Management companies'),
      questions: [
        {
          q: this.uiLocale.text('Can a company use Oikio?'),
          a: this.uiLocale.text(
            'The platform includes roles and tools for management companies and their partners. Access depends on the account and the role.'
          )
        },
        {
          q: this.uiLocale.text('How are companies priced?'),
          a: this.uiLocale.text(
            'The pricing directory describes recommended corporate packages and cases upon offer. Subscription purchase and package enforcement are not yet available.'
          )
        },
        {
          q: this.uiLocale.text('Can partners take over apartment buildings?'),
          a: this.uiLocale.text(
            "There are partner roles for the work of management companies. The available actions depend on the assignment and the user's permissions."
          )
        }
      ]
    },
    {
      title: this.uiLocale.text('Operations'),
      questions: [
        {
          q: this.uiLocale.text('What tasks can I organize?'),
          a: this.uiLocale.text(
            'Depending on your role, you can manage building and membership items, expenses, and shared statements, as well as use announcements, polls, and a calendar.'
          )
        },
        {
          q: this.uiLocale.text('What is chat?'),
          a: this.uiLocale.text(
            'The chat concerns internal communication on the platform and is not a support channel for Oikio. For platform help, use the helpdesk or the support page.'
          )
        },
        {
          q: this.uiLocale.text('How do I ask Oikio for help?'),
          a: this.uiLocale.text(
            'Logged-in users can create a request on the helpdesk. For general information, see also the public support page.'
          )
        },
        {
          q: this.uiLocale.text('Do they all see the same information?'),
          a: this.uiLocale.text(
            "Not necessarily. Access and available actions depend on the user's role and relationship with the apartment building."
          )
        }
      ]
    },
    {
      title: this.uiLocale.text('Full management'),
      questions: [
        {
          q: this.uiLocale.text('Does Oikio manage my apartment building?'),
          a: this.uiLocale.text(
            'Oikio provides digital tools. Using the platform by itself does not mean that Oikio takes over the physical or financial management of the apartment building.'
          )
        },
        {
          q: this.uiLocale.text('Can I request full management from a company?'),
          a: this.uiLocale.text(
            'For fully managed services, separate arrangement with the respective provider is required. Content, availability, and cost are not automatic provision of the platform.'
          )
        }
      ]
    }
  ];

  constructor() {
    inject(Title).setTitle(this.uiLocale.text('Frequently Asked Questions | Oikio'));
    inject(Meta).updateTag({
      name: 'description',
      content: this.uiLocale.text('Answers about Oikio, its features, recommended subscriptions, and apartment building management.')
    });
    this.http.get<PricingCatalog>(`${environment.apiUrl}/api/v1/pricing`).subscribe({
      next: (catalog) => (this.catalog = catalog),
      error: () => (this.catalog = null)
    });
  }

  get plus() {
    return this.catalog?.plans.find((plan) => plan.id === 'INDIVIDUAL_PLUS');
  }

  money(cents: number): string {
    return new Intl.NumberFormat(this.uiLocale.locale, { style: 'currency', currency: this.catalog?.currency || 'EUR' }).format(
      cents / 100
    );
  }
}
