import { Component, HostListener, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/theme/shared/service';

@Component({
  selector: 'app-public-header',
  imports: [RouterLink, NgbCollapseModule],
  template: `
    <nav class="navbar navbar-expand-md navbar-dark" [class.landing]="landing()" [class.landing-nav]="landing() && scrolled" aria-label="Κύρια πλοήγηση">
      <div class="container">
        <a class="navbar-brand p-0" routerLink="/"><img src="assets/images/landing/oikio-landing.png" alt="Oikio" class="landing-logo" /></a>
        <button class="navbar-toggler" type="button" (click)="isCollapsed = !isCollapsed" [attr.aria-expanded]="!isCollapsed" aria-label="Πλοήγηση">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" [ngbCollapse]="isCollapsed">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item landing-header-title"><a class="nav-link" [routerLink]="userLogin ? '/dashboard/default' : '/login'">{{ userLogin ? 'Πίνακας Ελέγχου' : 'Σύνδεση' }}</a></li>
            <li class="nav-item ms-3 landing-header-title"><a class="nav-link" routerLink="/pricing">Τιμολόγηση</a></li>
            <li class="nav-item ms-3 landing-header-title"><a class="nav-link me-2" routerLink="/features">Περισσότερα</a></li>
            <li class="nav-item ms-2"><a class="btn btn-primary" routerLink="/register">Εγγραφή</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { padding: 16px 0; width: 100%; background: #141414; z-index: 1099; }
    .navbar.landing { position: fixed; top: 0; background: transparent; }
    .navbar.landing-nav { background: #141414; box-shadow: 0 8px 6px -10px rgba(0,0,0,.5); }
    .landing-logo { width: 140px; max-width: 100%; height: auto; padding: 6px 8px; background: #fff; border-radius: 4px; vertical-align: middle; }
    .landing-header-title .nav-link { color: var(--bs-white); }
    .landing-header-title .nav-link:hover { color: var(--bs-primary); }
    @media (max-width: 767px) { .navbar.landing { background: #141414; } }
  `]
})
export class PublicHeaderComponent {
  readonly landing = input(false);
  readonly userLogin = !!inject(AuthenticationService).currentUserValue;
  isCollapsed = true;
  scrolled = window.pageYOffset > 0;

  @HostListener('window:scroll') onScroll() { this.scrolled = window.pageYOffset > 0; }
}
