import { Injectable, inject } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UiLocaleService } from './ui-locale.service';

@Injectable()
export class AppDatepickerI18n extends NgbDatepickerI18n {
  private readonly uiLocale = inject(UiLocaleService);

  getWeekdayLabel(weekday: number): string {
    return new Intl.DateTimeFormat(this.uiLocale.locale, { weekday: 'short', timeZone: 'UTC' }).format(
      new Date(Date.UTC(2024, 0, weekday))
    );
  }

  getMonthShortName(month: number): string {
    return this.monthName(month, 'short');
  }

  getMonthFullName(month: number): string {
    return this.monthName(month, 'long');
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return new Intl.DateTimeFormat(this.uiLocale.locale, { dateStyle: 'long', timeZone: 'UTC' }).format(
      new Date(Date.UTC(date.year, date.month - 1, date.day))
    );
  }

  private monthName(month: number, width: 'short' | 'long'): string {
    return new Intl.DateTimeFormat(this.uiLocale.locale, { month: width, timeZone: 'UTC' }).format(new Date(Date.UTC(2024, month - 1, 1)));
  }
}
