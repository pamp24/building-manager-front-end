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
  return (plan.maxBuildings === null || buildings <= plan.maxBuildings) &&
    (plan.maxApartments === null || apartments <= plan.maxApartments);
}

export function price(plan: PricingPlan, catalog: PricingCatalog, apartments: number, annual: boolean) {
  if (plan.quoteOnly || plan.monthlyBaseCents === null || plan.extraApartmentMonthlyCents === null || plan.includedApartments === null) return null;
  const monthly = plan.monthlyBaseCents + Math.max(0, apartments - plan.includedApartments) * plan.extraApartmentMonthlyCents;
  const amount = annual ? Math.round(monthly * 12 * (10000 - catalog.annualDiscountBasisPoints) / 10000) : monthly;
  const vat = plan.taxTreatment === 'EXCLUSIVE' ? Math.round(amount * catalog.businessVatBasisPoints / 10000) : null;
  return { amount, vat, total: amount + (vat ?? 0) };
}

export function planName(id: string): string {
  const names: Record<string, string> = {
    INDIVIDUAL_FREE: 'Free', INDIVIDUAL_PLUS: 'Plus', INDIVIDUAL_EXTENDED: 'Extended',
    BUSINESS_STARTER: 'Starter', BUSINESS_GROWTH: 'Growth', BUSINESS_ENTERPRISE: 'Enterprise'
  };
  return names[id] ?? id;
}

export const freeFeatures = [
  'Υπολογισμός και έκδοση κοινοχρήστων',
  'Παρακολούθηση οφειλών και εξοφλήσεων',
  'Διαχείριση ταμείου',
  'Εξαγωγή και εκτύπωση PDF',
  'Ηλεκτρονικές ψηφοφορίες',
  'Ανακοινώσεις'
];

export const plusFeatures = [
  'Εσωτερικό chat ενοίκων, ιδιοκτητών και διαχειριστή',
  'Support Tickets προς Oikio Admin Support με προτεραιότητες',
  'Διαχείριση και αποθήκευση εγγράφων',
  'Ειδοποιήσεις και υπενθυμίσεις',
  'Online πληρωμές κοινοχρήστων',
  'Αναλυτικές οικονομικές αναφορές'
];

export const extendedFeatures = [
  'Όλες οι λειτουργίες του Plus',
  'Πλήρης οικονομική διαχείριση',
  'Παρακολούθηση εισπράξεων',
  'Οργάνωση συντηρήσεων και εργασιών',
  'Συντονισμός συνεργείων',
  'Προηγμένα οικονομικά reports',
  'Αυτοματισμοί και επαναλαμβανόμενες εργασίες',
  'Υπεύθυνος διαχείρισης',
  'Προτεραιότητα εξυπηρέτησης'
];

@Injectable({ providedIn: 'root' })
export class PricingService {
  private http = inject(HttpClient);
  catalog() { return this.http.get<PricingCatalog>(`${environment.apiUrl}/api/v1/pricing`); }
}
