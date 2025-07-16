// Angular Imports
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminLayoutComponent } from './theme/layout/admin-layout/admin-layout.component';
import { GuestLayouts } from './theme/layout/guest-layout/guest-layout.component';
import { AuthGuardChild } from './theme/shared/components/_helpers/auth.guard';
import { SimpleLayouts } from './theme/layout/simple-layout/simple-layout.component';
import { Role } from './theme/shared/components/_helpers/role';

const routes: Routes = [
  {
    path: '',
    component: GuestLayouts,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./demo/pages/landing/landing.component').then((c) => c.LandingComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./demo/pages/authentication/auth-login/auth-login.component').then((c) => c.AuthLoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./demo/pages/authentication/auth-register/auth-register.component').then((c) => c.AuthRegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./demo/pages/authentication/forgot-password/forgot-password.component').then((c) => c.ForgotPasswordComponent)
      },
      {
        path: 'auth',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule),
        data: {}
      },
      {
        path: 'code-verify',
        loadComponent: () => import('./demo/pages/authentication/code-verify/code-verify.component').then((c) => c.CodeVerifyComponent)
      },
      {
        path: 'maintenance',
        canActivateChild: [AuthGuardChild],
        loadChildren: () => import('./demo/pages/maintenance/maintenance.module').then((m) => m.MaintenanceModule),
        data: {
          role  : ['Admin', 'User']
        }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivateChild: [AuthGuardChild],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./demo/dashboard/dashboard.module').then((m) => m.DashboardModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'widget/statistics',
        loadComponent: () => import('./demo/widget/statistics/statistics.component').then((c) => c.StatisticsComponent),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'widget/data',
        loadComponent: () => import('./demo/widget/widget-data/widget-data.component').then((c) => c.WidgetDataComponent),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'widget/chart',
        loadComponent: () => import('./demo/widget/widget-chart/widget-chart.component').then((c) => c.WidgetChartComponent),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'online-course',
        loadChildren: () => import('./demo/admin-panel/online-courses/online-courses.module').then((m) => m.OnlineCoursesModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'membership',
        loadChildren: () => import('./demo/admin-panel/membership/membership.module').then((m) => m.MembershipModule),
        data: {
          role: [Role.Admin, Role.User]
        }
      },
      {
        path: 'helpdesk',
        loadChildren: () => import('./demo/admin-panel/helpdesk/helpdesk.module').then((m) => m.HelpdeskModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident] 
        }
      },
      {
        path: 'invoice',
        loadChildren: () => import('./demo/admin-panel/invoice/invoice.module').then((m) => m.InvoiceModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'layout',
        loadChildren: () => import('./demo/layouts/layouts.module').then((m) => m.LayoutsModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'chat',
        loadComponent: () => import('./demo/application/chat/chat.component').then((c) => c.ChatComponent),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'calendar',
        loadChildren: () => import('./demo/application/calender/calender.module').then((m) => m.CalenderModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'user',
        loadChildren: () => import('./demo/application/user/user.module').then((m) => m.UserModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'customer',
        loadChildren: () => import('./demo/application/customer/customer.module').then((m) => m.CustomerModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'e-commerce',
        loadChildren: () => import('./demo/application/e-commerce/e-commerce.module').then((m) => m.ECommerceModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'form',
        loadChildren: () => import('./demo/forms/forms-elements/forms-elements.module').then((m) => m.FormsElementsModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'form-plugin',
        loadChildren: () => import('./demo/forms/forms-plugins/forms-plugins.module').then((m) => m.FormsPluginsModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'editor',
        loadChildren: () => import('./demo/forms/text-editors/text-editors.module').then((m) => m.TextEditorsModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'form-layouts',
        loadChildren: () => import('./demo/forms/forms-layouts/forms-layouts.module').then((m) => m.FormsLayoutsModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'file-upload',
        loadChildren: () => import('./demo/forms/file-upload/file-upload.module').then((m) => m.FileUploadModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'form/form-validator',
        loadComponent: () => import('./demo/forms/forms-validator/forms-validator.component'),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'images-cropper',
        loadComponent: () => import('./demo/forms/image-cropper/image-cropper.component').then((c) => c.ImageCropperComponent),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'bootstrap-table',
        loadChildren: () => import('./demo/table/bootstrap-table/bootstrap-table.module').then((m) => m.BootstrapTableModule),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      // {
      //   path: 'data-table',
      //   loadComponent: () => import('./demo/table/tbl-datatable/tbl-datatable.component').then((c) => c.TblDatatableComponent),
      //   data: {
      //     role: [Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
      //   }
      // },
      {
        path: 'apex-chart',
        loadComponent: () => import('./demo/chart/apex-chart/apex-chart.component').then((c) => c.ApexChartComponent),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'price',
        loadComponent: () => import('./demo/pages/price/price.component').then((c) => c.PriceComponent),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/others/sample-page/sample-page.component').then((c) => c.SamplePageComponent),
        data: {
          role: [ Role.Admin, Role.User, Role.PropertyManager, Role.BuildingManager, Role.Owner, Role.Resident]
        }
      }
    ]
  },
  {
    path: '',
    component: SimpleLayouts,
    children: [
      {
        path: 'components',
        loadChildren: () => import('./theme/layout/simple-layout/com-navigation/com-navigation.module').then((m) => m.ComNavigationModule)
      },
      {
        path: 'contact-us',
        canActivateChild: [AuthGuardChild],
        loadComponent: () => import('./demo/pages/contact-us/contact-us.component').then((c) => c.ContactUsComponent)
      }
    ]
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./demo/pages/maintenance/unauthorize-error/unauthorize-error.component').then((c) => c.UnauthorizeErrorComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./demo/pages/maintenance/error/error.component').then((c) => c.ErrorComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
