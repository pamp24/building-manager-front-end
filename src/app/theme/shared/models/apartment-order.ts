import { ApartmentDTO } from './apartmentDTO';

const greekFloors = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'ΣΤ', 'Ζ', 'Η', 'Θ', 'Ι', 'ΙΑ', 'ΙΒ', 'ΙΓ', 'ΙΔ', 'ΙΕ', 'ΙΣΤ', 'ΙΖ', 'ΙΗ', 'ΙΘ', 'Κ'];
const floorCode = /^([Α-Ω]+|\d+)[΄ʹ'’]*(?:[\s.\-'_/]*\d+|[\s.'’]*ΟΡΟΦΟΣ)?$/;
const unknownRank = 2147483645;

function normalize(value: string | null | undefined): string {
  return (value ?? '').trim().toUpperCase().normalize('NFD').replace(/\p{M}+/gu, '');
}

function floorRank(floor: string): number {
  if (!floor) return 2147483646;
  if (floor.startsWith('ΗΜΙΥΠΟΓ')) return -2;
  if (floor.startsWith('ΥΠΟΓ') || floor === 'Υ') return -3;
  if (floor.startsWith('ΗΜΙΟΡΟΦ') || floor.startsWith('MEZZANINE')) return 1;
  if (floor.startsWith('ΙΣΟΓ') || floor === 'GROUND') return 0;
  if (/^Ι(?:[\s.\-_/]*\d+)?$/.test(floor)) return 0;
  if (floor.startsWith('ΔΩΜ') || floor.startsWith('ΡΕΤΙΡ') || floor === 'ROOF') return 2147483647;
  const prefix = floor.match(floorCode)?.[1] ?? floor;
  if (prefix === 'Υ') return -3;
  const index = greekFloors.indexOf(prefix);
  if (index !== -1) return index + 2;
  if (/^\d+$/.test(prefix) && BigInt(prefix) < 2147483644n) return Number(prefix) === 0 ? 0 : Number(prefix) + 1;
  return unknownRank;
}

function apartmentNumber(floor: string, number: string | null | undefined): string {
  const value = normalize(number);
  const prefix = floor.match(floorCode)?.[1] ?? floor;
  if (prefix && value.startsWith(prefix) && (!/^\d/.test(prefix) || /^[\s.\-'_/]/.test(value.slice(prefix.length)))) {
    const remainder = value.slice(prefix.length).replace(/^[\s.\-'_/]+/, '');
    if (/^\d/.test(remainder)) return remainder;
  }
  return value;
}

function naturalCompare(a: string, b: string): number {
  if (!a || !b) return a === b ? 0 : a ? -1 : 1;
  const left = a.match(/\d+|\D+/g) ?? [];
  const right = b.match(/\d+|\D+/g) ?? [];
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    const x = left[i];
    const y = right[i];
    const result = /^\d/.test(x) && /^\d/.test(y)
      ? (BigInt(x) < BigInt(y) ? -1 : BigInt(x) > BigInt(y) ? 1 : 0)
      : (x < y ? -1 : x > y ? 1 : 0);
    if (result) return result;
  }
  return a.length - b.length;
}

export function compareApartments(a: ApartmentDTO, b: ApartmentDTO): number {
  const floorA = normalize(a.floor);
  const floorB = normalize(b.floor);
  const rankA = floorRank(floorA);
  const rankB = floorRank(floorB);
  return rankA - rankB || (rankA === unknownRank ? naturalCompare(floorA, floorB) : 0) ||
    naturalCompare(apartmentNumber(floorA, a.number), apartmentNumber(floorB, b.number)) ||
    (a.id == null ? (b.id == null ? 0 : 1) : b.id == null ? -1 : a.id - b.id);
}
