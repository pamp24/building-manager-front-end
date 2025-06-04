// project import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// project import
import { Role } from 'src/app/theme/shared/components/_helpers/role';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'product',
        loadComponent: () => import('./product/product.component').then((c) => c.ProductComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'product-details',
        loadComponent: () => import('./product-details/product-details.component').then((c) => c.ProductDetailsComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'product-list',
        loadComponent: () => import('./product-list/product-list.component').then((c) => c.ProductListComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'new-product',
        loadComponent: () => import('./new-product/new-product.component').then((c) => c.NewProductComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      },
      {
        path: 'checkout',
        loadComponent: () => import('./checkout/checkout.component').then((c) => c.CheckoutComponent),
        data: {
          roles: [Role.Admin, Role.User]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ECommerceRoutingModule {}
