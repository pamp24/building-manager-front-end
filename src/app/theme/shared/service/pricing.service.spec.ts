import { eligible, price, PricingCatalog, PricingPlan } from './pricing.service';

describe('pricing calculations', () => {
  const catalog: PricingCatalog = { currency: 'EUR', annualDiscountBasisPoints: 1500, businessVatBasisPoints: 2400, plans: [] };
  const plus: PricingPlan = { id: 'INDIVIDUAL_PLUS', taxTreatment: 'INCLUSIVE', quoteOnly: false, maxBuildings: 1, maxApartments: null, includedApartments: 5, monthlyBaseCents: 990, extraApartmentMonthlyCents: 100 };
  const business: PricingPlan = { id: 'BUSINESS_STARTER', taxTreatment: 'EXCLUSIVE', quoteOnly: false, maxBuildings: 5, maxApartments: 50, includedApartments: 50, monthlyBaseCents: 2990, extraApartmentMonthlyCents: 0 };

  it('calculates extra apartments and annual inclusive prices', () => {
    expect(price(plus, catalog, 7, false)).toEqual({ amount: 1190, vat: null, total: 1190 });
    expect(price(plus, catalog, 7, true)).toEqual({ amount: 12138, vat: null, total: 12138 });
  });
  it('rounds business VAT on the discounted annual amount', () => {
    expect(price(business, catalog, 50, true)).toEqual({ amount: 30498, vat: 7320, total: 37818 });
  });
  it('checks limits and does not price quote-only plans', () => {
    expect(eligible(business, 5, 50)).toBeTrue();
    expect(eligible(business, 6, 50)).toBeFalse();
    expect(eligible(business, 5, 51)).toBeFalse();
    expect(price({ ...plus, quoteOnly: true }, catalog, 5, false)).toBeNull();
  });
});
