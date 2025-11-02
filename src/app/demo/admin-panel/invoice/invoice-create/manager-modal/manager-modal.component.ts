import { Component, effect, inject, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';
import { BuildingService } from '../../../../../theme/shared/service/building.service';
import { ManagedBuildingDTO } from '../../../../../theme/shared/models/managedBuildingDTO';

@Component({
  selector: 'app-manager-modal',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './manager-modal.component.html',
  styleUrls: ['./manager-modal.component.scss']
})
export class ManagerModalComponent implements OnInit {
  @Input() buildings: ManagedBuildingDTO[] = [];
  activeModal = inject(NgbActiveModal);
  themeService = inject(ThemeService);
  addressList: ManagedBuildingDTO[] = [];
  selectedBuilding: ManagedBuildingDTO | null = null;
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

  saveSelection() {
    if (!this.selectedBuilding || !this.selectedBuilding.id) {
      alert('Παρακαλώ επιλέξτε μία πολυκατοικία πριν συνεχίσετε.');
      return;
    }

    const active = document.activeElement as HTMLElement;
    if (active) active.blur();

    this.activeModal.close(this.selectedBuilding);
  }

  cancel() {
    const active = document.activeElement as HTMLElement;
    if (active) active.blur();
    this.activeModal.dismiss();
  }

  private isRtlTheme(isRtl: boolean) {
    this.isRtlMode = isRtl;
  }
}
