
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ManagedBuildingDTO {
  id: number;
  name: string;
  street1?: string;
  stNumber1?: string;
  city?: string;
}

@Component({
  selector: 'app-building-selector-inline',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './building-selector-inline.component.html',
  styleUrls: ['./building-selector-inline.component.scss']
})
export class BuildingSelectorInlineComponent {
  @Input() buildings: ManagedBuildingDTO[] = [];
  @Input() selectedIndex = 0;
  @Output() buildingSelected = new EventEmitter<number>();

  get currentBuilding(): ManagedBuildingDTO | undefined {
    return this.buildings?.[this.selectedIndex];
  }

  onBuildingChange(index: number) {
    this.selectedIndex = index;
    const selectedBuilding = this.buildings[index];
    if (selectedBuilding) {
      this.buildingSelected.emit(selectedBuilding.id);
    }
  }
}
