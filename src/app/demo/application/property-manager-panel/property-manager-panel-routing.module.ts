// angular imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// project import
import { Role } from 'src/app/theme/shared/components/_helpers/role';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pm-dashboard',
        loadComponent: () => import('./pm-dashboard/pm-dashboard.component').then((c) => c.PmDashboardComponent),
        data: { role: [Role.Admin, Role.PropertyManager] }
      },
      {
        path: 'buildings',
        loadComponent: () => import('./buildings/buildings.component').then((c) => c.BuildingsViewComponent),
        data: { role: [Role.Admin, Role.PropertyManager] }
      },
      {
        path: 'buildings/:id',
        loadComponent: () => import('./buildings/buildings-view/buildings-view.component').then((c) => c.BuildingsViewComponent),
        data: { role: [Role.Admin, Role.PropertyManager] }
      },
      {
        path: 'add',
        loadComponent: () => import('./buildings/buildings-add/buildings-add.component').then((c) => c.BuildingsAddComponent),
        data: {
          role: [Role.Admin, Role.PropertyManager],
          breadcrumb: 'Δημιουργία Νέας Πολυκατοικίας'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyManagerPanelRoutingModule {}
