import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from 'src/app/theme/shared/components/_helpers/role';

const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./admin-dashboard-panel/admin-dashboard.component').then((c) => c.AdminDashboardComponent),
    data: { role: [Role.Admin] }
  },
  {
    path: 'finance',
    loadComponent: () =>
      import('./admin-finance-panel/admin-finance-panel.component').then((c) => c.AdminFinancePanelComponent),
    data: { role: [Role.Admin] }
  },
  {
    path: 'buildings',
    loadComponent: () =>
      import('./admin-buildings-panel/admin-buildings.component').then((c) => c.AdminBuildingsComponent),
    data: { role: [Role.Admin] }
  },
  {
    path: 'buildings/:id',
    loadComponent: () =>
      import('../property-manager-panel/buildings/buildings-view/buildings-view.component').then((c) => c.BuildingsViewComponent),
    data: { role: [Role.Admin] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardPanelRoutingModule {}
