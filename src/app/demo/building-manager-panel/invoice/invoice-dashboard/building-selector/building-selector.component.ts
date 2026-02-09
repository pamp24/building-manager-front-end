import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { ManagedBuildingDTO } from 'src/app/theme/shared/models/managedBuildingDTO';

@Component({
  selector: 'app-building-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './building-selector.component.html',
  styleUrl: './building-selector.component.scss'
})
export class BuildingSelectorComponent implements OnInit {
  private buildingService = inject(BuildingService);

  managedBuildings: ManagedBuildingDTO[] = [];
  currentBuildingIndex = 0;
  currentBuilding?: ManagedBuildingDTO;

  @Output() buildingSelected = new EventEmitter<number>();

  ngOnInit(): void {
    this.loadManagedBuildings();
  }

  private loadManagedBuildings(): void {
    this.buildingService.getMyManagedBuildings().subscribe({
      next: (buildings) => {
        this.managedBuildings = buildings;
        if (buildings.length > 0) {
          //Επιλογή πρώτης πολυκατοικίας
          this.setCurrentBuilding(0);

          //Εκπομπή του πρώτου building ID προς το parent
          this.buildingSelected.emit(buildings[0].id);
        }
      },
      error: (err) => console.error('Σφάλμα φόρτωσης πολυκατοικιών', err)
    });
  }

  setCurrentBuilding(index: number): void {
    this.currentBuildingIndex = index;
    this.currentBuilding = this.managedBuildings[index];
    if (this.currentBuilding) {
      this.buildingSelected.emit(this.currentBuilding.id);
    }
  }
}

