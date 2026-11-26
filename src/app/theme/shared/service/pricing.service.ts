import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface PricingPlan {
  id: string;
  taxTreatment: 'INCLUSIVE' | 'EXCLUSIVE';
  quoteOnly: boolean;
  maxBuildings: number | null;
  maxApartments: number | null;
  includedApartments: number | null;
  monthlyBaseCents: number | null;
  extraApartmentMonthlyCents: number | null;
}

export interface PricingCatalog {
  currency: string;
  annualDiscountBasisPoints: number;
  businessVatBasisPoints: number;
  plans: PricingPlan[];
}

export function eligible(plan: PricingPlan, buildings: number, apartments: number): boolean {
  return (
    (plan.maxBuildings === null || buildings <= plan.maxBuildings) && (plan.maxApartments === null || apartments <= plan.maxApartments)
  );
}

export function price(plan: PricingPlan, catalog: PricingCatalog, apartments: number, annual: boolean) {
  if (plan.quoteOnly || plan.monthlyBaseCents === null || plan.extraApartmentMonthlyCents === null || plan.includedApartments === null)
    return null;
  const monthly = plan.monthlyBaseCents + Math.max(0, apartments - plan.includedApartments) * plan.extraApartmentMonthlyCents;
  const amount = annual ? Math.round((monthly * 12 * (10000 - catalog.annualDiscountBasisPoints)) / 10000) : monthly;
  const vat = plan.taxTreatment === 'EXCLUSIVE' ? Math.round((amount * catalog.businessVatBasisPoints) / 10000) : null;
  return { amount, vat, total: amount + (vat ?? 0) };
}

export function planName(id: string): string {
  const names: Record<string, string> = {
    INDIVIDUAL_FREE: 'Free',
    INDIVIDUAL_PLUS: 'Plus',
    INDIVIDUAL_EXTENDED: 'Extended',
    BUSINESS_STARTER: 'Starter',
    BUSINESS_GROWTH: 'Growth',
    BUSINESS_ENTERPRISE: 'Enterprise'
  };
  return names[id] ?? id;
}

export const freeFeatures = [
  'Calculation and issuance of common expenses',
  'Monitoring debts and settlements',
  'Treasury Management',
  'Export and print PDF',
  'Electronic voting',
  'Announcements'
];

export const plusFeatures = [
  'Internal chat of tenants, owners, and managers',
  'Support Tickets to Oikio Admin Support with priorities',
  'Document management and storage',
  'Notifications and reminders',
  'Online payments for common expenses',
  'Detailed financial reports'
];

export const extendedFeatures = [
  'All Plus features',
  'Full financial management',
  'Collection monitoring',
  'Organization of maintenance and work',
  'Coordination of crews',
  'Advanced financial reports',
  'Automations and repetitive tasks',
  'Management Officer',
  'Service Priority'
];

@Injectable({ providedIn: 'root' })
export class PricingService {
  private http = inject(HttpClient);
  catalog() {
    return this.http.get<PricingCatalog>(`${environment.apiUrl}/api/v1/pricing`);
  }
}
