import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthenticationService } from '../../service/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardChild implements CanActivateChild {
  private router = inject(Router);
  private authService = inject(AuthenticationService);

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    const requiredRoles: string[] = route.data?.['roles'] ?? [];
console.log('Current user:', currentUser);
console.log('Roles στο currentUser:', currentUser?.roles);
console.log('Απαιτούμενοι ρόλοι:', requiredRoles);
    if (currentUser && this.authService.isLoggedIn()) {
      const userRoles: string[] = currentUser.roles ?? [];

      const hasAccess = requiredRoles.length === 0 || userRoles.some(role => requiredRoles.includes(role));

      if (hasAccess) return true;

      this.router.navigate(['/unauthorized']);
      return false;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
