/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, Inject, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { environment } from 'src/environments/environment';
import { BuildingService } from 'src/app/theme/shared/service/building.service';
import { BuildingDTO } from 'src/app/theme/shared/models/buildingDTO';
import { BuildingMemberDTO, MemberDisplayStatus } from 'src/app/theme/shared/models/BuildingMemberDTO';
import { BuildingMemberService } from 'src/app/theme/shared/service/buildingMember.service';
import { AuthenticationService } from 'src/app/theme/shared/service/authentication.service';
import { UserService } from 'src/app/theme/shared/service';
import { ApartmentService } from 'src/app/theme/shared/service/apartment.service';
import { ApartmentDTO } from 'src/app/theme/shared/models/apartmentDTO';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MemberEditModalComponent } from './member-edit-modal/member-edit-modal.component';
import { ConfirmDeleteModalComponent } from './confirm-delete-modal/confirm-delete-modal.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, SharedModule, NgbDropdownModule, RouterModule],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, OnChanges {
  @Input() pmView = false;
  @Input() buildingId?: number;
  apiBase = `${environment.apiUrl}/api/v1`;
  profileImageUrl?: string | null;
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

  private get currentBuilding(): BuildingDTO | undefined {
    return this.buildings.find((building) => building.id === this.currentBuildingId);
  }

  constructor(
    private userService: UserService,
    private buildingService: BuildingService,
    private buildingMemberService: BuildingMemberService,
    private apartmentService: ApartmentService,
    private modal: NgbModal,
    @Inject(AuthenticationService) private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    if (this.pmView && this.buildingId) {
      this.loadSelectedBuildingForPm(this.buildingId);
      return;
    }

    this.loadMyBuildings();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.pmView && changes['buildingId'] && this.buildingId) {
      this.loadSelectedBuildingForPm(this.buildingId);
    }
  }

  private loadSelectedBuildingForPm(buildingId: number): void {
    this.buildingService.getBuilding(buildingId).subscribe({
      next: (building) => {
        this.buildings = [building];
        this.selectedBuildingIndex = 0;
        this.currentBuildingId = building.id;
        this.buildingName = building.name;
        this.buildingAddress = `${building.street1} ${building.stNumber1}, ${building.city}`;

        localStorage.setItem('buildingId', building.id.toString());

        this.loadMembers(building.id);
        this.loadApartments(building.id);
      },
      error: (err) => {
        console.error('Σφάλμα φόρτωσης πολυκατοικίας για PM:', err);
        this.messageBuildings = 'Αποτυχία φόρτωσης πολυκατοικίας.';
      }
    });
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
        this.members = data
          .filter((member) => member.status !== 'REMOVED' && member.status !== 'LEFT')
          .map((member) => this.withResolvedApartment(member));

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
        this.members = this.members.map((member) => this.withResolvedApartment(member));

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

  private withResolvedApartment(member: BuildingMemberDTO): BuildingMemberDTO {
    if (member.floor != null && member.apartmentNumber) {
      return member;
    }

    const managerApartment = this.findManagerApartment(member);
    if (!managerApartment) {
      return member;
    }

    return {
      ...member,
      floor: member.floor ?? managerApartment.floor,
      apartmentNumber: member.apartmentNumber ?? managerApartment.number
    };
  }

  private findManagerApartment(member: BuildingMemberDTO): ApartmentDTO | undefined {
    if (member.role !== 'BuildingManager') {
      return undefined;
    }

    const managerApartmentCandidates = this.buildingApartments.filter((apartment) => apartment.isManagerHouse);
    const memberFullName = member.fullName?.trim().toLowerCase();
    const buildingManagerFullName = this.currentBuilding?.managerFullName?.trim().toLowerCase();

    return managerApartmentCandidates.find((apartment) => {
      if (member.userId != null && apartment.ownerId === member.userId) {
        return true;
      }

      if (!apartment.isManagerHouse) {
        return false;
      }

      if (member.userId != null && apartment.managerId) {
        return Number(apartment.managerId) === member.userId;
      }

      const buildingManagerId = this.currentBuilding?.managerId;
      if (buildingManagerId != null && apartment.managerId) {
        return Number(apartment.managerId) === buildingManagerId;
      }

      if (memberFullName && apartment.managerFullName?.trim().toLowerCase() === memberFullName) {
        return true;
      }

      if (buildingManagerFullName && apartment.managerFullName?.trim().toLowerCase() === buildingManagerFullName) {
        return true;
      }

      return false;
    }) ?? (managerApartmentCandidates.length === 1 ? managerApartmentCandidates[0] : undefined);
  }

  getMemberApartmentLabel(member: BuildingMemberDTO): string {
  const floor = member.floor?.trim();
  const number = member.apartmentNumber?.trim();

  return floor || number
    ? `${floor ?? ''}${number ?? ''}`
    : '—';
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

  getTranslatedStatus(status: MemberDisplayStatus): string {
    switch (status) {
      case 'JOINED':
      case 'ACCEPTED':
        return 'Μέλος';

      case 'INVITED':
      case 'PENDING':
        return 'Σε αναμονή πρόσκλησης';

      case 'PENDING_APARTMENT':
        return 'Αναμονή για ανάθεση διαμερίσματος';

      case 'EXPIRED':
        return 'Η πρόσκληση έληξε';

      case 'CANCELLED':
        return 'Η πρόσκληση ακυρώθηκε';

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

  imgSrc(url?: string | null): string {
    const fallbackImage = 'assets/images/user/avatar-5.jpg';

    if (!url || url.trim() === '') {
      return fallbackImage;
    }

    const cleanUrl = url.trim().replace(/\\/g, '/');

    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:')) {
      return cleanUrl;
    }

    if (cleanUrl.startsWith('/uploads/')) {
      return `${this.apiBase}${cleanUrl}`;
    }

    if (cleanUrl.startsWith('uploads/')) {
      return `${this.apiBase}/${cleanUrl}`;
    }

    return cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
  }

  canManageMembers(): boolean {
    const currentUser = this.authService.currentUserValue;

    if (!currentUser) {
      return false;
    }

    const currentMembership = this.members.find((member) => member.userId === currentUser.id || member.email === currentUser.email);

    return currentMembership?.role === 'BuildingManager' || currentMembership?.role === 'PropertyManager';
  }
}
