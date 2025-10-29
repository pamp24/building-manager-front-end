import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { BuildingMemberDTO } from 'src/app/theme/shared/models/BuildingMemberDTO';
import { BuildingMemberService } from 'src/app/theme/shared/service/buildingMember.service';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { UserService } from 'src/app/theme/shared/service';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';
import { ApartmentDTO } from 'src/app/theme/shared/models/apartmentDTO';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  members: BuildingMemberDTO[] = [];

  emailToInvite = '';
  isSending = false;
  roleToInvite: string = '';
  apartmentToInvite: number | null = null;
  apartmentFloor: string = '';

  apartments: BuildingDTO[] = [];
  floorOptions: string[] = [];
  buildingName = '';
  buildingAddress = '';
  currentPage = 1;
  total = 0;
  currentBuildingId: number | null = null;
  buildingApartments: ApartmentDTO[] = [];
  filteredApartments: ApartmentDTO[] = [];

  messageBuildings = '';
  messageMembers = '';
  messageApartments = '';

  constructor(
    private userService: UserService,
    private buildingService: BuildingService,
    private buildingMemberService: BuildingMemberService,
    private apartmentService: ApartmentService,
    @Inject(AuthenticationService) private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadMyBuildings();
  }

  private loadMyBuildings(): void {
    this.buildingService.getMyBuildings().subscribe({
      next: (buildings) => {
        if (!buildings || buildings.length === 0) {
          this.messageBuildings = 'Δεν έχετε ακόμα καταχωρημένες πολυκατοικίες.';
          this.apartments = [];
          this.members = [];
          this.buildingApartments = [];
          return;
        }

        this.apartments = buildings;
        this.total = buildings.length;
        this.messageBuildings = '';

        const first = this.apartments[0];
        this.currentPage = 1;
        this.loadBuilding(first.id);
        this.loadMembers(first.id);
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης πολυκατοικιών', err);
        this.messageBuildings = 'Παρουσιάστηκε σφάλμα κατά τη φόρτωση πολυκατοικιών.';
      }
    });
  }

  private loadMembers(buildingId: number): void {
    this.buildingMemberService.getMembersByBuilding(buildingId).subscribe({
      next: (data) => {
        this.members = data;
        this.currentBuildingId = buildingId;

        if (this.members.length === 0) {
          this.messageMembers = 'Δεν υπάρχουν μέλη για αυτήν την πολυκατοικία.';
        } else {
          this.messageMembers = '';
        }

        this.loadApartments(buildingId);
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης μελών', err);
        this.messageMembers = 'Αποτυχία φόρτωσης μελών.';
      }
    });
  }

  private loadBuilding(buildingId: number): void {
    this.buildingService.getBuilding(buildingId).subscribe({
      next: (building) => {
        this.buildingName = building.name;
        this.buildingAddress = `${building.street1} ${building.stNumber1}, ${building.city}`;
        this.floorOptions = this.generateFloors(building);
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης πολυκατοικίας:', err);
      }
    });
  }

  private loadApartments(buildingId: number): void {
    this.apartmentService.getApartmentsByBuilding(buildingId).subscribe({
      next: (data) => {
        this.buildingApartments = data;
        this.filteredApartments = [...data];

        if (data.length === 0) {
          this.messageApartments = 'Δεν υπάρχουν καταχωρημένα διαμερίσματα.';
        } else {
          this.messageApartments = '';
        }

        this.apartmentToInvite = null;
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης διαμερισμάτων:', err);
        this.messageApartments = 'Αποτυχία φόρτωσης διαμερισμάτων.';
      }
    });
  }

  private generateFloors(building: BuildingDTO): string[] {
    const result: string[] = [];
    if (building.undergroundFloorExist) result.push('Υπόγειο');
    result.push('Ισόγειο');
    if (building.halfFloorExist) result.push('Ημιώροφος');
    for (let i = 1; i <= building.floors; i++) result.push(`${i}ος`);
    if (building.overTopFloorExist) result.push('Δώμα');
    return result;
  }

  sendInvite(): void {
    if (!this.emailToInvite || !this.roleToInvite || !this.apartmentToInvite) {
      alert('Παρακαλώ συμπληρώστε όλα τα πεδία.');
      return;
    }

    this.isSending = true;
    const payload = {
      email: this.emailToInvite,
      role: this.roleToInvite as 'Resident' | 'Owner',
      apartmentId: this.apartmentToInvite
    };

    this.userService.inviteUserToBuilding(payload).subscribe({
      next: () => {
        alert('Η πρόσκληση στάλθηκε με επιτυχία!');
        this.resetInviteForm();
      },
      error: (err) => {
        alert(err.error?.message || 'Απέτυχε η αποστολή πρόσκλησης.');
        this.isSending = false;
      }
    });
  }

  private resetInviteForm(): void {
    this.emailToInvite = '';
    this.roleToInvite = '';
    this.apartmentToInvite = null;
    this.apartmentFloor = '';
    this.isSending = false;
  }

  getTranslatedRole(role: string): string {
    switch (role) {
      case 'Owner':
        return 'Ιδιοκτήτης';
      case 'Resident':
        return 'Ένοικος';
      case 'BuildingManager':
        return 'Διαχειριστής';
      case 'PropertyManager':
        return 'Εταιρία Διαχείρισης';
      default:
        return role;
    }
  }

  getTranslatedStatus(status: string): string {
    switch (status) {
      case 'Joined':
      case 'ACCEPTED':
        return 'Μέλος';
      case 'PENDING':
      case 'Invited':
        return 'Προσκεκλημένος';
      case 'EXPIRED':
        return 'Έληξε';
      case 'DECLINED':
        return 'Απορρίφθηκε';
      default:
        return status;
    }
  }

  canInvite(): boolean {
    if (!this.currentBuildingId) return false;
    const user = this.authService.currentUserValue;
    const me = this.members.find((m) => m.email === user?.email);
    return me?.role === 'BuildingManager' || me?.role === 'PropertyManager';
  }

  onRoleChange(): void {
    if (this.roleToInvite === 'Owner') {
      this.filteredApartments = this.buildingApartments.filter((ap) => !ap.ownerId);
    } else if (this.roleToInvite === 'Resident') {
      this.filteredApartments = this.buildingApartments.filter((ap) => !ap.residentId && ap.isRented);
    } else {
      this.filteredApartments = [];
    }
    this.apartmentToInvite = null;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    const selectedBuilding = this.apartments[page - 1];
    if (selectedBuilding) {
      this.loadBuilding(selectedBuilding.id);
      this.loadApartments(selectedBuilding.id);
      this.loadMembers(selectedBuilding.id);
      localStorage.setItem('buildingId', selectedBuilding.id.toString());
    }
  }
}
