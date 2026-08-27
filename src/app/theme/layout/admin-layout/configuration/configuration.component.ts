// angular import
import { Component, OnInit, Renderer2, output, inject, DOCUMENT } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

// project import
import { MantisConfig } from 'src/app/app-config';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ScrollbarComponent } from 'src/app/theme/shared/components/scrollbar/scrollbar.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import { CloseCircleOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-configuration',
  imports: [SharedModule, ScrollbarComponent],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  private location = inject(Location);
  private locationStrategy = inject(LocationStrategy);
  private themeService = inject(ThemeService);
  private renderer = inject(Renderer2);
  private iconService = inject(IconService);
  private document = inject<Document>(DOCUMENT);
  private authenticationService = inject(AuthenticationService);

  // public props
  readonly Customize = output();

  isCollapsed = false;
  layoutIsCollapsed = false;
  presetIsCollapsed = false;
  boxLayoutIsCollapsed = false;
  fontIsCollapsed = false;

  bodyColor!: string; // mantis Customizes
  rtlLayout!: boolean; // rtl type
  layoutType!: boolean; // layout type
  boxLayout!: boolean; // container
  setFontFamily!: string; // font-family type.
  resetLayoutType!: string;

  // constructor
  constructor() {
    this.setThemeLayout();
    this.iconService.addIcon(...[CloseCircleOutline]);
  }

  // life cycle event
  ngOnInit() {
    const storedMode = localStorage.getItem('theme-mode') ?? sessionStorage.getItem('theme-mode');
    this.layoutType = storedMode !== null ? storedMode === 'dark' : MantisConfig.isDarkMode;
    this.setDarkLayout(this.layoutType);

    // Το θέμα προσαρμόζεται αυτόματα βάσει του ρόλου του χρήστη
    this.bodyColor = this.resolveRolePreset(this.authenticationService.currentUserValue?.role);
    this.SetBodyColor(this.bodyColor);

    this.rtlLayout = MantisConfig.isRtlLayout;
    this.setLayout(this.rtlLayout);
    this.boxLayout = MantisConfig.isBox_container;
    this.setBoxContainer(this.boxLayout);
    this.setFontFamily = MantisConfig.font_family;
    this.fontFamily(this.setFontFamily);
  }

  /**
   * Αντιστοιχίζει τον ρόλο του χρήστη στο χρώμα (preset) του θέματος.
   * PM → green (preset-4) | BM → orange (preset-6) | owner/resident → blue (preset-1) | admin → purple (preset-3)
   */
  private resolveRolePreset(role?: string): string {
    switch (role) {
      case 'PropertyManager':
      case 'PropertyAgent':
        return 'preset-4'; // πρασινο
      case 'BuildingManager':
        return 'preset-6'; // πορτοκαλί
      case 'Admin':
      case 'AdminAgent':
        return 'preset-3'; // μοβ
      case 'Owner':
      case 'Resident':
      case 'User':
      default:
        return 'preset-1'; // μπλε
    }
  }

  // public method

  // change main layout
  setColorLayout(layout: string) {
    if (layout === 'reset') {
      this.ngOnInit();
    }
  }

  setThemeLayout() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }

    switch (current_url) {
      case baseHref + '/layout/vertical':
        MantisConfig.layout = 'vertical';
        break;

      case baseHref + '/layout/compact':
        MantisConfig.layout = 'compact';
        break;

      case baseHref + '/layout/horizontal':
        MantisConfig.layout = 'horizontal';
        MantisConfig.isRtlLayout = false;
        break;
    }
  }

  setDarkLayout(isDark: boolean) {
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    sessionStorage.setItem('theme-mode', isDark ? 'dark' : 'light');

    // Το dark theme εφαρμόζεται μόνο σε συνδεδεμένο χρήστη (η σελίδα Login μένει πάντα ανοιχτή/light)
    const loggedIn = !!this.authenticationService.currentUserValue;
    const applyDark = isDark && loggedIn;

    if (applyDark) {
      document.querySelector('body')?.classList.add('mantis-dark');
      document.querySelector('html')?.classList.add('dark');
      this.layoutType = true;
    } else {
      document.querySelector('body')?.classList.remove('mantis-dark');
      document.querySelector('html')?.classList.remove('dark');
      this.layoutType = false;
    }
    this.themeService.isDarkMode.set(this.layoutType);
  }

  setBoxContainer(isContainer: boolean) {
    if (isContainer) {
      this.document.querySelector('.coded-content')?.classList.add('container');
      this.boxLayout = true;
    } else {
      this.document.querySelector('.coded-content')?.classList.remove('container');
      this.boxLayout = false;
    }
    this.themeService.isContainerMode.set(this.boxLayout);
  }

  setLayout(isRTL: boolean) {
    if (isRTL) {
      this.renderer.addClass(document.body, 'mantis-rtl');
      this.renderer.removeClass(document.body, 'mantis-ltr');
      this.rtlLayout = true;
    } else {
      this.renderer.removeClass(document.body, 'mantis-rtl');
      this.renderer.addClass(document.body, 'mantis-ltr');
      this.rtlLayout = false;
    }
    this.themeService.isRTLMode.set(this.rtlLayout);
  }

  SetBodyColor(background: string) {
    this.bodyColor = background;
    const body = this.document.querySelector('body');
    for (let i = 1; i <= 9; i++) {
      body?.part.remove(`preset-${i}`);
    }
    body?.part.add(background);
    this.themeService.customsTheme.set(background);
  }

  fontFamily(fontStyle: string) {
    this.setFontFamily = fontStyle;
    this.renderer.removeClass(document.body, 'public-sans');
    this.renderer.removeClass(document.body, 'Roboto');
    this.renderer.removeClass(document.body, 'Poppins');
    this.renderer.removeClass(document.body, 'Poppins');
    this.renderer.addClass(document.body, fontStyle);
  }
}
