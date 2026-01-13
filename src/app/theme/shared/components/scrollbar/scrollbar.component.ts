import { Component, effect, inject, Input } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ThemeService } from '../../service/customs-theme.service';

@Component({
  selector: 'app-scrollbar',
  standalone: true,                 // ✅ FIX #1
  imports: [NgScrollbarModule],
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.scss'] // ✅ FIX #2 (styleUrls όχι styleUrl)
})
export class ScrollbarComponent {
  private themeService = inject(ThemeService);

  // ✅ Το customStyle τελικά το χρησιμοποιείς σαν height στο template
  // άρα καλύτερα να είναι string (π.χ. '280px')
  @Input() customStyle: string = '280px';

  direction: string = 'ltr';

  constructor() {
    effect(() => {
      this.direction = this.themeService.isRTLMode() ? 'rtl' : 'ltr';
    });
  }
}
