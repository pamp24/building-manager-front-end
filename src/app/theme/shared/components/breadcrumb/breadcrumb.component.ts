// Angular Import
import { Component, Input, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule, Event, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

// project import
import { SharedModule } from '../../shared.module';
import { NavigationItems } from 'src/app/theme/layout/admin-layout/navigation/navigation';
import { componentMenus, NavigationItem } from 'src/app/theme/layout/simple-layout/com-navigation/component-navigation';

// icons
import { IconModule, IconService } from '@ant-design/icons-angular';
import { GlobalOutline, NodeExpandOutline } from '@ant-design/icons-angular/icons';

interface titleType {
  url: string | boolean | undefined;
  title: string;
  breadcrumbs: unknown;
  type: string;
  link?: string | undefined;
  description?: string | undefined;
  path?: string | undefined;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule, IconModule, SharedModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  private route = inject(Router);
  private titleService = inject(Title);
  private iconService = inject(IconService);

  // public props
  @Input() type: string;
  readonly dashboard = input(true);
  readonly Component = input(false);

  navigations: NavigationItem[];
  ComponentNavigations: NavigationItem[];
  breadcrumbList: Array<string> = [];
  navigationList!: titleType[];
  componentList!: titleType[];

  private ar = inject(ActivatedRoute);

  // constructor
  constructor() {
    this.navigations = NavigationItems;
    this.ComponentNavigations = componentMenus;
    this.type = 'theme1';
    this.setBreadcrumb();
    this.iconService.addIcon(...[GlobalOutline, NodeExpandOutline]);
  }

  // public method
  setBreadcrumb() {
    this.route.events.subscribe((router: Event) => {
      if (router instanceof NavigationEnd) {
        const crumbs = this.buildRouteBreadcrumbs(this.ar.root);

        // Home + crumbs
        this.navigationList = crumbs;

        const last = crumbs[crumbs.length - 1];
        if (last) this.titleService.setTitle('Building Manager | ' + last.title  );
      }
    });
  }

  filterNavigation(navItems: NavigationItem[], activeLink: string): titleType | null {
    for (const navItem of navItems) {
      if (navItem.type === 'item' && 'url' in navItem && navItem.url === activeLink) {
        return {
          url: navItem.url || false,
          title: navItem.title,
          link: navItem.link,
          description: navItem.description,
          path: navItem.path,
          breadcrumbs: 'breadcrumbs' in navItem ? navItem.breadcrumbs : true,
          type: navItem.type
        };
      }
      if ((navItem.type === 'group' || navItem.type === 'collapse') && 'children' in navItem) {
        const activeItem = this.filterNavigation(navItem.children!, activeLink);
        if (activeItem) {
          return activeItem; // Return the child if found
        }
      }
    }
    return null; // Return null if no active item matches
  }

  private buildRouteBreadcrumbs(route: ActivatedRoute, url: string = '', crumbs: titleType[] = []): titleType[] {
    const children = route.children;

    if (!children || children.length === 0) return crumbs;

    for (const child of children) {
      const routeURL = child.snapshot.url.map((s) => s.path).join('/');
      const nextUrl = routeURL ? `${url}/${routeURL}` : url;

      const label = child.snapshot.data?.['breadcrumb'] as string | undefined;

      if (label) {
        crumbs.push({
          url: nextUrl || false,
          title: label,
          breadcrumbs: true,
          type: 'item'
        });
      }

      return this.buildRouteBreadcrumbs(child, nextUrl, crumbs);
    }

    return crumbs;
  }
}
