import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from 'src/app/theme/shared/components/_helpers/role';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./online-dashboard/online-dashboard.component').then((c) => c.OnlineDashboardComponent),
        data: {
          roles: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'teacher',
        loadChildren: () => import('./teacher/teacher.module').then((m) => m.TeacherModule),
        data: {
          roles: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'student',
        loadChildren: () => import('./student/student.module').then((m) => m.StudentModule),
        data: {
          roles: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'courses',
        loadChildren: () => import('./courses/courses.module').then((m) => m.CoursesModule),
        data: {
          roles: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'pricing',
        loadComponent: () => import('./pricing/pricing.component').then((c) => c.PricingComponent),
        data: {
          roles: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'site',
        loadComponent: () => import('./site/site.component').then((c) => c.SiteComponent),
        data: {
          roles: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'setting',
        loadChildren: () => import('./setting/setting.module').then((m) => m.SettingModule),
        data: {
          roles: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineCoursesRoutingModule {}
