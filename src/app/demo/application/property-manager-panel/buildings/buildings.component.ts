// angular import
import { Component, inject, OnInit } from '@angular/core';
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
  imports: [SharedModule, RouterModule],
  templateUrl: './buildings.component.html',
  styleUrl: './buildings.component.scss'
})
export class BuildingsViewComponent implements OnInit {
  private iconService = inject(IconService);

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

    this.buildingService.getMyCompanyBuildings().subscribe({
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
  
