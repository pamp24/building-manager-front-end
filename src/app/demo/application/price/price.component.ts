import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PricingCatalog, PricingPlan, PricingService, eligible, freeFeatures, plusFeatures, extendedFeatures, planName, price } from 'src/app/theme/shared/service/pricing.service';

@Component({
  selector: 'app-price',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent {
  private pricing = inject(PricingService);
  catalog: PricingCatalog | null = null;
  error = false;
  selectedType: 'individual' | 'company' = 'individual';
  annual = false;
  buildings = 1;
  apartments = 1;
  selection: { name: string; annual: boolean; buildings: number; apartments: number; currency: string; total: number; amount: number; vat: number | null } | null = null;
  readonly tierImages = ['assets/images/price/tier-1.png', 'assets/images/price/tier-2.png', 'assets/images/price/tier-3.png'];
  readonly price = price;
  readonly eligible = eligible;
  readonly freeFeatures = freeFeatures;
  readonly plusFeatures = plusFeatures;
  readonly extendedFeatures = extendedFeatures;
  readonly planName = planName;

  constructor() { this.load(); }
  selectPlan(plan: PricingPlan) {
    if (!this.catalog || !this.validCounts || !eligible(plan, this.buildings, this.apartments)) return;
    const estimate = price(plan, this.catalog, this.apartments, this.annual);
    if (!estimate) return;
    this.selection = { name: planName(plan.id), annual: this.annual, buildings: this.buildings, apartments: this.apartments, currency: this.catalog.currency, ...estimate };
  }
  load() {
    this.error = false;
    this.pricing.catalog().subscribe({ next: catalog => this.catalog = catalog, error: () => this.error = true });
  }
  get plans() {
    return this.catalog?.plans.filter(plan => plan.id.startsWith(this.selectedType === 'individual' ? 'INDIVIDUAL_' : 'BUSINESS_')) ?? [];
  }
  get sliderApartments() { return Number.isFinite(this.apartments) ? Math.min(250, Math.max(1, this.apartments)) : 1; }
  get validCounts() { return Number.isInteger(this.buildings) && Number.isInteger(this.apartments) && this.buildings >= 1 && this.apartments >= 1 && this.buildings <= 100000 && this.apartments <= 100000; }
}
