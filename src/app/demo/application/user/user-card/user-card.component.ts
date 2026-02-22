/* eslint-disable @typescript-eslint/no-explicit-any */
// angular import
import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CardPreviewComponent } from './card-preview/card-preview.component';

// icons
import { IconService } from '@ant-design/icons-angular';
import { ApartmentService } from '../../../../theme/shared/service/apartment.service';
import {
  EnvironmentOutline,
  LinkOutline,
  MailOutline,
  MoreOutline,
  PhoneOutline,
  PlusOutline,
  SearchOutline
} from '@ant-design/icons-angular/icons';
import { ApartmentDTO } from 'src/app/theme/shared/models/apartmentDTO';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewApartmentComponent } from './new-apartment/new-apartment.component';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-card',
  imports: [CommonModule, SharedModule, CardPreviewComponent, RouterModule],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  @Input() pmView = false;  

  private modalService = inject(NgbModal);
  private iconService = inject(IconService);
  selectedApartment: ApartmentDTO | null = null;
  private apartmentService!: ApartmentService;
  buildingName: string = '';
  buildingAddress: string = '';
  selectedBuildingIndex = 0;
  buildings: any[] = [];
  sortOption: string = 'default'; // προεπιλογή

  
  card_detail: any[] = [];
  currentUsedParking = 0;
  currentUsedStorages = 0;
  userRole: string | null = null;

  currentPage = 1;
  pageSize = 1;
  total = 0;
  messageApartments = '';
  // Constructor
  constructor(
    apartmentService: ApartmentService,
    private buildingService: BuildingService
  ) {
    this.apartmentService = apartmentService;
    this.iconService.addIcon(...[SearchOutline, PlusOutline, MoreOutline, MailOutline, PhoneOutline, EnvironmentOutline, LinkOutline]);
  }

  ngOnInit(): void {
    // Λήψη ρόλου χρήστη
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const parsed = JSON.parse(currentUser);
      this.userRole = parsed.role;
    }

    // 🔹 Βήμα 1: φέρνουμε τις πολυκατοικίες του χρήστη
    this.buildingService.getMyBuildings().subscribe({
      next: (buildings) => {
        this.buildings = buildings;

        if (buildings.length > 0) {
          this.selectedBuildingIndex = 0; // ✅ πρώτη πολυκατοικία
          this.onBuildingChange(); // ✅ φόρτωσε data
        }
      },
      error: (err) => console.error('Σφάλμα φόρτωσης πολυκατοικιών', err)
    });
  }
  //Βήμα 2: φόρτωση στοιχείων μίας πολυκατοικίας
  private loadBuildingData(buildingId: number) {
    this.buildingService.getBuilding(buildingId).subscribe({
      next: (building) => {
        this.buildingName = building.name;
        this.buildingAddress = `${building.street1} ${building.stNumber1}, ${building.city}`;

        // Φέρε τα διαμερίσματα του συγκεκριμένου building
        this.apartmentService.getApartmentsByBuilding(buildingId).subscribe({
          next: (data) => {
            this.card_detail = data.map((ap) => ({
              apartment: ap,
              name: ap.ownerLastName && ap.ownerFirstName ? `${ap.ownerLastName} ${ap.ownerFirstName}` : 'Άγνωστο Όνομα',
              position: `Διαμ. ${ap.number}, Όροφος ${ap.floor}`,
              src: 'assets/images/user/avatar-1.jpg',
              description: ap.apDescription || 'Δεν υπάρχει περιγραφή',
              email: ap.ownerEmail || 'Δεν είναι διαθέσιμο',
              phone: ap.ownerPhone || 'Δεν είναι διαθέσιμο',
              street: ap.ownerStreet || 'Δεν είναι διαθέσιμο',
              streetNumber: ap.ownerStreetNumber || 'Δεν είναι διαθέσιμο',
              buildingName: ap.buildingName || 'Δεν είναι διαθέσιμο',
              buildingStreet: ap.buildingStreet || 'Δεν είναι διαθέσιμο',
              buildingStreetNumber: ap.buildingStreetNumber || '',
              buildingCity: ap.buildingCity || 'Άγνωστη Πόλη',
              city: ap.ownerCity || 'Άγνωστη Πόλη',
              lastModifiedDate: ap.lastModifiedDate || 'Άγνωστη ημερομηνία',
              user_skill: [
                { skill: 'Χιλιοστά κοινοχρήστων: ' + ap.commonPercent },
                { skill: 'Χιλιοστά Ασανσέρ: ' + ap.elevatorPercent },
                { skill: 'Χιλιοστά Θέρμανσης: ' + ap.heatingPercent }
              ]
            }));

            //Αν δεν υπάρχουν καθόλου διαμερίσματα → εμφάνισε μήνυμα
            if (data.length === 0) {
              this.messageApartments = 'Δεν υπάρχουν ακόμα καταχωρημένα διαμερίσματα σε αυτήν την πολυκατοικία.';
            } else {
              this.messageApartments = '';
            }
          },
          error: (err) => {
            console.error('Σφάλμα φόρτωσης διαμερισμάτων:', err);
            this.messageApartments = 'Αποτυχία φόρτωσης διαμερισμάτων.';
          }
        });
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης πολυκατοικίας:', err);
      }
    });
  }

  onBuildingChange() {
  const selectedBuilding = this.buildings[this.selectedBuildingIndex];
  if (!selectedBuilding) return;

  // αποθήκευση αν τη χρειάζεσαι αλλού
  localStorage.setItem('buildingId', selectedBuilding.id);

  // αν θες να φορτώνεις και διαμερίσματα κ.λπ.
  this.loadBuildingData(selectedBuilding.id);
}

  // public method
  open(preview: any, card: any) {
    this.selectedApartment = card?.apartment ?? null;
    this.modalService.open(preview, { size: 'xl' });
  }

  sortCards() {
    if (this.sortOption === 'name') {
      this.card_detail.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'floorAsc') {
      this.card_detail.sort((a, b) => (a.apartment.floor || '').localeCompare(b.apartment.floor || ''));
    } else if (this.sortOption === 'floorDesc') {
      this.card_detail.sort((a, b) => (b.apartment.floor || '').localeCompare(a.apartment.floor || ''));
    }
  }

  openAddApartment() {
    const buildingId = Number(localStorage.getItem('buildingId'));
    if (!buildingId) {
      alert('Δεν μπορείτε να προσθέσετε νέο διαμέρισμα.\nΠρέπει πρώτα να τροποποιήσετε την πολυκατοικία.');
      return;
    }

    this.buildingService.getBuilding(buildingId).subscribe((building) => {
      const noParking = building.parkingSpacesNum > 0 && this.currentUsedParking >= building.parkingSpacesNum;
      const noStorage = building.storageNum > 0 && this.currentUsedStorages >= building.storageNum;

      if (noParking || noStorage) {
        alert('Πρέπει  να τροποποιήσετε την πολυκατοικία.');
        return;
      }

      // ανοίγει modal μόνο αν υπάρχει χώρος
      this.modalService.open(NewApartmentComponent, { size: 'lg' });
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.buildingService.getMyBuildings().subscribe((buildings) => {
      const selected = buildings[page - 1];
      if (selected) {
        this.loadBuildingData(selected.id);
        localStorage.setItem('buildingId', selected.id.toString());
      }
    });
  }
}
