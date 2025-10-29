// angular import
import { Component, effect, inject } from '@angular/core';

// bootstrap import
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { BuildingService } from '../../../../../theme/shared/service/building.service';
import { ManagedBuildingDTO } from '../../../../../theme/shared/models/managedBuildingDTO';

@Component({
  selector: 'app-manager-modal',
  imports: [SharedModule],
  templateUrl: './manager-modal.component.html',
  styleUrl: './manager-modal.component.scss'
})
export class ManagerModalComponent implements OnInit {
  // public props
  @Input() buildings: ManagedBuildingDTO[] = [];
  activeModal = inject(NgbActiveModal);
  themeService = inject(ThemeService);
  addressList: ManagedBuildingDTO[] = [];
  selectedBuilding: ManagedBuildingDTO | null = null;
  isCollapsed = false;
  multiCollapsed = true;
  isRtlMode!: boolean;

  constructor(private buildingService: BuildingService) {
    effect(() => {
      this.isRtlTheme(this.themeService.isRTLMode());
    });
  }
  ngOnInit(): void {
    this.buildingService.getMyManagedBuildings().subscribe({
      next: (data) => (this.addressList = data),
      error: (err) => console.error('Σφάλμα φόρτωσης πολυκατοικιών', err)
    });
  }

  choose(building: ManagedBuildingDTO) {
    this.activeModal.close(building); //όλο το object
  }

  // public method
  close() {
    this.activeModal.close('Send data');
  }
  cancel() {
    this.activeModal.dismiss();
  }

  private isRtlTheme(isRtl: boolean) {
    this.isRtlMode = isRtl;
  }

}
