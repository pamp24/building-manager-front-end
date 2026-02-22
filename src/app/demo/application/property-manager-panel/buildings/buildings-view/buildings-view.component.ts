import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { BuildingComponent } from 'src/app/demo/application/user/account-profile/building/building.component';
import { RoleComponent } from 'src/app/demo/application/user/account-profile/role/role.component';
import { UserCardComponent } from 'src/app/demo/application/user/user-card/user-card.component';
import { AccountSettingComponent } from 'src/app/demo/application/user/account-profile/account-setting/account-setting.component';

@Component({
  selector: 'app-buildings-view',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    SharedModule,
    BuildingComponent,
    RoleComponent,
    UserCardComponent,
    AccountSettingComponent,],
  templateUrl: './buildings-view.component.html',
  styleUrl: './buildings-view.component.scss'
})
export class BuildingsViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private buildingService = inject(BuildingService);

  activeTab = 1;
  loading = false;
  error?: string;
  buildingId!: number;
  hasCompany = false;

  building?: BuildingDTO;

  ngOnInit(): void {
    this.buildingId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.buildingId || Number.isNaN(this.buildingId)) {
      this.loading = false;
      this.error = 'Μη έγκυρο building id.';
      return;
    }

    this.loadBuilding();
  }

  loadBuilding(): void {
    this.loading = true;
    this.error = undefined;

    this.buildingService.getBuilding(this.buildingId).subscribe({
      next: (b) => {
        this.building = b;
        this.hasCompany = !!b.company;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = 'Αποτυχία φόρτωσης πολυκατοικίας.';
      }
    });
  }

  onCompanyPresenceChange(v: boolean) {
  this.hasCompany = v;
}
}
