import { UserCardComponent } from './user-card.component';

describe('UserCardComponent sorting', () => {
  const cards = () => [
    { name: 'Charlie', apartment: { id: 1, floor: 'Δώμα', number: '1' } },
    { name: 'Bob', apartment: { id: 2, floor: 'Α2', number: 'Α2' } },
    { name: 'Alice', apartment: { id: 3, floor: 'Υπόγειο', number: '1' } },
    { name: 'Eve', apartment: { id: 4, floor: 'Ημιόροφος', number: '1' } },
    { name: 'Dave', apartment: { id: 5, floor: 'Ισόγειο', number: '1' } },
    { name: 'Frank', apartment: { id: 6, floor: 'Β1', number: 'Β1' } },
    { name: 'George', apartment: { id: 7, floor: 'Α1', number: 'Α1' } }
  ];

  function sorted(option: string): number[] {
    const component = { sortOption: option, card_detail: cards() };
    UserCardComponent.prototype.sortCards.call(component as unknown as UserCardComponent);
    return component.card_detail.map((card) => card.apartment.id);
  }

  it('uses physical floor and natural apartment order by default and for ascending floors', () => {
    const expected = [3, 5, 4, 7, 2, 6, 1];
    expect(sorted('default')).toEqual(expected);
    expect(sorted('floorAsc')).toEqual(expected);
  });

  it('reverses physical apartment order for descending floors', () => {
    expect(sorted('floorDesc')).toEqual([1, 6, 2, 7, 4, 5, 3]);
  });

  it('preserves explicit name sorting', () => {
    expect(sorted('name')).toEqual([3, 2, 1, 5, 4, 6, 7]);
  });
});
