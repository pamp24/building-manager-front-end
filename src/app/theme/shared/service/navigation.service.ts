// import { INavigationItem } from './navigation.interface';
// import { navigationItems } from './navigation'; // όπου έχεις τον πίνακα
// import { AuthenticationService } from './authentication.service';
// import { Injectable } from '@angular/core';

// @Injectable({ providedIn: 'root' })
// export class NavigationService {
//   constructor(private authService: AuthenticationService) {}

//   getNavigation(): INavigationItem[] {
//     const user = this.authService.currentUserValue;
//     const userRole = user?.role?.name || 'User';

//     return this.filterNavigationByRole(navigationItems, userRole);
//   }

//   private filterNavigationByRole(items: INavigationItem[], role: string): INavigationItem[] {
//     return items
//       .filter(item => !item.roles || item.roles.includes(role)) // φιλτράρει αν δεν υπάρχουν roles ή περιλαμβάνει τον ρόλο
//       .map(item => ({
//         ...item,
//         children: item.children ? this.filterNavigationByRole(item.children, role) : undefined
//       }));
//   }
// }
