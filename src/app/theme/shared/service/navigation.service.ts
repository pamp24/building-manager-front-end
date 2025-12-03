import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { NavigationItem } from 'src/app/theme/shared/models/navigation';
import { NavigationItems } from 'src/app/theme/layout/admin-layout/navigation/navigation';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private authService: AuthenticationService) {}

  getNavigation(): NavigationItem[] {
    const user = this.authService.currentUserValue;
    const userRole = user?.role || 'User';


    return this.filterNavigationByRole(NavigationItems, userRole);
  }

  private filterNavigationByRole(items: NavigationItem[], role: string): NavigationItem[] {
    return items
      .map(item => {
        // Αν έχει παιδιά → φιλτράρισέ τα πρώτα
        const filteredChildren = item.children 
          ? this.filterNavigationByRole(item.children, role)
          : undefined;

        const hasAccess = !item.role || item.role.includes(role);
        const hasVisibleChildren = filteredChildren && filteredChildren.length > 0;

        // === RULES ===
        // 1. Αν το item έχει ρόλους και δεν ταιριάζει → κόψτο
        if (!hasAccess) return null;

        // 2. Αν είναι group/collapse και μετά το φιλτράρισμα δεν έχει children → κόψτο
        if ((item.type === 'group' || item.type === 'collapse') && !hasVisibleChildren) return null;

        // 3. Επιστρέψτε το item με τα σωστά children
        return {
          ...item,
          children: filteredChildren
        };
      })
      .filter(item => item !== null) as NavigationItem[];
  }
}
