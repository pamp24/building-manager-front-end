// Angular import
import { Component, OnInit, input, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

// Project import
import { NavigationItem } from '../../navigation';
import { MantisConfig } from 'src/app/app-config';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { AuthenticationService } from 'src/app/theme/shared/service';

@Component({
  selector: 'app-nav-item',
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent implements OnInit {
  
  private location = inject(Location);
  private authenticationService = inject(AuthenticationService);

  // public props
  readonly item = input.required<NavigationItem>();
  readonly parentRole = input.required<string[]>();
  isEnabled: boolean = false;
  themeLayout: string;

  // Constructor
  constructor() {
    this.themeLayout = MantisConfig.layout;
  }

  ngOnInit() {
    const currentUserRole = this.authenticationService.currentUserValue?.role ?? '';

    const item = this.item();
    const parentRole = this.parentRole();

    if (item.role) {
      if (Array.isArray(item.role)) {
        this.isEnabled = item.role.includes(currentUserRole);
      } else {
        this.isEnabled = item.role === currentUserRole;
      }
    }
    // Αν όχι, πάμε να δούμε μήπως υπάρχει περιορισμός στον parent
    else if (parentRole && parentRole.length > 0) {
      this.isEnabled = parentRole.includes(currentUserRole);
    }
    // Αν δεν υπάρχουν καθόλου ρόλοι, το δείχνουμε πάντα
    else {
      this.isEnabled = true;
    }
  }

  // public method
  closeOtherMenu(event: MouseEvent) {
    if (MantisConfig.layout === 'vertical') {
      const ele = event.target as HTMLElement;
      if (ele !== null && ele !== undefined) {
        const parent = ele.parentElement as HTMLElement;
        const up_parent = ((parent.parentElement as HTMLElement).parentElement as HTMLElement).parentElement as HTMLElement;
        const last_parent = (up_parent.parentElement as HTMLElement).parentElement as HTMLElement;
        if (last_parent.classList.contains('coded-submenu')) {
          up_parent.classList.remove('coded-trigger');
          up_parent.classList.remove('active');
        } else {
          const sections = document.querySelectorAll('.coded-hasmenu');
          for (let i = 0; i < sections.length; i++) {
            sections[i].classList.remove('active');
            sections[i].classList.remove('coded-trigger');
          }
        }

        if (parent.classList.contains('coded-hasmenu')) {
          parent.classList.add('coded-trigger');
          parent.classList.add('active');
        } else if (up_parent.classList.contains('coded-hasmenu')) {
          up_parent.classList.add('coded-trigger');
          up_parent.classList.add('active');
        } else if (last_parent.classList.contains('coded-hasmenu')) {
          last_parent.classList.add('coded-trigger');
          last_parent.classList.add('active');
        }
      }
    } else {
      setTimeout(() => {
        const sections = document.querySelectorAll('.coded-hasmenu');
        for (let i = 0; i < sections.length; i++) {
          sections[i].classList.remove('active');
          sections[i].classList.remove('coded-trigger');
        }

        let current_url = this.location.path();
        // eslint-disable-next-line
        // @ts-ignore
        if (this.location['_baseHref']) {
          // eslint-disable-next-line
          // @ts-ignore
          current_url = this.location['_baseHref'] + this.location.path();
        }
        const link = "a.nav-link[ href='" + current_url + "' ]";
        const ele = document.querySelector(link);
        if (ele !== null && ele !== undefined) {
          const parent = ele.parentElement;
          const up_parent = parent?.parentElement?.parentElement;
          const last_parent = up_parent?.parentElement;
          if (parent?.classList.contains('coded-hasmenu')) {
            parent.classList.add('active');
          } else if (up_parent?.classList.contains('coded-hasmenu')) {
            up_parent.classList.add('active');
          } else if (last_parent?.classList.contains('coded-hasmenu')) {
            last_parent.classList.add('active');
          }
        }
      }, 500);
    }
    if ((document.querySelector('app-navigation.pc-sidebar') as HTMLDivElement).classList.contains('mob-open')) {
      (document.querySelector('app-navigation.pc-sidebar') as HTMLDivElement).classList.remove('mob-open');
    }
  }

  subMenuCollapse() {
    if ((document.querySelector('app-navigation.pc-sidebar') as HTMLDivElement).classList.contains('coded-trigger')) {
      (document.querySelector('app-navigation.pc-sidebar') as HTMLDivElement).classList.remove('coded-trigger');
    }
  }
}
