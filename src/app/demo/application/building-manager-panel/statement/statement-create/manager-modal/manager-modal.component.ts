import { Component, effect, inject, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ThemeService } from 'src/app/theme/shared/service/customs-theme.service';
import { ManagedBuildingDTO } from '../../statement-list/building-selector-inline/building-selector-inline.component';
import { BuildingService } from 'src/app/theme/shared/service/building.service';

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
  userRole: string | null = null;
  
  constructor(private buildingService: BuildingService) {
    effect(() => {
      this.isRtlTheme(this.themeService.isRTLMode());
    });
  }

  ngOnInit(): void {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    const parsed = JSON.parse(currentUser);
    this.userRole = parsed.role;
  }

  if (this.userRole === 'PropertyManager') {
    this.buildingService.getMyCompanyBuildings().subscribe({
      next: (data) => {
        this.addressList = data as unknown as ManagedBuildingDTO[];
      },
      error: (err: unknown) => {
        console.error('Σφάλμα φόρτωσης πολυκατοικιών', err);
      }
    });
  } else {
    this.buildingService.getMyManagedBuildings().subscribe({
      next: (data: ManagedBuildingDTO[]) => {
        this.addressList = data;
      },
      error: (err: unknown) => {
        console.error('Σφάλμα φόρτωσης πολυκατοικιών', err);
      }
    });
  }
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
