// Angular imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// project import
import { Role } from 'src/app/theme/shared/components/_helpers/role';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./membership-dashboard/membership-dashboard.component').then((c) => c.MembershipDashboardComponent),
        data: {
          role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'list',
        loadComponent: () => import('./membership-list/membership-list.component').then((c) => c.MembershipListComponent),
        data: {
          role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'price',
        loadComponent: () => import('./membership-price/membership-price.component').then((c) => c.MembershipPriceComponent),
        data: {
          role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'setting',
        loadComponent: () => import('./membership-setting/membership-setting.component').then((c) => c.MembershipSettingComponent),
        data: {
          role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembershipRoutingModule {}
