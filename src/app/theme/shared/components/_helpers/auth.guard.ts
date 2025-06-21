import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';

import { AuthenticationService } from '../../service/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardChild implements CanActivateChild {
  private router = inject(Router);
  private authenticationService = inject(AuthenticationService);

  /**
   * Determines whether a child route can be activated based on user authentication and authorization.
   *
   * @param route - The activated route snapshot that contains the route configuration and parameters.
   * @param state - The router state snapshot that contains the current router state.
   * @returns A boolean indicating whether the route can be activated. Redirects to an appropriate page if not.
   *
   * If the user is logged in and their role is authorized for the route, returns true.
   * If the user is logged in but not authorized, redirects to the unauthorized page and returns false.
   * If the user is not logged in, redirects to the login page with the return URL and returns false.
   */

canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  const currentUser = this.authenticationService.currentUserValue;
  console.log('AuthGuardChild - currentUser:', currentUser);
  console.log('AuthGuardChild - route.data:', route.data);

  const roles: string[] = route.data && route.data['roles'] ? route.data['roles'] : [];
  console.log('AuthGuardChild - roles:', roles);

  if (currentUser && this.authenticationService.isLoggedIn()) {
    if (roles.length > 0 && !roles.includes(currentUser.role)) {
      console.log('AuthGuardChild - User not authorized, redirecting to /unauthorized');
      this.router.navigate(['/unauthorized']);
      return false;
    }
    console.log('AuthGuardChild - User logged in and authorized, allowing route');
    return true;
  }

  console.log('AuthGuardChild - User not logged in, redirecting to /login');
  this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
}
}
