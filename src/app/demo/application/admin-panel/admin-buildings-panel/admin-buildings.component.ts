import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IconService } from '@ant-design/icons-angular';
import { EyeOutline, HomeOutline, UserOutline, TeamOutline } from '@ant-design/icons-angular/icons';

import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { environment } from 'src/environments/environment';

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
  selectedStatus = '';
  selectedCompanyId = '';
  selectedManager = '';
  selectedHeating = '';
  showFilters = false;
  loading = true;
  error?: string;

  readonly heatingTypes = [
    { value: 'OIL', label: 'Πετρέλαιο' },
    { value: 'NATURAL_GAS', label: 'Φυσικό Αέριο' },
    { value: 'ELECTRIC', label: 'Ηλεκτρικό' },
    { value: 'HEAT_PUMP', label: 'Αντλία Θερμότητας' },
    { value: 'NONE', label: 'Καθόλου θέρμανση' }
  ];

  constructor(private buildingService: BuildingService) {
    this.iconService.addIcon(...[EyeOutline, HomeOutline, UserOutline, TeamOutline]);
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

      const matchesStatus =
        !this.selectedStatus ||
        (this.selectedStatus === 'active' && building.active) ||
        (this.selectedStatus === 'inactive' && !building.active);

      const matchesCompany =
        !this.selectedCompanyId || building.company?.companyId === Number(this.selectedCompanyId);

      const matchesManager = !this.selectedManager || building.managerFullName === this.selectedManager;

      const matchesHeating =
        !this.selectedHeating ||
        (this.selectedHeating === 'NONE' && !building.heatingType) ||
        building.heatingType === this.selectedHeating;

      return matchesSearch && matchesCountry && matchesRegion && matchesCity && matchesAssignment && matchesStatus && matchesCompany && matchesManager && matchesHeating;
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

  get availableCompanies(): Array<{ id: number; name: string }> {
    return this.buildings
      .map((building) => building.company)
      .filter((company): company is NonNullable<typeof company> => !!company?.companyId)
      .map((company) => ({ id: company.companyId!, name: company.companyName }))
      .filter((company, index, self) => self.findIndex((item) => item.id === company.id) === index)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  get availableManagers(): string[] {
    return this.getUniqueValues(this.buildings.map((building) => building.managerFullName));
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
    this.selectedStatus = '';
    this.selectedCompanyId = '';
    this.selectedManager = '';
    this.selectedHeating = '';
  }

  imgSrc(url?: string): string {
    const fallback = 'assets/images/admin/img-course-1.png';
    if (!url) {
      return fallback;
    }

    const cleanUrl = url.trim().replace(/\\/g, '/');

    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }

    if (cleanUrl.startsWith('/uploads/')) {
      return `${environment.apiUrl}${cleanUrl}`;
    }

    if (cleanUrl.startsWith('uploads/')) {
      return `${environment.apiUrl}/${cleanUrl}`;
    }

    return cleanUrl;
  }

  toggleBuildingActive(building: BuildingDTO): void {
    const newValue = !building.active;
    const action = newValue ? 'Ενεργοποίηση' : 'Απενεργοποίηση';

    if (!confirm(`Είστε σίγουροι ότι θέλετε ${action.toLowerCase()} της πολυκατοικίας "${building.name}";`)) {
      return;
    }

    this.buildingService.setBuildingActive(building.id, newValue).subscribe({
      next: () => {
        building.active = newValue;
        building.enable = newValue;
      },
      error: (err) => {
        console.error(err);
        alert('Αποτυχία αλλαγής κατάστασης της πολυκατοικίας.');
      }
    });
  }

  softDeleteBuilding(building: BuildingDTO): void {
    if (!confirm(`Είστε σίγουροι ότι θέλετε να διαγράψετε (soft-delete) την πολυκατοικία "${building.name}";`)) {
      return;
    }

    this.buildingService.deleteBuilding(building.id).subscribe({
      next: () => {
        building.active = false;
        building.enable = false;
      },
      error: (err) => {
        console.error(err);
        alert('Αποτυχία διαγραφής της πολυκατοικίας.');
      }
    });
  }

  private getUniqueValues(values: Array<string | undefined>): string[] {
    return [...new Set(values.filter((value): value is string => !!value?.trim()))].sort((a, b) => a.localeCompare(b));
  }

  trackById = (_: number, building: BuildingDTO) => building.id;
}
