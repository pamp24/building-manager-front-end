import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PublicFooterComponent } from '../public-info/public-footer.component';
import { PublicHeaderComponent } from '../public-info/public-header.component';
import { PricingCatalog, PricingService, eligible, freeFeatures, plusFeatures, extendedFeatures, planName, price } from 'src/app/theme/shared/service/pricing.service';

@Component({
  selector: 'app-public-pricing',
  imports: [CommonModule, FormsModule, RouterLink, PublicFooterComponent, PublicHeaderComponent],
  templateUrl: './public-pricing.component.html',
  styleUrls: ['./public-pricing.component.scss']
})
export class PublicPricingComponent {
  private pricing = inject(PricingService);
  catalog: PricingCatalog | null = null;
  error = false;
  type: 'individual' | 'business' = 'individual';
  annual = false;
  buildings = 1;
  apartments = 5;
  readonly eligible = eligible;
  readonly freeFeatures = freeFeatures;
  readonly plusFeatures = plusFeatures;
  readonly extendedFeatures = extendedFeatures;
  readonly planName = planName;
  readonly price = price;
  constructor() { this.load(); }
  load() {
    this.error = false;
    this.pricing.catalog().subscribe({ next: catalog => this.catalog = catalog, error: () => this.error = true });
  }
  get plans() { return this.catalog?.plans.filter(plan => plan.id.startsWith(this.type === 'individual' ? 'INDIVIDUAL_' : 'BUSINESS_')) ?? []; }
  get validCounts() { return Number.isInteger(this.buildings) && Number.isInteger(this.apartments) && this.buildings >= 1 && this.apartments >= 1 && this.buildings <= 100000 && this.apartments <= 100000; }
}
