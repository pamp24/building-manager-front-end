import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/theme/shared/shared.module';

import { ProfessionalService } from 'src/app/theme/shared/service/professional.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfessionalRegisterModalComponent } from '../professional-register-modal/professional-register-modal.component';
import { ProfessionalBusinessDTO, ProfessionalCategory } from 'src/app/theme/shared/models/professional.model';
import { ProfessionalDetailsModalComponent } from '../professional-details-modal/professional-details-modal.component';
import { ProfessionalFavoriteService } from 'src/app/theme/shared/service/professional-favorite.service';
import { UserService } from '../../../../theme/shared/service/user.service';

@Component({
  selector: 'app-professionals',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './professionals.component.html',
  styleUrls: ['./professionals.component.scss']
})
export class ProfessionalsComponent implements OnInit {
  professionals: ProfessionalBusinessDTO[] = [];

  loading = false;

  selectedCategory: ProfessionalCategory | '' = '';
  city = '';
  favoriteProfessionalIds: number[] = [];

  readonly backendUrl = 'http://localhost:8080/api/v1';

  categories = [
    { value: 'ELECTRICIAN', label: 'Ηλεκτρολόγος' },
    { value: 'PLUMBER', label: 'Υδραυλικός' },
    { value: 'ELEVATOR_TECHNICIAN', label: 'Τεχνικός Ασανσέρ' },
    { value: 'CLEANING_SERVICE', label: 'Καθαρισμός' },
    { value: 'HEATING_TECHNICIAN', label: 'Θέρμανση' },
    { value: 'LOCKSMITH', label: 'Κλειδαράς' },
    { value: 'AIR_CONDITION_TECHNICIAN', label: 'Κλιματισμός' },
    { value: 'PAINTER', label: 'Ελαιοχρωματιστής' },
    { value: 'PEST_CONTROL', label: 'Απεντομώσεις' },
    { value: 'GENERAL_REPAIRS', label: 'Γενικές Επισκευές' },
    { value: 'OTHER', label: 'Άλλο' }
  ];

  selectedRegion = '';
  availableCities: string[] = [];

  greekRegions = [
    { region: 'Αττική', cities: ['Αθήνα'] },
    { region: 'Θεσσαλονίκη', cities: ['Θεσσαλονίκη'] },
    { region: 'Αχαΐα', cities: ['Πάτρα'] },
    { region: 'Ηράκλειο', cities: ['Ηράκλειο'] },
    { region: 'Λάρισα', cities: ['Λάρισα'] },
    { region: 'Μαγνησία', cities: ['Βόλος'] },
    { region: 'Ιωάννινα', cities: ['Ιωάννινα'] },
    { region: 'Έβρος', cities: ['Αλεξανδρούπολη'] },
    { region: 'Καβάλα', cities: ['Καβάλα'] },
    { region: 'Σέρρες', cities: ['Σέρρες'] },
    { region: 'Κοζάνη', cities: ['Κοζάνη'] },
    { region: 'Τρίκαλα', cities: ['Τρίκαλα'] },
    { region: 'Καρδίτσα', cities: ['Καρδίτσα'] },
    { region: 'Φθιώτιδα', cities: ['Λαμία'] },
    { region: 'Εύβοια', cities: ['Χαλκίδα'] },
    { region: 'Βοιωτία', cities: ['Λιβαδειά'] },
    { region: 'Κορινθία', cities: ['Κόρινθος'] },
    { region: 'Αργολίδα', cities: ['Ναύπλιο'] },
    { region: 'Αρκαδία', cities: ['Τρίπολη'] },
    { region: 'Μεσσηνία', cities: ['Καλαμάτα'] },
    { region: 'Λακωνία', cities: ['Σπάρτη'] },
    { region: 'Χανιά', cities: ['Χανιά'] },
    { region: 'Ρέθυμνο', cities: ['Ρέθυμνο'] },
    { region: 'Λασίθι', cities: ['Άγιος Νικόλαος'] },
    { region: 'Δωδεκάνησα', cities: ['Ρόδος'] },
    { region: 'Κυκλάδες', cities: ['Ερμούπολη'] },
    { region: 'Λέσβος', cities: ['Μυτιλήνη'] },
    { region: 'Χίος', cities: ['Χίος'] },
    { region: 'Σάμος', cities: ['Σάμος'] },
    { region: 'Κέρκυρα', cities: ['Κέρκυρα'] },
    { region: 'Ζάκυνθος', cities: ['Ζάκυνθος'] },
    { region: 'Κεφαλονιά', cities: ['Αργοστόλι'] }
  ];

  onRegionChange(): void {
    const match = this.greekRegions.find((r) => r.region === this.selectedRegion);

    this.availableCities = match?.cities ?? [];
    this.city = '';
  }

  constructor(
    private professionalService: ProfessionalService,
    private favoriteService: ProfessionalFavoriteService,
    private modal: NgbModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadProfessionals();
    this.loadFavorites();

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.showOnlyFavorites = user?.professionalsFavoritesOnly || false;
      },
      error: () => {
        this.showOnlyFavorites = false;
      }
    });
  }

  loadProfessionals(): void {
    this.loading = true;

    this.professionalService.search(this.selectedCategory || undefined, this.city || undefined).subscribe({
      next: (response) => {
        this.professionals = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.city = '';
    this.selectedRegion = '';
    this.availableCities = [];
    this.loadProfessionals();
  }

  getCategoryLabel(category: string): string {
    return this.categories.find((c) => c.value === category)?.label || category;
  }

  openRegisterModal(): void {
    const modalRef = this.modal.open(ProfessionalRegisterModalComponent, {
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.componentInstance.created.subscribe(() => {
      this.loadProfessionals();
    });
  }

  openDetailsModal(professional: ProfessionalBusinessDTO): void {
    const modalRef = this.modal.open(ProfessionalDetailsModalComponent, {
      size: 'lg',
      centered: true,
      scrollable: true
    });

    modalRef.componentInstance.professional = professional;

    modalRef.result.finally(() => {
      this.loadProfessionals();
    });
  }

  loadFavorites(): void {
    this.favoriteService.getMyFavorites().subscribe({
      next: (favorites) => {
        this.favoriteProfessionalIds = favorites.map((f) => f.id);
      }
    });
  }
  isFavorite(professionalId: number): boolean {
    return this.favoriteProfessionalIds.includes(professionalId);
  }
  toggleFavorite(professionalId: number): void {
    if (this.isFavorite(professionalId)) {
      this.favoriteService.removeFavorite(professionalId).subscribe(() => {
        this.favoriteProfessionalIds = this.favoriteProfessionalIds.filter((id) => id !== professionalId);
      });

      return;
    }

    this.favoriteService.addFavorite(professionalId).subscribe(() => {
      this.favoriteProfessionalIds.push(professionalId);
    });
  }

  showOnlyFavorites = false;

  toggleFavoriteFilter(): void {
    const nextValue = !this.showOnlyFavorites;

    this.showOnlyFavorites = nextValue;

    this.userService.updateProfessionalsFavoritesOnly(nextValue).subscribe({
      error: () => {
        this.showOnlyFavorites = !nextValue;
      }
    });
  }

  getProfessionalImageUrl(professional: ProfessionalBusinessDTO): string {
    if (!professional.primaryImageUrl) {
      return 'assets/images/admin/img-course-1.png';
    }

    if (professional.primaryImageUrl.startsWith('http')) {
      return professional.primaryImageUrl;
    }

    return `${this.backendUrl}${professional.primaryImageUrl}`;
  }

  get visibleProfessionals(): ProfessionalBusinessDTO[] {
    if (!this.showOnlyFavorites) {
      return this.professionals;
    }

    return this.professionals.filter((p) => this.favoriteProfessionalIds.includes(p.id));
  }
}
