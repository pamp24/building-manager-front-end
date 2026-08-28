/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

// Το NgbDatepickerI18n παρέχεται ως providedIn:'root' με factory που χρησιμοποιεί το ROOT LOCALE_ID,
// οπότε ένα component-level LOCALE_ID δεν επηρεάζει τους μήνες.
// Παρέχουμε λοιπόν δικό μας ελληνικό i18n για τα ημερολόγια (ngb-datepicker) σε όλο το app.
@Injectable()
export class GreekDatepickerI18n extends NgbDatepickerI18n {
  private weekdays = ['Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ', 'Κυρ'];
  private monthsShort = ['Ιαν', 'Φεβ', 'Μάρ', 'Απρ', 'Μάι', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'];
  private monthsFull = [
    'Ιανουάριος',
    'Φεβρουάριος',
    'Μάρτιος',
    'Απρίλιος',
    'Μάιος',
    'Ιούνιος',
    'Ιούλιος',
    'Αύγουστος',
    'Σεπτέμβριος',
    'Οκτώβριος',
    'Νοέμβριος',
    'Δεκέμβριος'
  ];

  getWeekdayLabel(weekday: number, width?: any): string {
    return this.weekdays[weekday - 1] || '';
  }

  getMonthShortName(month: number): string {
    return this.monthsShort[month - 1] || '';
  }

  getMonthFullName(month: number): string {
    return this.monthsFull[month - 1] || '';
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day} ${this.monthsFull[date.month - 1]} ${date.year}`;
  }
}
