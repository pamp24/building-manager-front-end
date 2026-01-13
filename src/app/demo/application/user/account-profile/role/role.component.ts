/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MemberEditModalComponent } from './member-edit-modal/member-edit-modal.component';
import { ConfirmDeleteModalComponent } from './confirm-delete-modal/confirm-delete-modal.component';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, SharedModule, NgbDropdownModule],
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
  buildings: BuildingDTO[] = [];
  selectedBuildingIndex = 0;

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
    private modal: NgbModal,
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
          return;
        }

        this.buildings = buildings;
        this.selectedBuildingIndex = 0;
        this.onBuildingChange();
      },
      error: () => {
        this.messageBuildings = 'Σφάλμα φόρτωσης πολυκατοικιών.';
      }
    });
  }
  onBuildingChange(): void {
    const building = this.buildings[this.selectedBuildingIndex];
    if (!building) return;

    this.currentBuildingId = building.id;

    this.buildingName = building.name;
    this.buildingAddress = `${building.street1} ${building.stNumber1}, ${building.city}`;

    localStorage.setItem('buildingId', building.id.toString());

    this.loadMembers(building.id);
    this.loadApartments(building.id);
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
      case 'User':
        return 'Χρήστης';
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
      case 'PENDING_APARTMENT':
        return 'Αναμονή για ανάθεση διαμερίσματος';
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

  openEditModal(member: any): void {
    const ref = this.modal.open(MemberEditModalComponent, { centered: true, backdrop: 'static' });

    ref.componentInstance.member = member;
    ref.componentInstance.filteredApartments = this.filteredApartments;

    ref.componentInstance.roleChanged.subscribe((role: 'Owner' | 'Resident' | '') => {
      this.roleToInvite = role;
      this.onRoleChange();
      ref.componentInstance.filteredApartments = this.filteredApartments;
    });

    ref.result.then(
      (result) => {
        if (result?.saved) {
          const role = result.role as 'Owner' | 'Resident';
          const apartmentId = Number(result.apartmentId);

          this.buildingMemberService.assignApartment(member.id, role, apartmentId).subscribe({
            next: () => {
              // refresh members + apartments
              this.loadMembers(this.currentBuildingId!);
              this.loadApartments(this.currentBuildingId!);
            },
            error: (err) => console.error('Assign failed', err)
          });
        }
      },
      () => {}
    );
  }

  openDeleteModal(member: any): void {
    const ref = this.modal.open(ConfirmDeleteModalComponent, { centered: true });

    ref.componentInstance.title = 'Διαγραφή μέλους';
    ref.componentInstance.message = `Θέλεις σίγουρα να διαγράψεις τον χρήστη ${member.fullName || member.email};`;

    ref.result.then(
      (result) => {
        if (result === 'confirm') {
          this.buildingMemberService.deleteMember(member.id).subscribe({
            next: () => {
              this.loadMembers(this.currentBuildingId!);
              this.loadApartments(this.currentBuildingId!);
            },
            error: (err) => console.error('Delete failed', err)
          });
        }
      },
      () => {}
    );
  }
}
