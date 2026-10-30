import { compareApartments } from './apartment-order';
import { ApartmentDTO } from './apartmentDTO';

describe('compareApartments', () => {
  it('matches physical floor and natural apartment ordering', () => {
    const apartments = [
      ['Δώμα', '1'], ['Β', 'Β10'], ['Ισόγειο', '2'], ['Υπόγειο', '1'],
      ['Α', 'Α2'], ['Ημιυπόγειο', '1'], ['Ημιόροφος', '1'], ['Β', 'Β2'],
      ['10', '1'], [null, null], ['ΣΤ', '1'], ['Α1', 'Α1']
    ].map(([floor, number], id) => ({ floor, number, id: id + 1 }) as ApartmentDTO);
    expect(apartments.sort(compareApartments).map((apartment) => apartment.id))
      .toEqual([4, 6, 3, 7, 12, 5, 8, 2, 11, 9, 10, 1]);
  });

  it('handles aliases, numeric labels, unknown floors and missing numbers', () => {
    const apartment = (floor: string | null, number: string | null) => ({ floor, number, id: 1 }) as ApartmentDTO;
    expect(compareApartments(apartment('ά', 'Α2'), apartment('1', '2'))).toBe(0);
    expect(compareApartments(apartment('1', '2'), apartment('1', '10'))).toBeLessThan(0);
    expect(compareApartments(apartment('Υ1', 'Υ1'), apartment('Ισόγειο', '1'))).toBeLessThan(0);
    expect(compareApartments(apartment('Α', '1'), apartment('Α', null))).toBeLessThan(0);
    expect(compareApartments(apartment('unknown', '1'), apartment(null, '1'))).toBeLessThan(0);
    expect(compareApartments(apartment('0', '1'), apartment('Ημιόροφος', '1'))).toBeLessThan(0);
    expect(compareApartments(apartment('Ι', 'Ι1'), apartment('Ισόγειο', '1'))).toBe(0);
    expect(compareApartments(apartment('Ι', 'Ι1'), apartment('Α', 'Α1'))).toBeLessThan(0);
    expect(compareApartments(apartment('Ι΄', '1'), apartment('10', '1'))).toBe(0);
    expect(compareApartments(apartment('Ημιόροφος', '1'), apartment('1', '1'))).toBeLessThan(0);
    expect(compareApartments(apartment('Υ1', '1'), apartment('Ημιόροφος', '1'))).toBeLessThan(0);
    expect(compareApartments(apartment('Α όροφος', '1'), apartment('1', '1'))).toBe(0);
    for (const mark of ['΄', 'ʹ', "'", '’']) {
      expect(compareApartments(apartment(`Α${mark} όροφος`, 'Α2'), apartment('1', '2'))).toBe(0);
      expect(compareApartments(apartment(`Β${mark}`, 'Β2'), apartment('2', '2'))).toBe(0);
    }
    expect(compareApartments(apartment('Η', '1'), apartment('8', '1'))).toBe(0);
    expect(compareApartments(apartment(null, '1'), apartment('Δώμα', '1'))).toBeLessThan(0);
  });
});
