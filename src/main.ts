// Angular Import
import { APP_INITIALIZER, LOCALE_ID, enableProdMode, importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeEl from '@angular/common/locales/el';
import localeFr from '@angular/common/locales/fr';
import localeDe from '@angular/common/locales/de';
import localeEs from '@angular/common/locales/es';
import localeHe from '@angular/common/locales/he';
import localeZh from '@angular/common/locales/zh';
import { UiLocaleService, UI_LOCALES, savedUiLanguage } from './app/theme/shared/service/ui-locale.service';
import { environment } from './environments/environment';

// register EL locale data (used by the calendar for Greek month/day names)
registerLocaleData(localeEl);
[localeFr, localeDe, localeEs, localeHe, localeZh].forEach((locale) => registerLocaleData(locale));

// project import
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { BasicAuthInterceptor } from 'src/app/theme/shared/components/_helpers/basic-auth.interceptor';
import { JwtInterceptor } from 'src/app/theme/shared/components/_helpers/error.interceptor';
import { SharedModule } from './app/theme/shared/shared.module';
import { CustomTranslateLoader } from './app/theme/shared/custom-translate-loader';

// third party
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: APP_INITIALIZER, multi: true, useFactory: (locale: UiLocaleService) => () => locale.initialize(), deps: [UiLocaleService] },
    { provide: LOCALE_ID, useFactory: () => UI_LOCALES[savedUiLanguage()] },
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      SharedModule,
      ToastrModule.forRoot(),
      SweetAlert2Module.forRoot(),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: CustomTranslateLoader
        }
      })
    ),
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    [provideHttpClient(withInterceptorsFromDi())],
    provideAnimations()
  ]
}).catch((err) => console.error(err));
