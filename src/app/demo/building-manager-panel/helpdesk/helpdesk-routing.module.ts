import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from 'src/app/theme/shared/components/_helpers/role';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./helpdesk-dashboard/helpdesk-dashboard.component').then((c) => c.HelpdeskDashboardComponent),
        data: {
          role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'ticket',
        loadChildren: () => import('./helpdesk-ticket/helpdesk-ticket.module').then((m) => m.HelpdeskTicketModule),
        data: {
          role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'customer',
        loadComponent: () => import('./helpdesk-customer/helpdesk-customer.component').then((c) => c.HelpdeskCustomerComponent),
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
export class HelpdeskRoutingModule {}
