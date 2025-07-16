import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardChild implements CanActivateChild {
  private router = inject(Router);
  private authService = inject(AuthenticationService);

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  const currentUser = this.authService.currentUserValue;
  console.log('Τιμή currentUser.role:', currentUser?.role);
  if (currentUser && this.authService.isLoggedIn()) {
    return true;
  }

  this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
}
}

