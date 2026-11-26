import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';

export const homeGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  return authService.currentUserValue && authService.isLoggedIn()
    ? router.parseUrl(authService.getDefaultRouteForRole())
    : true;
};
