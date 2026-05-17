import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./professionals.component/professionals.component').then(
        (c) => c.ProfessionalsComponent
      )
  },
  {
    path: 'approval',
    loadComponent: () =>
      import('./professional-approval/professional-approval.component').then(
        (c) => c.ProfessionalApprovalComponent
      )
  },
  {
    path: 'manage/:id',
    loadComponent: () =>
      import('./professional-manage/professional-manage.component').then(
        (c) => c.ProfessionalManageComponent
      )
  },
  {
    path: 'my-businesses',
    loadComponent: () =>
      import('./my-professional-businesses/my-professional-businesses.component').then(
        (c) => c.MyProfessionalBusinessesComponent
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalsRoutingModule {}