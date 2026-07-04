import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IconService } from '@ant-design/icons-angular';
import { EyeOutline } from '@ant-design/icons-angular/icons';

import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-admin-buildings',
  standalone: true,
  imports: [SharedModule, RouterModule, FormsModule],
  templateUrl: './admin-buildings.component.html',
  styleUrl: './admin-buildings.component.scss'
})
export class AdminBuildingsComponent implements OnInit {
  private iconService = inject(IconService);

  buildings: BuildingDTO[] = [];
  searchTerm = '';
  selectedCountry = '';
  selectedRegion = '';
  selectedCity = '';
  selectedAssignment = '';
  showFilters = false;
  loading = true;
  error?: string;

  constructor(private buildingService: BuildingService) {
    this.iconService.addIcon(...[EyeOutline]);
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = undefined;

    this.buildingService.getAllBuildingsForAdmin().subscribe({
      next: (data) => {
        this.buildings = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = 'Αποτυχία φόρτωσης όλων των πολυκατοικιών.';
      }
    });
  }

  get filteredBuildings(): BuildingDTO[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.buildings.filter((building) => {
      const matchesSearch =
        !search ||
        [
          building.name,
          building.buildingCode,
          building.city,
          building.region,
          building.country,
          building.street1,
          building.stNumber1,
          building.managerFullName,
          building.company?.companyName
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(search));

      const matchesCountry = !this.selectedCountry || building.country === this.selectedCountry;
      const matchesRegion = !this.selectedRegion || building.region === this.selectedRegion;
      const matchesCity = !this.selectedCity || building.city === this.selectedCity;
      const matchesAssignment =
        !this.selectedAssignment ||
        (this.selectedAssignment === 'with-manager' && !!building.managerFullName) ||
        (this.selectedAssignment === 'without-manager' && !building.managerFullName) ||
        (this.selectedAssignment === 'with-company' && !!building.company?.companyName) ||
        (this.selectedAssignment === 'without-company' && !building.company?.companyName);

      return matchesSearch && matchesCountry && matchesRegion && matchesCity && matchesAssignment;
    });
  }

  get availableCountries(): string[] {
    return this.getUniqueValues(this.buildings.map((building) => building.country));
  }

  get availableRegions(): string[] {
    return this.getUniqueValues(
      this.buildings
        .filter((building) => !this.selectedCountry || building.country === this.selectedCountry)
        .map((building) => building.region)
    );
  }

  get availableCities(): string[] {
    return this.getUniqueValues(
      this.buildings
        .filter((building) => !this.selectedCountry || building.country === this.selectedCountry)
        .filter((building) => !this.selectedRegion || building.region === this.selectedRegion)
        .map((building) => building.city)
    );
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onCountryChange(): void {
    this.selectedRegion = '';
    this.selectedCity = '';
  }

  onRegionChange(): void {
    this.selectedCity = '';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCountry = '';
    this.selectedRegion = '';
    this.selectedCity = '';
    this.selectedAssignment = '';
  }

  private getUniqueValues(values: Array<string | undefined>): string[] {
    return [...new Set(values.filter((value): value is string => !!value?.trim()))].sort((a, b) => a.localeCompare(b));
  }

  trackById = (_: number, building: BuildingDTO) => building.id;
}
