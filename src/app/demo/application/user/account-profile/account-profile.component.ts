// angular import
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { CompanyComponent } from './company/company.component';
import { ApartmentComponent } from './apartment/apartment.component';
import { BuildingComponent } from './building/building.component';
import { RoleComponent } from './role/role.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';

// icons
import { IconService } from '@ant-design/icons-angular';
import { ContainerOutline, FileTextOutline, LockOutline, SettingOutline, TeamOutline, UserOutline } from '@ant-design/icons-angular/icons';
import { AuthenticationService } from '../../../../theme/shared/service/authentication.service';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-account-profile',
  imports: [
    CommonModule,
    BuildingComponent,
    ApartmentComponent,
    CompanyComponent,
    RoleComponent,
    AccountSettingComponent,
    SharedModule,
    UserCardComponent
  ],
  templateUrl: './account-profile.component.html',
  styleUrl: './account-profile.component.scss'
})
export class AccountProfileComponent {
  hasCompany = false;
  activeTab = 2;
  private iconService = inject(IconService);

  // constructor
  constructor(private authService: AuthenticationService) {
    this.iconService.addIcon(...[UserOutline, FileTextOutline, ContainerOutline, LockOutline, TeamOutline, SettingOutline]);
  }

  hasRole(role: string): boolean {
    return this.authService.currentUserValue?.role === role;
  }

  onCompanyPresenceChange(has: boolean) {
    this.hasCompany = has;

    // αν μπήκε εταιρία και ήμουν στο Διαμέρισμα, γύρνα σε Πολυκατοικία
    if (has && this.activeTab === 3) {
      this.activeTab = 2;
    }

    // αν δεν έχει εταιρία και ήμουν στο tab εταιρίας, γύρνα σε Πολυκατοικία
    if (!has && this.activeTab === 1) {
      this.activeTab = 2;
    }
  }
}
