// angular import
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { BulkBuildingsComponent } from './bulk-buildings.component';
import { RouterModule } from '@angular/router';

// icons
import { IconService } from '@ant-design/icons-angular';
import { EditOutline } from '@ant-design/icons-angular/icons';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { BuildingService } from 'src/app/theme/shared/service/building.service';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-buildings',
  imports: [SharedModule, RouterModule, BulkBuildingsComponent],
  templateUrl: './buildings.component.html',
  styleUrl: './buildings.component.scss'
})
export class BuildingsViewComponent implements OnInit {
  private iconService = inject(IconService);
  private modal = inject(NgbModal);
  private auth = inject(AuthenticationService);

  get isPropertyManager(): boolean { return this.auth.currentUserValue?.role === 'PropertyManager'; }
  bulkSending = false;
  bulkRefresh = false;
  openBulk(content: TemplateRef<unknown>): void {
    if (!this.isPropertyManager) return;
    this.bulkRefresh = false;
    this.bulkSending = false;
    const ref = this.modal.open(content, { size: 'lg', scrollable: true, beforeDismiss: () => !this.bulkSending });
    ref.result.then(() => { if (this.bulkRefresh) this.load(); }, () => { if (this.bulkRefresh) this.load(); });
  }

  buildings: BuildingDTO[] = [];
  loading = true;
  error?: string;

  constructor(private buildingService: BuildingService) {
    this.iconService.addIcon(...[EditOutline]);
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = undefined;

    this.buildingService.getMyBuildings().subscribe({
      next: (data) => {
        this.buildings = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = 'Αποτυχία φόρτωσης πολυκατοικιών εταιρίας.';
      }
    });
  }

  trackById = (_: number, b: BuildingDTO) => b.id;
}
  
