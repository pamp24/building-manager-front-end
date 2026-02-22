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
        loadComponent: () => import('./statement-dashboard/statement-dashboard.component').then((c) => c.StatementDashboardComponent),
        data: {
          role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'create',
        loadComponent: () => import('./statement-create/statement-create.component').then((c) => c.StatementCreateComponent),
        data: {
          role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'details',
        loadComponent: () => import('./statement-details/statement-details.component').then((c) => c.StatementDetailsComponent),
        data: {
          role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'list',
        loadComponent: () => import('./statement-list/statement-list.component').then((c) => c.StatementListComponent),
        data: {
          role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./statement-edit/statement-edit.component').then((c) => c.StatementEditComponent),
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
export class InvoiceRoutingModule {}
